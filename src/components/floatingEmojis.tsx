const SYMBOLS = ["⋆", "𐙚", "☾", "⚜", "𖹭", "✦", "╰┈➤", "⚔"];

function FloatingSymbols() {
  return (
    <div className="floating-symbols" aria-hidden="true">
      {SYMBOLS.map((sym, i) => (
        <span
          key={i}
          className="floating-symbol"
          style={{
            left: `${(i * 13 + 5) % 95}%`,
            animationDuration: `${14 + (i % 5) * 3}s`,
            animationDelay: `${i * 1.3}s`,
          }}
        >
          {sym}
        </span>
      ))}
    </div>
  );
}

export default FloatingSymbols;