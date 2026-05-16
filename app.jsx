const { useState, useEffect, useMemo } = React;

function TopBar({ view, onNav, onOpenCmd }) {
  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toLowerCase().includes("mac");
  const cmdKey = isMac ? "⌘" : "ctrl";
  return (
    <header className="topbar">
      <div className="frame">
        <div className="topbar-inner">
          <button className="mark" onClick={() => onNav("index")}>
            0xA13
          </button>
          <div className="nav">
            <button
              className={view === "index" || view === "post" ? "active" : ""}
              onClick={() => onNav("index")}
            >
              index
            </button>
            <button
              className={view === "whoami" ? "active" : ""}
              onClick={() => onNav("whoami")}
            >
              whoami
            </button>
            <button className="cmdk-hint" onClick={onOpenCmd} title="Search">
              <span className="key">{cmdKey}</span>
              <span className="key">K</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const total = (window.POSTS || []).length;
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <div className="frame">
        <div className="hero-stage" data-screen-label="01 Hero">
          <div className="hero-corner bl">
            <div>{total.toString().padStart(3, "0")} entries</div>
            <div>since 2024</div>
          </div>
          <div className="hero-corner br">
            <div className="strong">{today}</div>
            <div>build · stable</div>
          </div>
          <AsciiHero />
        </div>

        <div className="hero-caption">
          <div className="lede">
            <DecodeText
              text="Lab notes on malware, vulnerabilities, and the occasional side-channel."
              startNow={true}
              durMs={700}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function PostRow({ post, n, onOpen }) {
  const num = "§" + String(n).padStart(4, "0");
  return (
    <div className="post-row" onClick={() => onOpen(post.id)}>
      <div className="n">{num}</div>
      <div>
        <div className="title">{post.title}</div>
        <div className="summary">{post.summary}</div>
      </div>
      <div className="tags">
        {post.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="date">{post.date}</div>
      <div className="arrow">→</div>
    </div>
  );
}

function IndexView({ onOpenPost }) {
  const [tag, setTag] = useState(null);
  const posts = window.POSTS || [];
  const allTags = useMemo(() => {
    const set = new Set();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [posts]);
  const filtered = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;

  return (
    <>
      <Hero />
      <div className="frame">
        <div className="sect-head">
          <span className="label">
            <span className="sigil">§</span>INDEX
          </span>
          <span>
            {filtered.length.toString().padStart(2, "0")} / {posts.length.toString().padStart(2, "0")}
            {tag ? ` · ${tag}` : ""}
          </span>
        </div>
        <div className="tagrow">
          <span className="label">filter ─</span>
          {allTags.map((t) => (
            <button
              key={t}
              className={"tag" + (tag === t ? " active" : "")}
              onClick={() => setTag(tag === t ? null : t)}
            >
              {t}
            </button>
          ))}
          {tag && (
            <button className="tag clear" onClick={() => setTag(null)}>
              × clear
            </button>
          )}
        </div>
        <div className="index">
          <div className="posts">
            {filtered.map((p) => (
              <PostRow
                key={p.id}
                post={p}
                n={posts.length - posts.indexOf(p)}
                onOpen={onOpenPost}
              />
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: "40px 0", color: "var(--fg-2)", fontSize: 12 }}>
                no posts under this tag.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="frame">
        <div className="footer-row">
          <span>
            <span className="strong">0xA13 / ANA KAPULICA</span> ·
            lab notes · 2024 — 2026
          </span>
          <span>no cookies · no analytics · pgp 0xA13F·9C2B</span>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [view, setView] = useState("index"); // index | whoami | post
  const [activePostId, setActivePostId] = useState(null);
  const [cmdOpen, setCmdOpen] = useState(false);

  const openPost = (id) => {
    setActivePostId(id);
    setView("post");
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const nav = (v) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      } else if (e.key === "Escape" && cmdOpen) {
        setCmdOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cmdOpen]);

  const activePost = (window.POSTS || []).find((p) => p.id === activePostId);

  return (
    <div className="shell">
      <TopBar
        view={view}
        onNav={nav}
        onOpenCmd={() => setCmdOpen(true)}
      />

      <main
        style={{ flex: 1, position: "relative", zIndex: 2 }}
        data-screen-label={
          view === "index" ? "01 Index" :
          view === "whoami" ? "02 Whoami" :
          "03 Post"
        }
      >
        {view === "index" && <IndexView onOpenPost={openPost} />}
        {view === "whoami" && <AboutView />}
        {view === "post" && (
          <PostView post={activePost} onBack={() => nav("index")} />
        )}
      </main>

      <Footer />

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onOpenPost={openPost}
        onNavigate={nav}
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
