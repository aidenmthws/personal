import { skyStops, sunPose, type SkyStop } from "@/lib/ride";

const cloudColor: Record<SkyStop, string> = {
  dawn: "#fbd0b4",
  sunrise: "#fdeedb",
  gold: "#fff8e2",
  bright: "#f2fbf4",
  amber: "#f7cd90",
  sunset: "#e99a78",
  dusk: "#1a5551",
};

/* Each row is one cloud: x, y, width. */
const cloudBanks: Record<SkyStop, [number, number, number][]> = {
  dawn: [[1020, 120, 420], [1660, 80, 360], [420, 190, 300], [2100, 200, 340]],
  sunrise: [[930, 150, 340], [1500, 70, 460], [260, 90, 300], [2050, 170, 320]],
  gold: [[820, 70, 380], [1380, 170, 300], [120, 150, 340], [1900, 90, 420]],
  bright: [[700, 110, 460], [1240, 60, 320], [1640, 180, 380], [80, 60, 300], [2120, 110, 300]],
  amber: [[640, 160, 480], [1160, 90, 360], [1720, 190, 420], [60, 110, 320], [2200, 70, 240]],
  sunset: [[560, 120, 440], [1220, 60, 380], [1800, 170, 360], [120, 200, 280]],
  dusk: [[820, 190, 420], [1500, 130, 360], [240, 150, 300]],
};

/** A flat cloud of stacked, rounded bars. */
function Cloud({ x, y, width, fill }: { x: number; y: number; width: number; fill: string }) {
  const bar = Math.round(width * 0.075);
  const bars = [
    [0.2, 0, 0.42],
    [0.06, bar, 0.82],
    [0.34, bar * 2, 0.62],
  ];
  return (
    <g fill={fill}>
      {bars.map(([left, top, share]) => (
        <rect
          key={top}
          x={x + width * left}
          y={y + top}
          width={width * share}
          height={bar + 2}
          rx={bar / 2}
        />
      ))}
    </g>
  );
}

function Stars() {
  const stars = Array.from({ length: 46 }, (_, index) => {
    const a = Math.sin(index * 91.7) * 4375.5;
    const b = Math.sin(index * 37.3) * 7919.1;
    return {
      x: Math.round((a - Math.floor(a)) * 2400),
      y: Math.round((b - Math.floor(b)) * 400) + 20,
      r: index % 5 === 0 ? 2.6 : 1.6,
    };
  });
  return (
    <g fill="#f3ede0">
      {stars.map(({ x, y, r }) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} opacity={r > 2 ? 0.9 : 0.55} />
      ))}
    </g>
  );
}

function Moon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="58" fill="#f3d98b" opacity="0.14" />
      <path
        d={`M${cx + 14} ${cy - 40}a42 42 0 1 0 26 66a34 34 0 1 1 -26 -66Z`}
        fill="#f3e6bd"
      />
    </g>
  );
}

function CloudBank({ stop, className = "" }: { stop: SkyStop; className?: string }) {
  return (
    <svg viewBox="0 0 2400 630" className={className}>
      {stop === "dusk" && (
        <>
          <Stars />
          <Moon cx={1240} cy={196} />
        </>
      )}
      {cloudBanks[stop].map(([x, y, width]) => (
        <Cloud key={x} x={x} y={y} width={width} fill={cloudColor[stop]} />
      ))}
    </svg>
  );
}

function Glitter() {
  const rows: [number, number, number][] = [
    [-90, 14, 180],
    [-50, 40, 110],
    [-120, 66, 210],
    [-40, 94, 90],
    [-100, 122, 170],
    [-60, 156, 120],
  ];
  return (
    <svg viewBox="-130 0 260 180" width="260" height="180" className="block overflow-visible">
      <g stroke="#fbeec8" strokeWidth="4" strokeLinecap="round">
        {rows.map(([x, y, length], index) => (
          <path
            key={y}
            d={`M${x} ${y}h${length}`}
            className="glitter ambient"
            style={{ animationDelay: `${index * 0.5}s` }}
          />
        ))}
      </g>
    </svg>
  );
}

function SunDisc() {
  return (
    <svg viewBox="-110 -110 220 220" className="block size-[16vh] overflow-visible">
      <circle r="108" fill="#f4b76e" opacity="0.22" />
      <circle r="66" fill="#ee9a55" />
      <circle data-sun-pale r="66" fill="#fbecbc" opacity="0" />
    </svg>
  );
}

/** One static layer per stop, each with its own clouds, crossfaded with opacity. */
export function Sky() {
  return (
    <div aria-hidden="true" className="hidden ride:block">
      {skyStops.map((stop, index) => (
        <div
          key={stop}
          data-sky-layer={index}
          className={`sky sky-${stop} fixed inset-0 z-0 overflow-hidden ${index === 0 ? "" : "opacity-0"}`}
        >
          <div data-clouds>
            <div className="cloud-drift ambient">
              <CloudBank stop={stop} className="block w-[160vw]" />
            </div>
          </div>
        </div>
      ))}
      <div className="fixed inset-x-0 top-0 z-0 h-[70%] overflow-hidden">
        <div data-sun className="absolute top-0 left-0">
          <div className="-translate-x-1/2 -translate-y-1/2">
            <SunDisc />
          </div>
        </div>
      </div>
      <div className="fixed inset-x-0 top-[70%] bottom-0 z-0 overflow-hidden">
        <div data-glitter className="absolute top-0 left-0 opacity-0">
          <div className="-translate-x-1/2">
            <Glitter />
          </div>
        </div>
      </div>
      <div className="pointer-events-none fixed inset-0 z-25 bg-[url(/grain.png)] opacity-3" />
    </div>
  );
}

/**
 * The same sky held still, for the stacked page. The Ride hides it and shows
 * the moving one, so each landing's sun sits where it would on the Ride.
 */
export function LandingSky({
  stop,
  index,
  last,
}: {
  stop: SkyStop;
  index: number;
  last: number;
}) {
  const { xVw, yVh, pale, glitter } = sunPose(index, last);
  return (
    <div className="ride:hidden">
      <div className="absolute inset-x-0 top-0 h-[70%] overflow-hidden">
        <CloudBank stop={stop} className="absolute top-0 left-0 w-[160%]" />
        {glitter > 0 && (
          <svg
            viewBox="-110 -110 220 220"
            className="absolute size-[16%] min-h-20 min-w-20 -translate-x-1/2 -translate-y-1/2 overflow-visible"
            style={{ left: `${xVw}%`, top: `${(yVh / 70) * 100}%` }}
          >
            <circle r="108" fill="#f4b76e" opacity="0.22" />
            <circle r="66" fill={pale > 0.5 ? "#fbecbc" : "#ee9a55"} />
          </svg>
        )}
      </div>
    </div>
  );
}
