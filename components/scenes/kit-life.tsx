import { OUTLINE } from "./kit";

export const SKIN = "#5a3a28";

/**
 * A flat standing figure. `reach` raises the arms, as when hauling a rope.
 * `hold` draws no arms, so whatever the figure holds can draw them on itself.
 */
export function Figure({
  x,
  base,
  scale = 1,
  cloth = "#f3ede0",
  shirt = SKIN,
  wrap = "#f3ede0",
  pose = "stand",
}: {
  x: number;
  base: number;
  scale?: number;
  cloth?: string;
  shirt?: string;
  wrap?: string;
  pose?: "stand" | "reach" | "hold";
}) {
  return (
    <g transform={`translate(${x} ${base}) scale(${scale})`}>
      <rect x="-6" y="-6" width="4.5" height="6" fill={SKIN} />
      <rect x="2" y="-6" width="4.5" height="6" fill={SKIN} />
      <path d="M-8 -32L8 -32L10 -4L-10 -4Z" fill={cloth} />
      <path d="M-8.5 -32L-10 -50Q0 -57 10 -50L8.5 -32Z" fill={shirt} />
      {pose !== "hold" && (
        <path
          d={pose === "reach" ? "M-8 -47L-23 -60M8 -47L-16 -66" : "M-9 -48L-13 -28M9 -48L13 -28"}
          stroke={SKIN}
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
      )}
      <circle cy="-62" r="7.5" fill={SKIN} />
      <path d="M-8 -64Q0 -74 8 -64Q0 -67 -8 -64Z" fill={wrap} />
    </g>
  );
}

export function Bird({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <path
      d={`M${x - 14} ${y - 4}Q${x - 6} ${y - 10} ${x} ${y}Q${x + 6} ${y - 10} ${x + 14} ${y - 4}`}
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  );
}

/** Birds that rise into place as the boat arrives. */
export function BirdFlock({ birds, color }: { birds: [number, number][]; color: string }) {
  return (
    <g className="arrive-lift">
      {birds.map(([x, y]) => (
        <Bird key={`${x}-${y}`} x={x} y={y} color={color} />
      ))}
    </g>
  );
}

/** An egret standing on a fishing stake in the water. */
export function Egret({ x, base, height = 96 }: { x: number; base: number; height?: number }) {
  const top = base - height;
  return (
    <g>
      <rect x={x - 3} y={top} width="6" height={height} fill="#6f5237" />
      <g transform={`translate(${x} ${top})`}>
        <path d="M-2 0L-3 -12M4 0L4 -12" stroke="#c8a24a" strokeWidth="2" />
        <path d="M-14 -22Q-2 -34 12 -24Q18 -40 16 -56L22 -56Q26 -34 14 -14Q0 -6 -14 -22Z" fill="#fbf7ec" stroke={OUTLINE} strokeWidth="1.5" />
        <path d="M22 -56l14 3l-14 3Z" fill="#c8a24a" />
      </g>
    </g>
  );
}

/** A flock of Kuttanad ducks swimming in a loose line, for the fore layer. */
export function Ducks({ x, y, count = 11 }: { x: number; y: number; count?: number }) {
  return (
    <g className="ducks ambient">
      {Array.from({ length: count }, (_, index) => {
        const dx = x + index * 34 + (index % 3) * 8;
        const dy = y + (index % 4) * 11 - (index % 2) * 7;
        return (
          <g key={index} transform={`translate(${dx} ${dy})`}>
            <path d="M-13 0Q-14 -11 0 -11L4 -11Q6 -22 13 -21Q19 -20 17 -13L22 -11L16 -9Q14 2 2 3Q-10 4 -13 0Z" fill={index % 4 === 1 ? "#cdb892" : "#f7f1e2"} stroke={OUTLINE} strokeWidth="1.5" />
          </g>
        );
      })}
    </g>
  );
}

/** Cooking smoke rising from a roof. */
export function Smoke({ x, y }: { x: number; y: number }) {
  return (
    <path
      className="steam ambient"
      d={`M${x} ${y}q-12 -18 0 -36q12 -18 0 -36q-10 -16 2 -30`}
      fill="none"
      stroke="#f3ede0"
      strokeOpacity="0.75"
      strokeWidth="5"
      strokeLinecap="round"
    />
  );
}

/** A line of washing between two posts. */
export function WashingLine({ x, y, width, colors }: { x: number; y: number; width: number; colors: string[] }) {
  const step = width / colors.length;
  return (
    <g>
      <rect x={x - 3} y={y} width="5" height="62" fill="#6f5237" />
      <rect x={x + width - 2} y={y} width="5" height="62" fill="#6f5237" />
      <path d={`M${x} ${y + 3}Q${x + width / 2} ${y + 16} ${x + width} ${y + 3}`} fill="none" stroke="#14221f" strokeWidth="1.5" />
      {colors.map((color, index) => (
        <rect key={index} x={x + 6 + index * step} y={y + 9} width={step - 12} height={26 + (index % 2) * 7} fill={color} />
      ))}
    </g>
  );
}
