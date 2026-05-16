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
    title: "Test post",
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
  }
];
