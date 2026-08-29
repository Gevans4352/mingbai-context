import { useState, useEffect, useRef } from "react";

const PHRASES = [
  "记忆是一条河",
  "时间从不等人",
  "梦里的城市",
  "我们都在漂流",
  "夜色藏着秘密",
  "旧信纸上的字",
  "风吹散了从前",
  "灯火阑珊处",
];

// ... (ScrollColumn logic remains the same)
interface ColumnProps {
  startIndex: number;
  duration: number;
  delay?: number;
}

function ScrollColumn({ startIndex, duration, delay = 0 }: ColumnProps) {
  const [index, setIndex] = useState(startIndex % PHRASES.length);
  const timeoutRef = useRef<number | null>(null);

  function handleAnimationEnd() {
    timeoutRef.current = window.setTimeout(() => {
      setIndex((prev) => (prev + 1) % PHRASES.length);
    }, 1500);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const phrase = PHRASES[index];
  const chars = phrase.split("");

  return (
    <div className="vs-column" style={{ animationDelay: `${delay}s` }}>
      <div
        key={index}
        className="vs-column-inner"
        style={{ animationDuration: `${duration}s` }}
        onAnimationEnd={handleAnimationEnd}
      >
        {chars.map((char, i) => (
          // We pass the index to style each character slightly uniquely
          <span
            className="vs-char"
            key={i}
            style={{ "--char-index": i } as React.CSSProperties}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}

// ... (ScrollingScript remains the same)
function ScrollingScript() {
  return (
    <aside className="vs-wrap" aria-hidden="true">
      <ScrollColumn startIndex={0} duration={13} />
      <ScrollColumn startIndex={3} duration={16} delay={0.5} />
      <ScrollColumn startIndex={5} duration={14.5} delay={1.2} />
    </aside>
  );
}

export default ScrollingScript;
