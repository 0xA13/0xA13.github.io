(function () {

const {
  useState,
  useEffect,
  useMemo
} = React;

const PAGE_SIZE = 10;

function TopBar({
  view,
  onNav,
  onOpenCmd
}) {
  const isMac = typeof navigator !== "undefined" && navigator.platform.toLowerCase().includes("mac");
  const cmdKey = isMac ? "⌘" : "ctrl";
  return /*#__PURE__*/React.createElement("header", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "frame"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar-inner"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mark",
    onClick: () => onNav("index")
  }, "0xA13"), /*#__PURE__*/React.createElement("div", {
    className: "nav"
  }, /*#__PURE__*/React.createElement("button", {
    className: view === "index" || view === "post" ? "active" : "",
    onClick: () => onNav("index")
  }, "index"), /*#__PURE__*/React.createElement("button", {
    className: view === "whoami" ? "active" : "",
    onClick: () => onNav("whoami")
  }, "whoami"), /*#__PURE__*/React.createElement("button", {
    className: "cmdk-hint",
    onClick: onOpenCmd,
    title: "Search"
  }, /*#__PURE__*/React.createElement("span", {
    className: "key"
  }, cmdKey), /*#__PURE__*/React.createElement("span", {
    className: "key"
  }, "K"))))));
}

function Hero() {
  const total = (window.POSTS || []).length;
  const today = new Date().toISOString().slice(0, 10);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "frame"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-stage",
    "data-screen-label": "01 Hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-corner bl"
  }, /*#__PURE__*/React.createElement("div", null, total.toString().padStart(3, "0"), " entries"), /*#__PURE__*/React.createElement("div", null, "since 2025")), /*#__PURE__*/React.createElement("div", {
    className: "hero-corner br"
  }, /*#__PURE__*/React.createElement("div", {
    className: "strong"
  }, today), /*#__PURE__*/React.createElement("div", null, "build \xB7 stable")), /*#__PURE__*/React.createElement(AsciiHero, null)), /*#__PURE__*/React.createElement("div", {
    className: "hero-caption"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lede"
  }, /*#__PURE__*/React.createElement(DecodeText, {
    text: "Various notes and writeups.",
    startNow: true,
    durMs: 700
  })))));
}

function PostRow({
  post,
  n,
  onOpen
}) {
  const num = "\xA7" + String(n).padStart(4, "0");
  return /*#__PURE__*/React.createElement("div", {
    className: "post-row",
    onClick: () => onOpen(post.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, num), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, post.title), /*#__PURE__*/React.createElement("div", {
    className: "summary"
  }, post.summary)), /*#__PURE__*/React.createElement("div", {
    className: "tags"
  }, post.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t
  }, t))), /*#__PURE__*/React.createElement("div", {
    className: "date"
  }, post.date), /*#__PURE__*/React.createElement("div", {
    className: "arrow"
  }, "\u2192"));
}

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i);
  return /*#__PURE__*/React.createElement("div", {
    className: "pagination"
  },
    /*#__PURE__*/React.createElement("button", {
      className: "page-btn" + (page === 0 ? " disabled" : ""),
      onClick: () => page > 0 && onPage(page - 1),
      disabled: page === 0
    }, "\u2190 prev"),
    /*#__PURE__*/React.createElement("div", { className: "page-nums" },
      pages.map(i =>
        /*#__PURE__*/React.createElement("button", {
          key: i,
          className: "page-num" + (i === page ? " active" : ""),
          onClick: () => onPage(i)
        }, String(i + 1).padStart(2, "0"))
      )
    ),
    /*#__PURE__*/React.createElement("button", {
      className: "page-btn" + (page === totalPages - 1 ? " disabled" : ""),
      onClick: () => page < totalPages - 1 && onPage(page + 1),
      disabled: page === totalPages - 1
    }, "next \u2192")
  );
}

function IndexView({
  onOpenPost
}) {
  const [tag, setTag] = useState(null);
  const [page, setPage] = useState(0);
  const posts = window.POSTS || [];
  const allTags = useMemo(() => {
    const set = new Set();
    posts.forEach(p => p.tags.forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [posts]);
  const filtered = tag ? posts.filter(p => p.tags.includes(tag)) : posts;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const setTagAndReset = t => {
    setTag(t);
    setPage(0);
  };

  const goPage = p => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement("div", {
    className: "frame"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sect-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sigil"
  }, "\xA7"), "INDEX"), /*#__PURE__*/React.createElement("span", null, filtered.length.toString().padStart(2, "0"), " / ", posts.length.toString().padStart(2, "0"), tag ? ` \xB7 ${tag}` : "")), /*#__PURE__*/React.createElement("div", {
    className: "tagrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "filter \u2500"), allTags.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    className: "tag" + (tag === t ? " active" : ""),
    onClick: () => setTagAndReset(tag === t ? null : t)
  }, t)), tag && /*#__PURE__*/React.createElement("button", {
    className: "tag clear",
    onClick: () => setTagAndReset(null)
  }, "\xD7 clear")), /*#__PURE__*/React.createElement("div", {
    className: "index"
  }, /*#__PURE__*/React.createElement("div", {
    className: "posts"
  }, paginated.map(p => /*#__PURE__*/React.createElement(PostRow, {
    key: p.id,
    post: p,
    n: posts.length - posts.indexOf(p),
    onOpen: onOpenPost
  })), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "40px 0",
      color: "var(--fg-2)",
      fontSize: 12
    }
  }, "no posts under this tag.")),
  /*#__PURE__*/React.createElement(Pagination, {
    page: page,
    totalPages: totalPages,
    onPage: goPage
  }))));
}

function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "frame"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-row"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "strong"
  }, "0xA13"), " \xB7 notes \xB7 2026 \u2014 "), /*#__PURE__*/React.createElement("span", null, "boo"))));
}

function App() {
  const [view, setView] = useState("index");
  const [activePostId, setActivePostId] = useState(null);
  const [cmdOpen, setCmdOpen] = useState(false);
  const openPost = id => {
    setActivePostId(id);
    setView("post");
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const nav = v => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  useEffect(() => {
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen(o => !o);
      } else if (e.key === "Escape" && cmdOpen) {
        setCmdOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cmdOpen]);
  const activePost = (window.POSTS || []).find(p => p.id === activePostId);
  return /*#__PURE__*/React.createElement("div", {
    className: "shell"
  }, /*#__PURE__*/React.createElement(TopBar, {
    view: view,
    onNav: nav,
    onOpenCmd: () => setCmdOpen(true)
  }), /*#__PURE__*/React.createElement("main", {
    style: { flex: 1, position: "relative", zIndex: 2 },
    "data-screen-label": view === "index" ? "01 Index" : view === "whoami" ? "02 Whoami" : "03 Post"
  }, view === "index" && /*#__PURE__*/React.createElement(IndexView, {
    onOpenPost: openPost
  }), view === "whoami" && /*#__PURE__*/React.createElement(AboutView, null), view === "post" && /*#__PURE__*/React.createElement(PostView, {
    post: activePost,
    onBack: () => nav("index")
  })), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(CommandPalette, {
    open: cmdOpen,
    onClose: () => setCmdOpen(false),
    onOpenPost: openPost,
    onNavigate: nav
  }));
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/*#__PURE__*/React.createElement(App, null));
})();
