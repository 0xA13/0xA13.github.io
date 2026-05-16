(function () {


const {
  useState: useStateAb
} = React;
const ASCII_CARD = `┌──────────────────────────────────────┐
│  $ whoami                            │
│  > 0xA13                             │
│                                      │
│  ANA KAPULICA                        │
│  ───────────────                     │
│  malware analyst · vuln research     │
│                                      │
│  $ uname -a                          │
│  0xa13 6.x #1 SMP x86_64 GNU/Linux   │
│                                      │
│  $ id                                │
│  uid=1000(0xa13) gid=1000(staff)     │
│  groups=re,detection,crypto          │
│                                      │
│  $ uptime                            │
│   ~ since 2017                       │
│                                      │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░██████░██████░██░░░░██░░░░░░░░░░  │
│  ░░██░░██░██░░░░░██░░██░░░░░░░░░░░░  │
│  ░░██████░██████░░████░░░░░░░░░░░░░  │
│  ░░██░░██░██░░░░░██░░██░░░░░░░░░░░░  │
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
  try {
    document.execCommand("copy");
  } catch (e) {}
  document.body.removeChild(ta);
  return Promise.resolve();
}
function SocialRow({
  k,
  v,
  copy
}) {
  const [ok, setOk] = useStateAb(false);
  const onCopy = e => {
    e.stopPropagation();
    copyToClipboard(copy || v);
    setOk(true);
    setTimeout(() => setOk(false), 1400);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "social-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, k), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, v), /*#__PURE__*/React.createElement("button", {
    className: "copy" + (ok ? " ok" : ""),
    onClick: onCopy
  }, ok ? "copied ✓" : "copy"));
}
function AboutView() {
  return /*#__PURE__*/React.createElement("div", {
    className: "frame"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sect-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sigil"
  }, "\xA7"), "WHOAMI"), /*#__PURE__*/React.createElement("span", null, "profile \xB7 contact \xB7 0xA13")), /*#__PURE__*/React.createElement("div", {
    className: "about"
  }, /*#__PURE__*/React.createElement("pre", {
    className: "about-portrait"
  }, ASCII_CARD), /*#__PURE__*/React.createElement("div", {
    className: "about-body"
  }, /*#__PURE__*/React.createElement("h2", null, "SUBJECT"), /*#__PURE__*/React.createElement("p", null, "Ana Kapulica \u2014 online as ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--accent)"
    }
  }, "0xA13"), ". Reverse engineer focused on Windows malware, with detours into vulnerability research and side-channel work. This site is where I leave notes on what I take apart."), /*#__PURE__*/React.createElement("h2", {
    className: "spaced"
  }, "FOCUS"), /*#__PURE__*/React.createElement("dl", {
    className: "about-list"
  }, /*#__PURE__*/React.createElement("dt", null, "primary"), /*#__PURE__*/React.createElement("dd", null, "malware reversing \u2014 Windows, ELF; unpacker authoring"), /*#__PURE__*/React.createElement("dt", null, "secondary"), /*#__PURE__*/React.createElement("dd", null, "vulnerability research, exploit development"), /*#__PURE__*/React.createElement("dt", null, "tertiary"), /*#__PURE__*/React.createElement("dd", null, "detection engineering \u2014 YARA, Sigma, ETW"), /*#__PURE__*/React.createElement("dt", null, "tools"), /*#__PURE__*/React.createElement("dd", null, "IDA Pro, Ghidra, x64dbg, WinDbg, Volatility, radare2"), /*#__PURE__*/React.createElement("dt", null, "writes"), /*#__PURE__*/React.createElement("dd", null, "C, Python, a little Rust when patience permits")), /*#__PURE__*/React.createElement("h2", {
    className: "spaced"
  }, "RULES OF ENGAGEMENT"), /*#__PURE__*/React.createElement("p", {
    className: "muted"
  }, "Posts here are personal lab notes \u2014 not a representation of any employer. All samples are detonated in isolated VMs on an air-gapped network. Where CVEs are involved, vendor coordination is complete before publication."), /*#__PURE__*/React.createElement("h2", {
    className: "spaced"
  }, "REACH"), /*#__PURE__*/React.createElement("div", {
    className: "about-socials"
  }, /*#__PURE__*/React.createElement(SocialRow, {
    k: "email",
    v: "ana@0xa13.dev",
    copy: "ana@0xa13.dev"
  }), /*#__PURE__*/React.createElement(SocialRow, {
    k: "github",
    v: "github.com/0xA13",
    copy: "https://github.com/0xA13"
  }), /*#__PURE__*/React.createElement(SocialRow, {
    k: "mastodon",
    v: "@0xA13@infosec.exchange",
    copy: "https://infosec.exchange/@0xA13"
  }), /*#__PURE__*/React.createElement(SocialRow, {
    k: "signal",
    v: "0xa13.42",
    copy: "0xa13.42"
  }), /*#__PURE__*/React.createElement(SocialRow, {
    k: "rss",
    v: "https://0xa13.dev/feed.xml",
    copy: "https://0xa13.dev/feed.xml"
  }), /*#__PURE__*/React.createElement(SocialRow, {
    k: "pgp",
    v: "0xA13F \xB7 9C2B",
    copy: "0xA13F 4C82 9B71 D5E0 6F2A B341 5D90 E7C8 4B19 9C2B"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "spaced"
  }, "COLOPHON"), /*#__PURE__*/React.createElement("p", {
    className: "muted"
  }, "Hand-rolled. IBM Plex Mono. No frameworks beyond what's strictly needed, no analytics, no fonts loaded from networks I don't trust. The skull on the front page is rendered live \u2014 a signed-distance field shaded with a character ramp, perturbed by your cursor."))));
}
window.AboutView = AboutView;
})();
