const { useEffect: useEffectDec, useRef: useRefDec, useState: useStateDec } = React;

const DECODE_CHARS = "!<>-_\\/[]{}—=+*^?#________01ABCDEF";

function DecodeText({ text, as: Tag = "span", className = "", delay = 0, durMs = 700, startNow = false }) {
  const [out, setOut] = useStateDec("");
  const ref = useRefDec(null);
  const startedRef = useRefDec(false);

  useEffectDec(() => {
    if (!ref.current) return;
    const node = ref.current;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const target = text;
      const startT = performance.now() + delay;
      const len = target.length;
      const charDur = durMs;
      const stagger = Math.max(18, Math.min(50, durMs / Math.max(1, len)));

      let raf = 0;
      const tick = () => {
        const now = performance.now();
        let done = true;
        let s = "";
        for (let i = 0; i < len; i++) {
          const charStart = startT + i * stagger;
          const charEnd = charStart + charDur * 0.5;
          if (now < charStart) {
            s += " ";
            done = false;
          } else if (now < charEnd) {
            // scramble
            s +=
              DECODE_CHARS[Math.floor(Math.random() * DECODE_CHARS.length)] ||
              "?";
            done = false;
          } else {
            s += target[i];
          }
        }
        setOut(s);
        if (!done) raf = requestAnimationFrame(tick);
      };
      tick();
      return () => cancelAnimationFrame(raf);
    };

    if (startNow) {
      const cleanup = start();
      return cleanup;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) start();
        });
      },
      { threshold: 0.1 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [text, delay, durMs, startNow]);

  return (
    <Tag ref={ref} className={className}>
      {out || "\u00A0"}
    </Tag>
  );
}

window.DecodeText = DecodeText;
