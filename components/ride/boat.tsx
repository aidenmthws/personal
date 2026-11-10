import { Figure, SKIN } from "@/components/scenes/kit-life";

const rings = [0, 1, 2];
const OUTLINE = "#14221f";
const ribs = [116, 133, 150, 167, 184];

/** The boat rides near center, so the world moves past it. */
export function Boat() {
  return (
    <div
      aria-hidden="true"
      data-boat
      className="pointer-events-none fixed top-[70%] left-0 z-20 hidden ride:block"
    >
      <div className="boat-nudge">
        <div className="boat-bob -translate-x-1/2 -translate-y-1/2">
          <svg viewBox="0 0 300 96" className="block h-auto w-[max(240px,16.667vw)] overflow-visible">
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
            <g data-wake opacity="0" style={{ transformOrigin: "150px 76px" }}>
              <path
                d="M2 78L-120 62M2 84L-140 92M-34 76L-180 72M-20 88L-96 100"
                fill="none"
                stroke="#f3ede0"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
            <Figure x={56} base={48} scale={0.86} pose="hold" cloth="#f3ede0" shirt="#c8a24a" wrap="#b4492b" />
            {/* The oar swings about the boatman's shoulders, and his arms swing
                with it, so his hands never leave the shaft. */}
            <g data-pole style={{ transformOrigin: "60px 8px" }}>
              <g transform="translate(60 8) rotate(12.7)">
                <path d="M0 -84V76" stroke="#5a4029" strokeWidth="4" strokeLinecap="round" />
                <path d="M-5 -84H5" stroke="#5a4029" strokeWidth="4" strokeLinecap="round" />
                <path
                  d="M0 70C8 78 8 100 0 110C-8 100 -8 78 0 70Z"
                  fill="#6f5237"
                  stroke={OUTLINE}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </g>
              <path
                d="M62.9 7.6L69 1L63.1 -5.7M49.1 7.6L47 17L56.9 21.7"
                fill="none"
                stroke={SKIN}
                strokeWidth="3.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <path
              d="M104 62C104 26 122 18 150 18C178 18 196 26 196 62Z"
              fill="#c8a24a"
              stroke={OUTLINE}
              strokeWidth="2"
            />
            {ribs.map((x) => (
              <path
                key={x}
                d={`M${x} 62V${x === 150 ? 20 : x === 133 || x === 167 ? 23 : 30}`}
                stroke={OUTLINE}
                strokeOpacity="0.5"
                strokeWidth="1.25"
              />
            ))}
            <path
              d="M6 14C24 50 66 62 150 62C234 62 276 50 294 14C292 62 246 88 150 88C54 88 8 62 6 14Z"
              fill="#6f5237"
              stroke={OUTLINE}
              strokeWidth="2"
            />
            <path d="M34 60C70 72 230 72 266 60" fill="none" stroke="#c8a24a" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}
