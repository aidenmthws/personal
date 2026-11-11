import type { ReactNode } from "react";

/** The waterline in far and mid layers, whose viewBox is 1600 by 630. */
export const WATERLINE = 630;

export const OUTLINE = "#14221F";

export type Tint = {
  far: string;
  bank: string;
  lip: string;
  leaf: string;
  shade: string;
  trunk: string;
  roof: string;
  wall: string;
  glow: string;
};

const round = (value: number) => Math.round(value * 10) / 10;

/**
 * Every landform tapers to the waterline at both ends, so neighboring scenes
 * can slide past each other without a seam. The top edge is uneven, and a
 * darker lip marks where the land meets the water.
 */
export function Bank({
  x,
  width,
  height,
  fill,
  lip,
  seed = 1,
}: {
  x: number;
  width: number;
  height: number;
  fill: string;
  lip?: string;
  seed?: number;
}) {
  const top = WATERLINE - height;
  const shoulder = Math.min(width * 0.18, 110);
  const steps = Math.max(2, Math.round((width - shoulder * 2) / 70));
  const edge = Array.from({ length: steps + 1 }, (_, index) => {
    const px = x + shoulder + ((width - shoulder * 2) * index) / steps;
    return [round(px), round(top + (noise(index, seed) - 0.5) * height * 0.22)];
  });
  const line = edge.map(([px, py]) => `L${px} ${py}`).join("");
  const lipHeight = Math.min(height * 0.26, 16);
  return (
    <>
      <path
        d={`M${x} ${WATERLINE}Q${round(x + shoulder * 0.35)} ${top} ${x + shoulder} ${edge[0][1]}${line}Q${round(x + width - shoulder * 0.35)} ${top} ${x + width} ${WATERLINE}Z`}
        fill={fill}
        strokeLinejoin="round"
      />
      {lip && (
        <path
          d={`M${x + shoulder * 0.3} ${WATERLINE}Q${x + shoulder} ${WATERLINE - lipHeight} ${x + shoulder * 2} ${WATERLINE - lipHeight}L${x + width - shoulder * 2} ${WATERLINE - lipHeight}Q${x + width - shoulder} ${WATERLINE - lipHeight} ${x + width - shoulder * 0.3} ${WATERLINE}Z`}
          fill={lip}
        />
      )}
    </>
  );
}

export function Hill({
  x,
  width,
  height,
  fill,
}: {
  x: number;
  width: number;
  height: number;
  fill: string;
}) {
  return (
    <path
      d={`M${x} ${WATERLINE}C${x + width * 0.3} ${WATERLINE - height * 1.3} ${x + width * 0.6} ${WATERLINE - height * 1.3} ${x + width} ${WATERLINE}Z`}
      fill={fill}
    />
  );
}

/** A hill planted with tea, its bushes in rows that follow the slope, as on the Ghats estates. */
export function TeaHill({
  x,
  width,
  height,
  fill,
  row,
}: {
  x: number;
  width: number;
  height: number;
  fill: string;
  row: string;
}) {
  const curve = (rise: number) =>
    `M${x} ${WATERLINE}C${x + width * 0.3} ${WATERLINE - rise * 1.3} ${x + width * 0.6} ${WATERLINE - rise * 1.3} ${x + width} ${WATERLINE}`;
  return (
    <>
      <path d={`${curve(height)}Z`} fill={fill} />
      <path
        d={[0.86, 0.7, 0.54, 0.38, 0.22].map((ratio) => curve(height * ratio)).join("")}
        fill="none"
        stroke={row}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="1 12"
      />
    </>
  );
}

/** Water lilies for the fore layer: notched pads, every other one in flower. */
export function Lilies({ pads, leaf, flower }: { pads: [number, number, number][]; leaf: string; flower: string }) {
  return (
    <g stroke={OUTLINE} strokeWidth="1.5" strokeLinejoin="round">
      {pads.map(([x, y, r], index) => {
        const ry = r * 0.36;
        return (
          <g key={`${x}-${y}`}>
            <path d={`M${x} ${y}L${x + r * 0.9} ${round(y - ry * 0.45)}A${r} ${round(ry)} 0 1 0 ${x + r * 0.9} ${round(y + ry * 0.45)}Z`} fill={leaf} />
            {index % 2 === 0 && (
              <path d={`M${x - 9} ${y - 2}L${x - 6} ${y - 14}L${x - 2} ${y - 6}L${x + 2} ${y - 16}L${x + 5} ${y - 6}L${x + 8} ${y - 14}L${x + 9} ${y - 2}Z`} fill={flower} />
            )}
          </g>
        );
      })}
    </g>
  );
}

