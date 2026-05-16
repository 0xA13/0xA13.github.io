(function () {
  function esc(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function inline(s) {
    // Order matters. Operate on already-escaped text.
    return s
      // inline code
      .replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`)
      // bold
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      // italic
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      // links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) =>
        `<a href="${u}" rel="noopener">${t}</a>`
      );
  }

  function parse(md) {
    if (!md) return "";
    const lines = String(md).replace(/\r\n/g, "\n").split("\n");
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      // Fenced code block
      if (/^\s*```/.test(line)) {
        const buf = [];
        i++;
        while (i < lines.length && !/^\s*```/.test(lines[i])) {
          buf.push(lines[i]);
          i++;
        }
        i++; // consume closing fence
        out.push(`<pre><code>${esc(buf.join("\n"))}</code></pre>`);
        continue;
      }

      // Heading
      const h = /^##\s+(.*)$/.exec(line);
      if (h) {
        out.push(`<h2>${inline(esc(h[1].trim()))}</h2>`);
        i++;
        continue;
      }

      // Blank line — skip
      if (/^\s*$/.test(line)) {
        i++;
        continue;
      }

      // Paragraph — consume contiguous non-blank, non-heading lines
      const buf = [line];
      i++;
      while (
        i < lines.length &&
        !/^\s*$/.test(lines[i]) &&
        !/^##\s+/.test(lines[i]) &&
        !/^\s*```/.test(lines[i])
      ) {
        buf.push(lines[i]);
        i++;
      }
      out.push(`<p>${inline(esc(buf.join(" ")))}</p>`);
    }
    return out.join("\n");
  }

  window.md = { parse };
})();
