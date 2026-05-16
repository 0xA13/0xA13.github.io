function PostView({ post, onBack }) {
  if (!post) return null;
  // Number is computed from POSTS array position (newest first)
  const all = window.POSTS || [];
  const n = all.length - all.findIndex((p) => p.id === post.id);
  const num = "§" + String(n).padStart(4, "0");
  const html = window.md ? window.md.parse(post.body || "") : "";
  return (
    <div className="frame">
      <article className="post-view">
        <button className="post-back" onClick={onBack}>
          ← back to index
        </button>
        <div className="post-meta-top">
          <span className="n">{num}</span>
          <span>{post.date}</span>
          <span>{post.reading}</span>
          <span>{post.tags.join(" / ")}</span>
        </div>
        <h1 className="post-title">
          <DecodeText text={post.title} startNow={true} durMs={500} />
        </h1>
        <p className="post-summary">{post.summary}</p>
        <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />
        <div
          style={{
            marginTop: 56,
            paddingTop: 24,
            borderTop: "1px solid var(--rule)",
            fontSize: 10,
            color: "var(--fg-2)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <div>END · {num} · {post.date}</div>
          <div style={{ marginTop: 8 }}>
            sig <span style={{ color: "var(--fg-1)" }}>0xA13</span> · pgp 0xA13F&hellip;9C2B
          </div>
        </div>
      </article>
    </div>
  );
}

window.PostView = PostView;
