const { useEffect, useRef } = React;

const RAMP = " ·.\':;-+~=ic*ox%&@";
const RAMP_IDX = (() => {
  const m = new Map();
  for (let i = 0; i < RAMP.length; i++) m.set(RAMP[i], i);
  return m;
})();

function AsciiHero() {
  const preRef = useRef(null);
  const stateRef = useRef({
    base: null,
    cols: 0,
    rows: 0,
    mxN: -999,
    myN: -999,
    tmxN: -999,
    tmyN: -999,
    t0: 0,
    raf: 0,
  });

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    const st = stateRef.current;
    st.t0 = performance.now();

    const raw = (window.CHESHIRE_ASCII || "").split("\n");
    const rows = raw.length;
    const cols = raw[0] ? raw[0].length : 0;
    const base = new Array(rows);
    for (let r = 0; r < rows; r++) {
      const arr = new Int8Array(cols);
      const line = raw[r];
      for (let c = 0; c < cols; c++) {
        const ch = line[c];
        const i = RAMP_IDX.get(ch);
        arr[c] = i === undefined ? 0 : i;
      }
      base[r] = arr;
    }
    st.base = base;
    st.cols = cols;
    st.rows = rows;

    const fit = () => {
      const rect = pre.getBoundingClientRect();
      if (!rect.width || !rect.height || !cols || !rows) return;
      const fontByW = rect.width / (cols * 0.6);
      const fontByH = rect.height / rows;
      const font = Math.floor(Math.min(fontByW, fontByH));
      pre.style.fontSize = Math.max(6, font) + "px";
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(pre);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fit);
    }

    const onMove = (e) => {
      const rect = pre.getBoundingClientRect();
      st.tmxN = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      st.tmyN = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    const onLeave = () => {
      st.tmxN = -999;
      st.tmyN = -999;
    };
    window.addEventListener("mousemove", onMove);
    pre.addEventListener("mouseleave", onLeave);

    // Cheap deterministic noise hash per cell — gives each cell a phase offset
    // so shimmer doesn't move in lockstep.
    const cellPhase = new Float32Array(rows * cols);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const s = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453;
        cellPhase[r * cols + c] = s - Math.floor(s);
      }
    }

    const tick = () => {
      const t = (performance.now() - st.t0) / 1000;

      if (st.tmxN !== -999) {
        if (st.mxN === -999) {
          st.mxN = st.tmxN;
          st.myN = st.tmyN;
        }
        st.mxN += (st.tmxN - st.mxN) * 0.22;
        st.myN += (st.tmyN - st.myN) * 0.22;
      } else {
        st.mxN = -999;
        st.myN = -999;
      }

      const { base, cols, rows } = st;
      if (!base) return;
      const haveCur = st.mxN !== -999;
      const out = new Array(rows);
      const RMAX = RAMP.length - 1;

      // A diagonal wave that ripples through the cat
      const waveSpeed = 1.6;
      const waveK = 0.085;

      for (let r = 0; r < rows; r++) {
        const ny = (r / (rows - 1)) * 2 - 1;
        let line = "";
        for (let c = 0; c < cols; c++) {
          const nx = (c / (cols - 1)) * 2 - 1;
          let idx = base[r][c];

          // ─── AMBIENT LIFE ──────────────────────────────────────
          // Per-cell shimmer (cells offset in phase via hash)
          const phase = cellPhase[r * cols + c];
          // 1) Slow breath — whole image gently shifts up/down ramp
          const breath = Math.sin(t * 0.9) * 0.6;
          // 2) Per-cell shimmer — small per-cell flutter
          const flutter = Math.sin(t * 3.2 + phase * 6.28) * 0.7;
          // 3) Diagonal wave passing through
          const wave = Math.sin((c + r) * waveK - t * waveSpeed) * 0.8;
          // 4) Occasional skipped flicker on a small fraction of cells
          let flicker = 0;
          if (phase > 0.965) {
            // ~3.5% of cells flicker between idx and idx+2
            flicker = ((Math.floor(t * 8 + phase * 17) & 1) === 0) ? 0 : 2;
          }

          // Only modulate ink cells — pure background stays black
          if (idx > 0) {
            const modulated = idx + breath + flutter + wave + flicker;
            idx = Math.max(1, Math.min(RMAX, Math.round(modulated)));
          } else {
            // Near-edge background cells occasionally show a faint dot
            // when the wave + flutter peaks. Adds atmosphere without
            // making the empty zones look noisy.
            const edgeGlow = wave + flutter + breath;
            if (edgeGlow > 1.9 && phase > 0.85) idx = 1;
          }

          // ─── CURSOR BLOOM ──────────────────────────────────────
          if (haveCur) {
            const dx = nx - st.mxN;
            const dy = (ny - st.myN) * 0.62; // aspect correction (cells tall)
            const d2 = dx * dx + dy * dy;
            const near = Math.exp(-d2 * 30);
            if (near > 0.04) {
              if (idx > 0) {
                // Existing ink intensifies under the cursor
                idx = Math.min(RMAX, idx + Math.round(near * 6));
              } else if (near > 0.55) {
                // Very close to cursor, empty background gets a faint dot —
                // cat surface "rising" toward the touch.
                idx = 1 + Math.floor(Math.random() * 2);
              }
              // Shimmer near cursor — cycle ±1
              if (near > 0.30) {
                const sh = ((Math.floor(t * 16) + c * 7 + r * 11) % 3) - 1;
                idx = Math.max(0, Math.min(RMAX, idx + sh));
              }
            }
          }

          line += RAMP[idx];
        }
        out[r] = line;
      }

      pre.textContent = out.join("\n");
      st.raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(st.raf);
      window.removeEventListener("mousemove", onMove);
      pre.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
    };
  }, []);

  return <pre ref={preRef} className="hero-ascii" aria-hidden="true"></pre>;
}

window.AsciiHero = AsciiHero;
