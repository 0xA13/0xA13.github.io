(function () {


function PostView({
  post,
  onBack
}) {
  if (!post) return null;
  // Number is computed from POSTS array position (newest first)
  const all = window.POSTS || [];
  const n = all.length - all.findIndex(p => p.id === post.id);
  const num = "§" + String(n).padStart(4, "0");
  const html = window.md ? window.md.parse(post.body || "") : "";
  return /*#__PURE__*/React.createElement("div", {
    className: "frame"
  }, /*#__PURE__*/React.createElement("article", {
    className: "post-view"
  }, /*#__PURE__*/React.createElement("button", {
    className: "post-back",
    onClick: onBack
  }, "\u2190 back to index"), /*#__PURE__*/React.createElement("div", {
    className: "post-meta-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, num), /*#__PURE__*/React.createElement("span", null, post.date), /*#__PURE__*/React.createElement("span", null, post.reading), /*#__PURE__*/React.createElement("span", null, post.tags.join(" / "))), /*#__PURE__*/React.createElement("h1", {
    className: "post-title"
  }, /*#__PURE__*/React.createElement(DecodeText, {
    text: post.title,
    startNow: true,
    durMs: 500
  })), /*#__PURE__*/React.createElement("p", {
    className: "post-summary"
  }, post.summary), /*#__PURE__*/React.createElement("div", {
    className: "post-body",
    dangerouslySetInnerHTML: {
      __html: html
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56,
      paddingTop: 24,
      borderTop: "1px solid var(--rule)",
      fontSize: 10,
      color: "var(--fg-2)",
      letterSpacing: "0.16em",
      textTransform: "uppercase"
    }
  }, /*#__PURE__*/React.createElement("div", null, "END \xB7 ", num, " \xB7 ", post.date), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, "sig ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--fg-1)"
    }
  }, "0xA13"), " \xB7 pgp 0xA13F\u20269C2B"))));
}
window.PostView = PostView;
})();
