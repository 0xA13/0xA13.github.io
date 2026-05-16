
const { useState: useStateAb } = React;

const ASCII_CARD = `┌──────────────────────────────────────┐
│  $ whoami                            │
│  > 0xA13                             │
│                                      │
│  ANA KAPULICA                        │
│  ───────────────                     │
│  penetration tester · hobbyist       │ 
│  malware analyst · vuln research     │
│                                      │
│                                      │
│  $ uname -a                          │
│  0xa13 6.x #1 SMP x86_64 GNU/Linux   │
│                                      │
│  $ id                                │
│  uid=1000(0xa13) gid=1000(staff)     │
│  groups=re,malware,fuzzing           │
│                                      │
│  $ uptime                            │
│   ~ since 2001                       │
│                                      │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░██████░░░░░░░░██░░░░██░░░░░░░░░░  │
│  ░░██░░██░░░░░░░░██░░██░░░░░░░░░░░░  │
│  ░░██████░░░░░░░░░████░░░░░░░░░░░░░  │
│  ░░██░░██░░░░░░░░██░░██░░░░░░░░░░░░  │
│  ░░██░░██░██████░██░░░░██░░0xA13░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                      │
│  $ _                                 │
└──────────────────────────────────────┘`;

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); } catch (e) {}
  document.body.removeChild(ta);
  return Promise.resolve();
}

function SocialRow({ k, v, copy }) {
  const [ok, setOk] = useStateAb(false);
  const onCopy = (e) => {
    e.stopPropagation();
    copyToClipboard(copy || v);
    setOk(true);
    setTimeout(() => setOk(false), 1400);
  };
  return (
    <div className="social-row">
      <span className="k">{k}</span>
      <span className="v">{v}</span>
      <button className={"copy" + (ok ? " ok" : "")} onClick={onCopy}>
        {ok ? "copied ✓" : "copy"}
      </button>
    </div>
  );
}

function AboutView() {
  return (
    <div className="frame">
      <div className="sect-head">
        <span className="label"><span className="sigil">§</span>WHOAMI</span>
        <span>profile · contact · 0xA13</span>
      </div>
      <div className="about">
        <pre className="about-portrait">{ASCII_CARD}</pre>
        <div className="about-body">
          <h2>SUBJECT</h2>
          <p>
            Ana Kapulica - online as <strong style={{ color: "var(--accent)" }}>0xA13</strong>.
            Infrastructure penetration tester, with detours into malware analysis & vulnerability
            research. This site is where I leave notes on what I take apart.
          </p>

          <h2 className="spaced">FOCUS</h2>
          <dl className="about-list">
            <dt>primary</dt><dd>penetration testing, malware reversing</dd>
            <dt>secondary</dt><dd>vulnerability research, exploit development</dd>
            <dt>tertiary</dt><dd>detection engineering - YARA, Sigma</dd>
            <dt>tools</dt><dd>IDA Pro, Ghidra, x64dbg, WinDbg</dd>
            <dt>writes</dt><dd>C, Java, Python</dd>
          </dl>

          <h2 className="spaced">RULES OF ENGAGEMENT</h2>
          <p className="muted">
            Posts here are personal lab notes, not a representation of any employer.
            Where CVEs are involved, vendor coordination is complete before publication.
          </p>

          <h2 className="spaced">REACH</h2>
          <div className="about-socials">
            <SocialRow k="email" v="ana@0xa13.dev" copy="ana@0xa13.dev" />
            <SocialRow k="github" v="github.com/0xA13" copy="https://github.com/0xA13" />
            <SocialRow k="mastodon" v="@0xA13@infosec.exchange" copy="https://infosec.exchange/@0xA13" />
            <SocialRow k="signal" v="0xa13.42" copy="0xa13.42" />
            <SocialRow k="rss" v="https://0xa13.dev/feed.xml" copy="https://0xa13.dev/feed.xml" />
            <SocialRow k="pgp" v="0xA13F · 9C2B" copy="0xA13F 4C82 9B71 D5E0 6F2A B341 5D90 E7C8 4B19 9C2B" />
          </div>

          <h2 className="spaced">COLOPHON</h2>
          <p className="muted">
            I love my cat Gary.
          </p>
        </div>
      </div>
    </div>
  );
}

window.AboutView = AboutView;
