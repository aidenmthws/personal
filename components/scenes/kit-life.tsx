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

/* Animals of the Kerala backwaters. Each is small and sits clear of the cards
   and the boat, so the scenes stay quiet. */

/** A white-throated kingfisher perched and facing left. `base` is its feet. */
export function Kingfisher({ x, base, scale = 1 }: { x: number; base: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${base}) scale(${scale})`} stroke={OUTLINE} strokeWidth="1.5" strokeLinejoin="round">
      <path d="M-2 0v-4M3 0v-4" stroke="#c0392b" />
      <path d="M2 -20Q11 -14 11 -4L16 5L6 -2Q2 -10 2 -20Z" fill="#2a86b5" />
      <path d="M-6 -3Q-10 -13 -5 -20Q-1 -25 3 -20Q7 -11 5 -3Z" fill="#8a3b1f" />
      <path d="M-8 -12Q-4 -7 0 -11Q-3 -16 -8 -12Z" fill="#fbf7ec" strokeWidth="1" />
      <path d="M-7 -21L-20 -17L-7 -16Z" fill="#c0392b" />
    </g>
  );
}

/** An Asian elephant at the water's edge, its trunk down to drink. */
export function Elephant({ x, base, scale = 1 }: { x: number; base: number; scale?: number }) {
  const hide = "#7a7772";
  return (
    <g transform={`translate(${x} ${base}) scale(${scale})`} stroke={OUTLINE} strokeWidth="1.5" strokeLinejoin="round">
      <g fill={hide}>
        <rect x="-20" y="-18" width="9" height="18" />
        <rect x="-6" y="-18" width="9" height="18" />
        <rect x="20" y="-18" width="9" height="18" />
        <rect x="32" y="-18" width="9" height="18" />
        <ellipse cx="10" cy="-32" rx="33" ry="20" />
        <circle cx="-22" cy="-38" r="14" />
      </g>
      <path d="M42 -38q7 6 5 17" fill="none" />
      <path d="M-32 -34Q-40 -18 -36 0" fill="none" strokeWidth="8" strokeLinecap="round" />
      <path d="M-32 -34Q-40 -18 -36 0" fill="none" stroke={hide} strokeWidth="5" strokeLinecap="round" />
      <path d="M-18 -48Q-4 -48 -6 -32Q-8 -22 -18 -26Z" fill="#67645f" />
      <path d="M-30 -28q-3 5 -9 4" fill="none" stroke="#fbf7ec" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="-27" cy="-41" r="1.5" fill={OUTLINE} stroke="none" />
    </g>
  );
}

/** A water buffalo wading, only its back and head above the water. For the fore layer. */
export function Buffalo({ x, y, scale = 1, ripple }: { x: number; y: number; scale?: number; ripple: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g stroke={OUTLINE} strokeWidth="1.5" strokeLinejoin="round">
        <path d="M-44 0Q-42 -17 -20 -19Q2 -21 18 -12L24 0Z" fill="#3d3836" />
        <path d="M18 0Q18 -20 32 -25Q44 -28 50 -18L57 -6Q58 0 50 0Z" fill="#3d3836" />
        <path d="M26 -16l-11 -3l8 8Z" fill="#3d3836" />
        <path d="M32 -25Q20 -44 -4 -38Q16 -36 27 -21Z" fill="#cbb99a" />
        <path d="M54 -5q3 1 3 -1" fill="none" strokeWidth="1" />
      </g>
      <circle cx="41" cy="-17" r="1.5" fill="#f3ede0" />
      <path d="M-52 2q26 5 52 0t52 0" fill="none" stroke={ripple} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

/** A karimeen, the pearl spot, leaping from the water. For the fore layer. */
export function Karimeen({ x, y, ripple }: { x: number; y: number; ripple: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="2" cy="10" rx="20" ry="4" fill="none" stroke={ripple} strokeWidth="2" className="splash ambient" />
      <g className="leap ambient">
        <g transform="rotate(-24)" stroke={OUTLINE} strokeWidth="1.5" strokeLinejoin="round">
          <path d="M-14 0Q-12 -9 0 -9Q12 -9 16 -2L24 -8V6L16 0Q12 7 0 7Q-12 7 -14 0Z" fill="#7d9a7a" />
          <path d="M-4 -8v14M4 -8v14" stroke="#4f6a52" />
          <circle cx="-8" cy="-2" r="1.3" fill={OUTLINE} stroke="none" />
        </g>
      </g>
    </g>
  );
}

/** A cormorant on a stake, holding its wings out to dry. */
export function Cormorant({ x, base, height = 50 }: { x: number; base: number; height?: number }) {
  const top = base - height;
  return (
    <g>
      <rect x={x - 3} y={top} width="6" height={height} fill="#6f5237" />
      <g transform={`translate(${x} ${top})`} fill="#1d2522" stroke={OUTLINE} strokeWidth="1.5" strokeLinejoin="round">
        <path d="M-3 -20Q-16 -32 -26 -16Q-15 -20 -4 -11Z" />
        <path d="M3 -20Q16 -32 26 -16Q15 -20 4 -11Z" />
        <path d="M-4 0Q-7 -14 -3 -26Q0 -31 3 -26Q7 -14 4 0Z" />
        <circle cy="-31" r="4" />
        <path d="M-3 -32l-9 2l9 1Z" fill="#c8a24a" />
      </g>
    </g>
  );
}

/** A great hornbill, the state bird of Kerala, in flight to the left. */
export function Hornbill({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={OUTLINE} strokeWidth="1.5" strokeLinejoin="round">
      <path d="M28 -1L46 -5V8L28 4Z" fill="#fbf7ec" />
      <path d="M38 -3v9" stroke="#1d2522" strokeWidth="3" />
      <path d="M-20 0Q-6 -8 14 -4Q22 -2 30 1Q20 6 14 4Q-4 8 -20 0Z" fill="#1d2522" />
      <path d="M-10 -4Q-4 -30 26 -38Q24 -16 16 -3Z" fill="#1d2522" />
      <path d="M2 -18Q12 -30 23 -34" stroke="#fbf7ec" strokeWidth="3" strokeLinecap="round" />
      <path d="M-20 -1Q-26 -5 -31 -3Q-29 4 -20 4Z" fill="#f2e2a0" />
      <path d="M-30 -2Q-44 2 -52 10Q-40 6 -30 4Z" fill="#e8b830" />
      <path d="M-31 -4Q-40 -11 -48 -3Q-40 -5 -31 -1Z" fill="#e8b830" />
    </g>
  );
}
