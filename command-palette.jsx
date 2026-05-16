const { useEffect: useEffectCmd, useState: useStateCmd, useMemo: useMemoCmd, useRef: useRefCmd } = React;

function CommandPalette({ open, onClose, onOpenPost, onNavigate }) {
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
    const nav = [
      { kind: "nav", id: "index", label: "Go to index", meta: "/" },
      { kind: "nav", id: "whoami", label: "whoami · contact", meta: "/whoami" },
    ];
    const items = [
      ...nav,
      ...posts.map((p, idx) => ({
        kind: "post",
        id: p.id,
        label: p.title,
        meta: `§${String(posts.length - idx).padStart(4, "0")} · ${p.date}`,
        tags: p.tags,
      })),
    ];
    if (!q.trim()) return items;
    const needle = q.toLowerCase();
    return items
      .map((it) => {
        const hay = (
          it.label +
          " " +
          (it.meta || "") +
          " " +
          (it.tags || []).join(" ")
        ).toLowerCase();
        const idx = hay.indexOf(needle);
        if (idx === -1) return null;
        return { ...it, score: idx };
      })
      .filter(Boolean)
      .sort((a, b) => a.score - b.score);
  }, [q]);

  useEffectCmd(() => {
    setActive(0);
  }, [q]);

  const choose = (item) => {
    if (!item) return;
    if (item.kind === "post") onOpenPost(item.id);
    else onNavigate(item.id);
    onClose();
  };

  const onKey = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[active]);
    }
  };

  if (!open) return null;

  return (
    <div className="cmdk-backdrop" onMouseDown={onClose}>
      <div className="cmdk" onMouseDown={(e) => e.stopPropagation()}>
        <div className="cmdk-prompt">
          <span className="caret">▍</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="search posts, tags, pages…"
            spellCheck={false}
          />
          <span style={{ fontSize: 10, color: "var(--fg-2)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {results.length} match{results.length === 1 ? "" : "es"}
          </span>
        </div>
        <div className="cmdk-list">
          {results.length === 0 && (
            <div className="cmdk-section-label">no matches — try fewer chars</div>
          )}
          {results.map((it, i) => (
            <div
              key={it.kind + ":" + it.id}
              className={"cmdk-item" + (i === active ? " active" : "")}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(it)}
            >
              <span className="marker">
                {it.kind === "post" ? "▸" : "↳"}
              </span>
              <span className="label">{it.label}</span>
              <span className="meta">{it.meta}</span>
            </div>
          ))}
        </div>
        <div className="cmdk-footer">
          <span>
            <span className="key">↑</span><span className="key">↓</span> navigate
            &nbsp;&nbsp;<span className="key">↵</span> open
          </span>
          <span>
            <span className="key">esc</span> close
          </span>
        </div>
      </div>
    </div>
  );
}

window.CommandPalette = CommandPalette;
