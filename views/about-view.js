(function () {

const {
  useState: useStateAb
} = React;

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
  }, /*#__PURE__*/React.createElement("div", {
    className: "about-body"
  }, /*#__PURE__*/React.createElement("h2", null, "SUBJECT"), /*#__PURE__*/React.createElement("p", null, "Infrastructure penetration tester, with detours into malware analysis and vulnerability research. This site is where I leave notes on what I take apart."), /*#__PURE__*/React.createElement("h2", {
    className: "spaced"
  }, "FOCUS"), /*#__PURE__*/React.createElement("dl", {
    className: "about-list"
  }, /*#__PURE__*/React.createElement("dt", null, "primary"), /*#__PURE__*/React.createElement("dd", null, "penetration testing, malware analysis"), /*#__PURE__*/React.createElement("dt", null, "secondary"), /*#__PURE__*/React.createElement("dd", null, "vulnerability research, exploit development"), /*#__PURE__*/React.createElement("dt", null, "tertiary"), /*#__PURE__*/React.createElement("dd", null, "detection engineering"), /*#__PURE__*/React.createElement("dt", null, "tools"), /*#__PURE__*/React.createElement("dd", null, "IDA, Ghidra, x64dbg, WinDbg, Volatility"), /*#__PURE__*/React.createElement("dt", null, "writes"), /*#__PURE__*/React.createElement("dd", null, "C, Java, Python")), /*#__PURE__*/React.createElement("h2", {
    className: "spaced"
  }, "RULES OF ENGAGEMENT"), /*#__PURE__*/React.createElement("p", {
    className: "muted"
  }, "Posts here are personal lab notes and writeups, not a representation of any employer."), /*#__PURE__*/React.createElement("h2", {
    className: "spaced"
  }, "REACH"), /*#__PURE__*/React.createElement("div", {
    className: "about-socials"
  }, /*#__PURE__*/React.createElement(SocialRow, {
    k: "linkedin",
    v: "anakapulica",
    copy: "https://www.linkedin.com/in/anakapulica"
  }), /*#__PURE__*/React.createElement(SocialRow, {
    k: "github",
    v: "github.com/0xA13",
    copy: "https://github.com/0xA13"
  })))));
}
window.AboutView = AboutView;
})();