import { Bank, GroveLine, Palm, WATERLINE, type Tint } from "@/components/scenes/kit";
import { Canoe } from "@/components/scenes/kit-craft";
import { AmbientToggle } from "@/components/ride/ambient-toggle";
import { Egret, Figure } from "@/components/scenes/kit-life";

/* Morning on the water, drawn on the Mist page itself so the land sits on the
   page instead of on a sky. Built from the Ride's scene kit, and static: Dry
   Land carries no motion. */
const tint: Tint = {
  far: "#d9c9a0",
  bank: "#6f9450",
  lip: "#5a7c40",
  leaf: "#4b7b3c",
  shade: "#3a6530",
  trunk: "#6f5237",
  roof: "#b4492b",
  wall: "#f3e6c8",
  glow: "#c8a24a",
};

const base = WATERLINE;
const top = (height: number) => WATERLINE - height + 2;

const ripples: [number, number, number][] = [
  [180, 652, 120],
  [560, 670, 90],
  [980, 648, 150],
  [1320, 676, 110],
];

const glints: [number, number, number][] = [
  [300, 662, 40],
  [880, 684, 56],
  [1180, 660, 36],
];

const birds = "M0 0q8 -7 15 2q7 -9 15 -2M44 -18q6 -5 11 1q5 -6 11 -1M70 6q6 -5 11 1q5 -6 11 -1";

/**
 * A strip of backwater between the hero and the record. Decorative only. The
 * palms sway, the canoe drifts, and birds cross, all paused by the water
 * button and still under reduced motion.
 */
export function DryLandHorizon({ pauseLabel, playLabel }: { pauseLabel: string; playLabel: string }) {
  return (
    <div className="horizon relative">
      <svg
        aria-hidden="true"
        viewBox="0 396 1600 304"
        preserveAspectRatio="xMidYMax slice"
        className="block h-40 w-full md:h-[19vw]"
      >
        <g className="h-birds ambient">
          <path d={birds} transform="translate(0 470)" fill="none" stroke="#6a4a3c" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <GroveLine x={0} width={1600} base={base} height={70} fill={tint.far} seed={3} />
        <Bank x={0} width={640} height={44} fill={tint.bank} lip={tint.lip} seed={3} />
        <Palm x={110} base={top(44)} height={140} lean={16} tint={tint} sway="sway" />
        <Palm x={230} base={top(44)} height={165} lean={-18} tint={tint} />
        <Palm x={520} base={top(44)} height={120} lean={14} tint={tint} sway="sway" />
        <Bank x={1060} width={540} height={58} fill={tint.bank} lip={tint.lip} seed={2} />
        <Palm x={1150} base={top(58)} height={130} lean={-14} tint={tint} sway="sway" />
        <Palm x={1300} base={top(58)} height={150} lean={-24} tint={tint} />
        <Palm x={1460} base={top(58)} height={135} tint={tint} sway="sway" />
        <Egret x={960} base={base + 2} height={70} />
        <rect x="0" y={base} width="1600" height="70" fill="#1f7a74" />
        <g className="h-drift ambient">
          <g className="h-bob ambient">
            <Canoe x={700} base={base + 8} width={130} />
            <Figure x={760} base={base - 2} scale={0.6} pose="reach" cloth="#e4dccb" />
          </g>
        </g>
        <g stroke="#f3ede0" strokeWidth="3" strokeLinecap="round" opacity="0.6">
          {ripples.map(([x, y, width], index) => (
            <path
              key={x}
              className="ripple ambient"
              style={{ animationDelay: `${-index * 2.3}s`, animationDuration: `${7 + (index % 3) * 1.6}s` }}
              d={`M${x} ${y}h${width}`}
            />
          ))}
        </g>
        <g stroke="#fbeec8" strokeWidth="3" strokeLinecap="round">
          {glints.map(([x, y, width], index) => (
            <path
              key={x}
              d={`M${x} ${y}h${width}`}
              className="glitter ambient"
              style={{ animationDelay: `${index * 1.4}s` }}
              opacity="0.4"
            />
          ))}
        </g>
      </svg>
      <div className="absolute right-4 bottom-2 md:right-6">
        <AmbientToggle
          pauseLabel={pauseLabel}
          playLabel={playLabel}
          className="inline-flex min-h-11 items-center rounded-sm border-keyline border-border bg-background px-2 text-label whitespace-nowrap text-foreground underline"
        />
      </div>
    </div>
  );
}
