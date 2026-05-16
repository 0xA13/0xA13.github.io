(function () {

const {
  useEffect: useEffectCmd,
  useState: useStateCmd,
  useMemo: useMemoCmd,
  useRef: useRefCmd
} = React;
function CommandPalette({
  open,
  onClose,
  onOpenPost,
  onNavigate
}) {
  const [q, setQ] = useStateCmd("");
  const [active, setActive] = useStateCmd(0);
  const inputRef = useRefCmd(null);
  useEffectCmd(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    }
  }, [open]);
  const results = useMemoCmd(() => {
    const posts = window.POSTS || [];
    const nav = [{
      kind: "nav",
      id: "index",
      label: "Go to index",
      meta: "/"
    }, {
      kind: "nav",
      id: "whoami",
      label: "whoami · contact",
      meta: "/whoami"
    }];
    const items = [...nav, ...posts.map((p, idx) => ({
      kind: "post",
      id: p.id,
      label: p.title,
      meta: `§${String(posts.length - idx).padStart(4, "0")} · ${p.date}`,
      tags: p.tags
    }))];
    if (!q.trim()) return items;
    const needle = q.toLowerCase();
    return items.map(it => {
      const hay = (it.label + " " + (it.meta || "") + " " + (it.tags || []).join(" ")).toLowerCase();
      const idx = hay.indexOf(needle);
      if (idx === -1) return null;
      return {
        ...it,
        score: idx
      };
    }).filter(Boolean).sort((a, b) => a.score - b.score);
  }, [q]);
  useEffectCmd(() => {
    setActive(0);
  }, [q]);
  const choose = item => {
    if (!item) return;
    if (item.kind === "post") onOpenPost(item.id);else onNavigate(item.id);
    onClose();
  };
  const onKey = e => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(a => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(a => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[active]);
    }
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "cmdk-backdrop",
    onMouseDown: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "cmdk",
    onMouseDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "cmdk-prompt"
  }, /*#__PURE__*/React.createElement("span", {
    className: "caret"
  }, "\u258D"), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: q,
    onChange: e => setQ(e.target.value),
    onKeyDown: onKey,
    placeholder: "search posts, tags, pages\u2026",
    spellCheck: false
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "var(--fg-2)",
      letterSpacing: "0.08em",
      textTransform: "uppercase"
    }
  }, results.length, " match", results.length === 1 ? "" : "es")), /*#__PURE__*/React.createElement("div", {
    className: "cmdk-list"
  }, results.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "cmdk-section-label"
  }, "no matches \u2014 try fewer chars"), results.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: it.kind + ":" + it.id,
    className: "cmdk-item" + (i === active ? " active" : ""),
    onMouseEnter: () => setActive(i),
    onMouseDown: e => e.preventDefault(),
    onClick: () => choose(it)
  }, /*#__PURE__*/React.createElement("span", {
    className: "marker"
  }, it.kind === "post" ? "▸" : "↳"), /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, it.label), /*#__PURE__*/React.createElement("span", {
    className: "meta"
  }, it.meta)))), /*#__PURE__*/React.createElement("div", {
    className: "cmdk-footer"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "key"
  }, "\u2191"), /*#__PURE__*/React.createElement("span", {
    className: "key"
  }, "\u2193"), " navigate \xA0\xA0", /*#__PURE__*/React.createElement("span", {
    className: "key"
  }, "\u21B5"), " open"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "key"
  }, "esc"), " close"))));
}
window.CommandPalette = CommandPalette;
})();
