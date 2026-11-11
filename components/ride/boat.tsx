import { Figure, SKIN } from "@/components/scenes/kit-life";

const rings = [0, 1, 2];
const OUTLINE = "#14221f";
const ribs = [116, 133, 150, 167, 184];

/* The cast net: gathered in the boatman's hands, then spread where it lands.
   The throw's keyframes in globals.css move between these two points. */
const HAND = [78, 10];
const LAND = [420, 108];
const BUNDLE = "M78 10Q66 22 67 42Q78 48 90 42Q91 22 78 10Z";
const round = (value: number) => Math.round(value * 10) / 10;
const rim = Array.from({ length: 12 }, (_, index) => {
  const angle = (index / 12) * Math.PI * 2;
  return [round(LAND[0] + Math.cos(angle) * 78), round(LAND[1] + Math.sin(angle) * 15)];
});
const SPOKES = rim.filter((_, index) => index % 2 === 0).map(([x, y]) => `M${LAND[0]} ${LAND[1]}L${x} ${y}`).join("");
const WEIGHTS = rim;

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
            {/* At Broad water the boatman sets down the oar and holds a cast
                net. His arms sit behind his body, so they stay attached
                however far he swings. */}
            <g className="boat-net">
              <g className="net-hold" style={{ transformOrigin: "56px 10px" }}>
                <path
                  d="M50 9L62 18L76 12M62 8L70 4L78 10"
                  fill="none"
                  stroke={SKIN}
                  strokeWidth="3.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g className="net-bundle">
                  <path d={BUNDLE} fill="#e4dac0" stroke={OUTLINE} strokeWidth="1.5" strokeLinejoin="round" />
                  <g className="net-fish" fill="#c7d6d2" stroke={OUTLINE} strokeWidth="1">
                    <path d="M67 31q6 -5 12 0l4 -3v6l-4 -3q-6 5 -12 0Z" />
                    <path d="M76 39q6 -5 12 0l4 -3v6l-4 -3q-6 5 -12 0Z" />
                    <path d="M70 22q5 -4 10 0l3 -2v5l-3 -2.5q-5 4 -10 0Z" />
                  </g>
                  <path d="M72 18L87 40M84 18L69 40M68 30H89" fill="none" stroke="#a89a78" strokeWidth="1" />
                  <g fill="#4a4a4a">
                    {[68, 74, 80, 86].map((cx, index) => (
                      <circle key={cx} cx={cx} cy={[42, 45, 46, 44][index]} r="1.8" />
                    ))}
                  </g>
                </g>
              </g>
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
            {/* The cast: the net flies out, spreads, lands in front of the boat,
                and is hauled back along its rope. Hidden until it is thrown. */}
            <g className="boat-net">
              <path
                className="net-rope"
                d={`M${HAND[0]} ${HAND[1]}L${LAND[0]} ${LAND[1]}`}
                stroke="#e4dac0"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                style={{ transformOrigin: `${HAND[0]}px ${HAND[1]}px` }}
              />
              <ellipse
                className="net-splash"
                cx={LAND[0]}
                cy={LAND[1] + 2}
                rx="88"
                ry="15"
                fill="none"
                stroke="#f3ede0"
                strokeWidth="2"
                style={{ transformOrigin: `${LAND[0]}px ${LAND[1] + 2}px` }}
              />
              <g className="net-fly" style={{ transformOrigin: `${LAND[0]}px ${LAND[1]}px` }}>
                <g fill="none" stroke="#efe6cf" strokeWidth="1.5">
                  <ellipse cx={LAND[0]} cy={LAND[1]} rx="78" ry="15" />
                  <ellipse cx={LAND[0]} cy={LAND[1]} rx="50" ry="10" />
                  <ellipse cx={LAND[0]} cy={LAND[1]} rx="24" ry="5" />
                  <path d={SPOKES} />
                </g>
                <g fill="#4a4a4a">
                  {WEIGHTS.map(([cx, cy]) => (
                    <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" />
                  ))}
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
