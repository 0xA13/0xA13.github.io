/* ============================================================
   POSTS — newest first. To add a new post, just paste a new
   object at the TOP of this array. To delete, remove its block.
   Tags are free-form — any new tag automatically appears in the
   filter row on the index. Post numbers (§NNNN) are computed
   from position, so you never edit them by hand.

   Required fields:
     id       url-safe slug, must be unique
     title    string
     date     ISO date "YYYY-MM-DD"
     tags     array of strings
     reading  string e.g. "9 min"
     summary  one-paragraph blurb shown on the index
     body     markdown string (## headings, paragraphs, ```fences```)
   ============================================================ */

window.POSTS = [
  {
    id: "emotet-packer",
    title: "Reversing Emotet's custom packer in IDA Pro",
    date: "2026-05-09",
    tags: ["malware", "reversing"],
    reading: "14 min",
    summary:
      "A walk through Emotet's three-stage runtime unpacker: API hashing, the XOR'd payload stub, and the in-memory PE reflective load. Includes the IDAPython script used to flatten the control-flow obfuscation.",
    body: `
## Context

The sample (SHA-256 c3a4…b81f) was retrieved from a phishing wave on 2026-04-22. It ships as an Office macro that drops a packed loader to %ProgramData%\\loader.exe. This writeup focuses only on the unpacker; the resulting payload is a vanilla Emotet module loader documented elsewhere.

## Stage 1 — API hashing

All imports resolve at runtime through a ROR13 hash over the export table of each loaded module. The hash list is XOR'd against a 32-byte key derived from the build timestamp in the PE header, so static IAT reconstruction is not viable.

\`\`\`
uint32_t hash(const char* s) {
  uint32_t h = 0;
  while (*s) {
    h = (h >> 13) | (h << 19);
    h += *s++;
  }
  return h;
}
\`\`\`

## Stage 2 — payload stub

The payload is stored as an encrypted blob in the .rdata section, prefixed with a 16-byte header: 4-byte magic (0x4D5A0000), 4-byte size, 8-byte XOR key. Decryption is straightforward and yields a position-independent shellcode that performs the reflective load.

## Stage 3 — reflective load

The shellcode walks the PEB to locate kernel32, resolves LoadLibraryA and GetProcAddress, and maps the embedded DLL section-by-section. Notably, the relocation pass clears the .reloc directory after applying, which trips up some unpackers that rely on a final dump-and-fix.

## Detection notes

The build timestamp is the same across the cluster (0x60E3A1C8). Yara rule and Volatility plugin in the repo linked below.
`,
  },
  {
    id: "cobalt-config",
    title: "Notes on Cobalt Strike beacon config extraction",
    date: "2026-04-27",
    tags: ["malware", "c2"],
    reading: "9 min",
    summary:
      "The config block hasn't really changed since 4.x — what has changed is how operators are hiding it. Notes on locating the encoded blob in shellcode-only deployments where there is no PE.",
    body: `
## The setting structure

Each setting is a TLV: 2-byte index, 2-byte type, 2-byte length, then the value. Types 1 (short), 2 (int), 3 (binary blob). The block is XOR'd with a single byte (commonly 0x2E or 0x69) and embedded somewhere in the beacon image.

## Finding it without a PE

In a stageless shellcode dump the .data section anchor is gone. The block still has a recognizable signature: the first two settings are always 0x0001/0x0001 (BeaconType) and 0x0002/0x0001 (Port), so scanning for the XOR'd pattern (0x2E 0x2D 0x2E 0x2C 0x2E 0x2D 0x2E 0x2D) recovers the offset reliably.

## Notable fields

Field 0x0008 (HttpGet_Metadata) is the most informative — it encodes the C2 profile transform pipeline that operators customize. A profile fingerprint over this field clusters operators across unrelated campaigns surprisingly well.
`,
  },
  {
    id: "libssh-heap",
    title: "CVE-2026-31142: heap overflow in libssh agent forwarding",
    date: "2026-04-11",
    tags: ["cve", "writeup"],
    reading: "21 min",
    summary:
      "Off-by-one in the agent forwarding channel handler. Triggerable post-auth on any libssh server with agent forwarding enabled. Patched in 0.10.7.",
    body: `
## Root cause

\`channel_open_agent()\` allocates a buffer sized from a uint32_t read off the wire, then writes (size + 1) bytes during the request-id append. With size == 0xFFFFFFFF the allocation wraps to zero and the subsequent write corrupts the adjacent chunk header.

\`\`\`
buf = malloc(size);             // size attacker-controlled
memcpy(buf, payload, size);
buf[size] = '\\0';                // off-by-one
\`\`\`

## Reachability

The vulnerable path requires (a) successful authentication and (b) agent forwarding enabled in sshd_config. On default configurations agent forwarding is opt-in per-session, so exploitation pre-supposes a foothold. Still notable for lateral movement scenarios where an attacker has user credentials on a bastion.

## Exploitation

Reliable RCE depends on heap grooming via the channel-data primitive, which lets the attacker shape the heap before the overflowing allocation. PoC achieves RIP control on glibc 2.38; ASLR bypass requires an additional info-leak (see § Leak primitive below).

## Patch

Commit 4b1a9e2 in libssh upstream adds a size_t bounds check before the malloc. Mitigations: disable agent forwarding (\`AllowAgentForwarding no\`) on bastions handling untrusted users.
`,
  },
  {
    id: "yara-fileless",
    title: "Building a YARA rule for fileless PowerShell loaders",
    date: "2026-03-29",
    tags: ["detection", "windows"],
    reading: "7 min",
    summary:
      "AMSI buffer scanning gives you the decoded script content, which means the rule lives or dies on choosing strings that survive obfuscators but are rare in legitimate scripts.",
    body: `
## Targeting the decoded buffer

An AMSI ETW provider session (\`Microsoft-Antimalware-Scan-Interface\`) yields the decoded script body each time AMSI scans. Loading these buffers into a YARA scan-pipe gives us cleartext to match against, side-stepping the encoded \`-EncodedCommand\` layer.

## What survives obfuscation

Variable names, string literals, and control-flow get mangled. What tends to survive: (1) byte-for-byte API call sequences against reflection (Invoke, GetMethod, MakeGenericMethod), (2) the structure of GAC type names, (3) the exact byte signatures of embedded PE blobs after base64 decode.

## Rule shape

Three string anchors plus a condition on file-size cuts false positives below 0.1% on a corpus of 40k benign scripts collected from sysadmin telemetry. Full rule in the repo.
`,
  },
  {
    id: "curve25519-timing",
    title: "Side-channel timing on Curve25519 field reductions",
    date: "2026-03-08",
    tags: ["crypto", "writeup"],
    reading: "18 min",
    summary:
      "A 4ns timing difference in the conditional subtraction at the end of the Montgomery reduction. Not exploitable across a network on its own — but combined with rowhammer-style amplification, recovers the private scalar in 2²⁰ samples.",
    body: `
## The conditional subtraction

After the Montgomery multiplication, the result may exceed p and require a final subtraction. Most reference implementations gate this on a comparison, which is conditional on the secret-dependent value. The branch predictor learns the pattern, leaking one bit per multiplication.

## Amplification

On its own the timing delta is ~4ns and lost in network noise. We pair the leak with a co-located process running rowhammer-style memory contention, amplifying the predictor's mispredict cost to ~80ns — recoverable across a LAN.

## Mitigation

Constant-time conditional subtraction (a masked subtract that always runs). The patch is two instructions but most distros still ship the branchy version in older OpenSSL builds.
`,
  },
  {
    id: "jenkins-rce",
    title: "From bug bounty to RCE: a chain through Jenkins plugins",
    date: "2026-02-14",
    tags: ["webapp", "writeup"],
    reading: "16 min",
    summary:
      "Three low-severity findings chained: a path traversal in plugin-A reads creds.xml, an SSRF in plugin-B reaches the internal artifact store, and a deserialization quirk in plugin-C executes. None individually were rewarded; together the chain paid out as a critical.",
    body: `
## Link 1 — path traversal

plugin-A exposes \`/download?file=…\` with a naive realpath check that accepts symlinks. By planting a symlink in a build workspace pointing at \`$JENKINS_HOME\`, an authenticated user reads any file under the controller — including credentials.xml.

## Link 2 — SSRF

plugin-B accepts a callback URL that is fetched from the controller without SSRF filtering. With the credentials.xml decryption key (link 1), we mint a valid internal token and reach the artifact store at \`http://internal.artifacts/\`.

## Link 3 — deserialization

plugin-C deserializes artifact metadata using stock Java ObjectInputStream. The artifact store is now an attacker-writable surface (link 2), so we drop a CommonsCollections gadget chain. RCE on the controller, agents inherit.

## Disclosure

Reported 2025-11-04. Patched in plugin-A 3.2.1, plugin-B 1.8.4, plugin-C 4.0.2. Critical CVE assigned for plugin-A only; the others retained their lower ratings, which is fine — the chain is the bug.
`,
  },
  {
    id: "syscall-hook",
    title: "Hooking Windows syscalls without modifying ntdll",
    date: "2026-01-25",
    tags: ["windows", "reversing"],
    reading: "12 min",
    summary:
      "A VEH-based trick that intercepts NT* syscalls by setting hardware breakpoints on the syscall instruction, no inline patches, survives ntdll integrity checks.",
    body: `
## Why not inline patch

Inline hooks on ntdll's NtCreateFile etc. are trivially detected by EDRs that hash the .text section against the on-disk image. Recent kernel patches also lock NtUnmapViewOfSection paths that allow ntdll replacement.

## Hardware breakpoint approach

Dr0–Dr3 give us four hardware breakpoints per thread. We point Dr0 at the syscall instruction (at \`ntdll!NtCreateFile+0x12\` on Win11 26100), enable the breakpoint via Dr7, and install a vectored exception handler. When the thread reaches the syscall, the breakpoint fires, our handler reads the args from the register file, calls our pre-syscall hook, and resumes.

## Limitations

Four breakpoints means four hooks per thread. To monitor more syscalls per thread you rotate breakpoints in the handler, paying a cache penalty. For full coverage we set up a worker thread per syscall family.
`,
  },
  {
    id: "go-ransomware",
    title: "Static analysis of a Go-based ransomware sample",
    date: "2026-01-03",
    tags: ["malware", "reversing"],
    reading: "11 min",
    summary:
      "Go binaries strip nicely with -ldflags but the runtime metadata (gopclntab, moduledata) still leaks the source tree. Walkthrough of recovering symbol names and the AES-CTR + RSA-2048 hybrid scheme.",
    body: `
## Recovering symbols

\`gopclntab\` maps PC ranges to source file:line. Even stripped binaries keep it because the Go runtime needs it for stack traces. The IDA plugin GoReSym pulls function names back from this table; we get 87% coverage on this sample.

## Encryption scheme

Per-file: random 32-byte AES key, random 16-byte IV. File body is encrypted AES-256-CTR, then the (key|iv) is encrypted with a 2048-bit RSA public key embedded in the binary. Appended as a 256-byte trailer.

## Recovery

No flaw in the scheme itself. The sample reuses the PRNG seed in a development build leaked to VirusTotal three days before the campaign — a separate post on that.
`,
  },
];