/** A long ridge through [x, height] points, for the Ghats. */
export function Ridge({ points, fill }: { points: [number, number][]; fill: string }) {
  const at = ([x, height]: [number, number]) => `${x} ${WATERLINE - height}`;
  const curve = points
    .slice(1)
    .map((point, index) => {
      const before = points[index];
      const mid: [number, number] = [(before[0] + point[0]) / 2, (before[1] + point[1]) / 2];
      return `Q${at(before)} ${at(mid)}`;
    })
    .join("");
  const last = points[points.length - 1];
  return (
    <path
      d={`M${points[0][0]} ${WATERLINE}L${at(points[0])}${curve}L${at(last)}L${last[0]} ${WATERLINE}Z`}
      fill={fill}
    />
  );
}

/** A band of rounded tree crowns, drawn as one path. */
export function Forest({
  x,
  width,
  base,
  size = 22,
  fill,
  seed = 1,
}: {
  x: number;
  width: number;
  base: number;
  size?: number;
  fill: string;
  seed?: number;
}) {
  const count = Math.round(width / (size * 1.25));
  const crowns = Array.from({ length: count }, (_, index) => {
    const r = Math.round(size * (0.7 + noise(index, seed) * 0.6));
    const cx = Math.round(x + (width * index) / count);
    return `M${cx - r} ${base}a${r} ${r} 0 1 1 ${2 * r} 0Z`;
  });
  return (
    <path
      d={`${crowns.join("")}M${x} ${base}h${width}v${size}h${-width}Z`}
      fill={fill}
    />
  );
}

