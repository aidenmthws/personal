const rings = [0, 1, 2];

/** The boat rides near center, so the world moves past it. */
export function Boat() {
  return (
    <div
      aria-hidden="true"
      data-boat
      className="pointer-events-none fixed top-[70%] left-[60%] z-20 hidden -translate-y-1/2 ride:block"
    >
      <div className="boat-bob">
        <svg viewBox="0 0 300 96" width="240" height="77" className="block overflow-visible">
          {rings.map((ring) => (
            <ellipse
              key={ring}
              className="wake-ring"
              style={{ animationDelay: `${ring}s` }}
              cx="-34"
              cy="74"
              rx={90}
              ry={9}
              fill="none"
              stroke="#f3ede0"
              strokeWidth="2"
            />
          ))}
          <path
            d="M6 22C34 54 66 62 150 62C234 62 266 54 294 22C286 66 246 88 150 88C54 88 14 66 6 22Z"
            fill="#6f5237"
            stroke="#14221f"
            strokeWidth="2"
          />
          <path d="M38 58C70 70 230 70 262 58" fill="none" stroke="#c8a24a" strokeWidth="2" />
          <path d="M92 62L110 34L190 34L208 62Z" fill="#b4492b" stroke="#14221f" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