/** A point on the quadratic curve from `a` through control `c` to `b`. */
function quad(a: number, c: number, b: number, t: number) {
  return (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;
}

/** A hex color made darker, as solid paint, so detail costs no blending. */
function darken(hex: string, amount = 0.25) {
  const value = parseInt(hex.slice(1), 16);
  const channel = (shift: number) => Math.round(((value >> shift) & 255) * (1 - amount));
  return `rgb(${channel(16)} ${channel(8)} ${channel(0)})`;
}

/* Where leaflets hang along a frond, from the crown (0) to the tip (1). */
const LEAFLETS = [0.8, 0.6, 0.4];

/**
 * A coconut palm: a ringed trunk and fronds with a notched underside, where the
 * leaflets hang. Each frond is one filled shape, so the detail stays cheap to
 * paint as scenes slide past. Pass `sway` for the slow movement of its crown.
 */
export function Palm({
  x,
  base,
  height,
  lean = 24,
  tint,
  sway,
}: {
  x: number;
  base: number;
  height: number;
  lean?: number;
  tint: Tint;
  sway?: "sway";
}) {
  const topX = x + lean;
  const topY = base - height;
  const reach = height * 0.47;
  const low = Math.max(4, height * 0.05) / 2;
  const high = Math.max(2.4, height * 0.022) / 2;
  const bendX = x + lean * 0.12;
  const bendY = base - height * 0.6;
  const fronds = [-1.04, 0.98, -0.8, 0.74, -0.5, 0.44, -0.2, 0.16];

  /* Rings get closer together toward the crown, as on a real trunk. */
  const ringCount = Math.round(height / 22);
  const rings = Array.from({ length: ringCount }, (_, index) => {
    const t = ((index + 1) / (ringCount + 1)) ** 0.85;
    const cx = round(quad(x, bendX, topX, t));
    const cy = round(quad(base, bendY, topY, t));
    const half = round(low + (high - low) * t);
    return `M${round(cx - half)} ${cy}q${half} 1.6 ${round(half * 2)} 0`;
  }).join("");

  return (
    <g>
      <path
        d={`M${x - low} ${base}Q${bendX - low} ${bendY} ${topX - high} ${topY}L${topX + high} ${topY}Q${bendX + low} ${bendY} ${x + low} ${base}Z`}
        fill={tint.trunk}
      />
      <path d={rings} fill="none" stroke={darken(tint.trunk)} strokeWidth={Math.max(1, height * 0.005)} />
      <g
        className={sway ? "sway ambient" : undefined}
        style={sway ? { transformOrigin: `${topX}px ${topY}px` } : undefined}
      >
        {fronds.map((side, index) => {
          const spread = Math.abs(side);
          const endX = round(topX + side * reach);
          const endY = round(topY + reach * (0.72 * spread ** 1.6 - 0.1));
          const midX = round(topX + side * reach * 0.55);
          const midY = round(topY - reach * (0.34 - spread * 0.14));
          const underY = midY + reach * 0.3;
          /* Back along the underside from the tip, a leaflet at each step. */
          /* Only the front fronds are notched: the back ones sit in shadow. */
          const front = index >= 4;
          const teeth = !front ? "" : LEAFLETS.map((t) => {
            const px = quad(topX, midX, endX, t);
            const py = quad(topY, underY, endY, t);
            const size = reach * 0.14 * Math.sin(Math.PI * t);
            const tipX = round(px + side * size * 0.5);
            const tipY = round(py + size);
            const backX = round(quad(topX, midX, endX, t - 0.1));
            const backY = round(quad(topY, underY, endY, t - 0.1));
            return `L${tipX} ${tipY}L${backX} ${backY}`;
          }).join("");
          return (
            <path
              key={side}
              d={
                front
                  ? `M${topX} ${topY}Q${midX} ${midY} ${endX} ${endY}${teeth}L${topX} ${topY}Z`
                  : `M${topX} ${topY}Q${midX} ${midY} ${endX} ${endY}Q${midX} ${round(underY)} ${topX} ${topY}Z`
              }
              fill={front ? tint.leaf : tint.shade}
            />
          );
        })}
      </g>
      {height > 170 && (
        <g fill={tint.trunk}>
          <circle cx={topX - 7} cy={topY + 8} r={height * 0.018} />
          <circle cx={topX + 6} cy={topY + 10} r={height * 0.018} />
          <circle cx={topX - 1} cy={topY + 14} r={height * 0.016} />
        </g>
      )}
    </g>
  );
}

/** A distant line of palms and scrub, drawn as one path. */
export function GroveLine({
  x,
  width,
  base,
  height,
  fill,
  seed = 1,
}: {
  x: number;
  width: number;
  base: number;
  height: number;
  fill: string;
  seed?: number;
}) {
  const count = Math.round(width / (height * 0.72));
  const whole = Math.round;
  const palms = Array.from({ length: count }, (_, index) => {
    const cx = whole(x + (width * (index + noise(index, seed) * 0.6)) / count);
    const tall = height * (0.55 + noise(index, seed + 1) * 0.45);
    const tip = whole(base - tall);
    const reach = whole(tall * 0.36);
    const crown = cx + whole((noise(index, seed + 2) - 0.5) * tall * 0.3);
    const droop = tip + whole(reach * 0.5);
    return (
      `M${cx - 1} ${base}L${crown} ${tip}L${cx + 1} ${base}Z` +
      `M${crown} ${tip}Q${crown - whole(reach * 0.6)} ${tip - whole(reach * 0.4)} ${crown - reach} ${droop}Q${crown - whole(reach * 0.5)} ${tip} ${crown} ${tip}Z` +
      `M${crown} ${tip}Q${crown + whole(reach * 0.6)} ${tip - whole(reach * 0.4)} ${crown + reach} ${droop}Q${crown + whole(reach * 0.5)} ${tip} ${crown} ${tip}Z`
    );
  });
  return (
    <>
      <path d={palms.join("")} fill={fill} />
      <Forest x={x} width={width} base={base} size={height * 0.14} fill={fill} seed={seed} />
    </>
  );
}

/** Flat bands of mist that drift very slowly. */
export function Mist({ x = 220, y, width = 1200, color }: { x?: number; y: number; width?: number; color: string }) {
  return (
    <g className="mist ambient" fill={color}>
      <rect x={x} y={y} width={width} height="14" rx="7" opacity="0.5" />
      <rect x={x + width * 0.22} y={y - 22} width={width * 0.52} height="10" rx="5" opacity="0.38" />
      <rect x={x + width * 0.08} y={y + 24} width={width * 0.6} height="9" rx="4.5" opacity="0.32" />
    </g>
  );
}

/* Foreground parts, for the band below the waterline (viewBox 1600 by 270). */

/** Stems run well past the bottom of the box, so they reach the screen edge. */
export function Reeds({ x, base = 270, color }: { x: number; base?: number; color: string }) {
  const blades = [-34, -22, -8, 6, 18, 30, 42];
  const below = base + 260;
  return (
    <g fill="none" stroke={color} strokeWidth="5" strokeLinecap="round">
      {blades.map((offset, index) => (
        <path
          key={offset}
          d={`M${x + offset} ${below}L${x + offset} ${base}Q${x + offset + 4} ${base - 60} ${x + offset * 1.7} ${base - 92 - (index % 3) * 22}`}
        />
      ))}
    </g>
  );
}

export function Ripples({ color, lines }: { color: string; lines: [number, number, number][] }) {
  return (
    <g className="ripples ambient" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.5">
      {lines.map(([x, y, length]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y}h${length}`} />
      ))}
    </g>
  );
}

export function Stone({ x, y, width, fill }: { x: number; y: number; width: number; fill: string }) {
  return (
    <ellipse cx={x} cy={y} rx={width} ry={width * 0.42} fill={fill} stroke={OUTLINE} strokeWidth="2" />
  );
}

/** Long fronds reaching in from the top corners, close to the viewer. */
export function FrameFronds({ side, fill }: { side: "left" | "right"; fill: string }) {
  const leaves: [number, number, number][] = [
    [0, 330, 170],
    [40, 420, 90],
    [120, 470, 34],
    [210, 400, 0],
    [340, 300, -14],
  ];
  return (
    <g transform={side === "right" ? "translate(1600 0) scale(-1 1)" : undefined} fill={fill}>
      <g className="sway ambient" style={{ transformOrigin: "0px 0px" }}>
        {leaves.map(([startX, length, drop]) => (
          <path
            key={startX}
            d={`M${startX} -30Q${startX + length * 0.5} ${drop * 0.4 - 10} ${startX + length} ${drop + 70}Q${startX + length * 0.45} ${drop * 0.4 + 34} ${startX} -30Z`}
          />
        ))}
      </g>
    </g>
  );
}

/** A repeatable pseudo-random value from 0 to 1, so server output never varies. */
export function noise(index: number, seed = 0) {
  const value = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

/**
 * Fades a reflection away from the bank in flat steps and cuts it into broken
 * strips. Shared by every scene, so it is defined once on the page.
 */
export function ReflectionDefs() {
  const bands: [number, number, string][] = [
    [0, 44, "#909090"],
    [44, 96, "#6c6c6c"],
    [96, 156, "#484848"],
    [156, 222, "#262626"],
  ];
  const cuts = Array.from({ length: 120 }, (_, index) => {
    const row = index % 20;
    const depth = row / 20;
    return {
      x: Math.round(noise(index, 1) * 1600) - 60,
      y: 8 + row * 11,
      width: Math.round(50 + noise(index, 2) * (90 + depth * 170)),
    };
  });

  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <mask id="reflection-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="270">
        {bands.map(([y, end, fill]) => (
          <rect key={y} x="0" y={y} width="1600" height={end - y} fill={fill} />
        ))}
        {cuts.map(({ x, y, width }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={width} height="4" fill="#000" />
        ))}
      </mask>
    </svg>
  );
}

/**
 * The scene's layers. The Ride moves far and fore at their own speeds for
 * parallax. The reflection repeats the mid layer, flipped at the waterline and
 * foreshortened, without copying its markup. Sizes live in globals.css.
 */
export function SceneLayers({
  name,
  far,
  mid,
  fore,
  frame,
}: {
  name: string;
  far: ReactNode;
  mid: ReactNode;
  fore: ReactNode;
  frame?: ReactNode;
}) {
  const art = `art-${name}`;
  return (
    <>
      <svg data-layer="far" viewBox="0 0 1600 630">
        {far}
      </svg>
      <svg data-layer="mid" viewBox="0 0 1600 630">
        <g id={art}>{mid}</g>
      </svg>
      <svg data-layer="reflect" viewBox="0 0 1600 270">
        <g mask="url(#reflection-mask)" opacity="0.55">
          <use href={`#${art}`} transform="matrix(1 0 0 -0.6 0 378)" />
        </g>
      </svg>
      <svg data-layer="fore" viewBox="0 0 1600 270">
        {fore}
      </svg>
      {frame && (
        <svg data-layer="frame" viewBox="0 0 1600 630">
          {frame}
        </svg>
      )}
    </>
  );
}
