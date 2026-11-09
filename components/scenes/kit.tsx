import type { ReactNode } from "react";

/** The waterline in far and mid layers, whose viewBox is 1600 by 630. */
export const WATERLINE = 630;

const OUTLINE = "#14221F";

export type Tint = {
  far: string;
  bank: string;
  leaf: string;
  trunk: string;
  roof: string;
  wall: string;
  glow: string;
};

/**
 * Every landform tapers to the waterline at both ends, so neighboring scenes
 * can slide past each other without a seam.
 */
export function Bank({
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
  const top = WATERLINE - height;
  const shoulder = Math.min(width * 0.2, 120);
  return (
    <path
      d={`M${x} ${WATERLINE}Q${x + shoulder * 0.5} ${top} ${x + shoulder * 1.5} ${top}L${x + width - shoulder * 1.5} ${top}Q${x + width - shoulder * 0.5} ${top} ${x + width} ${WATERLINE}Z`}
      fill={fill}
    />
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

export function Palm({
  x,
  base,
  height,
  lean = 24,
  tint,
}: {
  x: number;
  base: number;
  height: number;
  lean?: number;
  tint: Tint;
}) {
  const topX = x + lean;
  const topY = base - height;
  const reach = height * 0.42;
  const fronds = [-1, -0.62, -0.25, 0.25, 0.62, 1];

  return (
    <g>
      <path
        d={`M${x} ${base}Q${x + lean * 0.1} ${base - height * 0.6} ${topX} ${topY}`}
        fill="none"
        stroke={tint.trunk}
        strokeWidth={height * 0.05}
        strokeLinecap="round"
      />
      {fronds.map((side) => {
        const endX = topX + side * reach;
        const endY = topY + reach * 0.55 * (1 - Math.abs(side) * 0.25) - 8;
        const midX = topX + side * reach * 0.55;
        const midY = topY - reach * (0.42 - Math.abs(side) * 0.26);
        return (
          <path
            key={side}
            d={`M${topX} ${topY}Q${midX} ${midY} ${endX} ${endY}Q${midX} ${midY + reach * 0.3} ${topX} ${topY}Z`}
            fill={tint.leaf}
          />
        );
      })}
    </g>
  );
}

export function House({
  x,
  base,
  width = 110,
  tint,
  lit,
}: {
  x: number;
  base: number;
  width?: number;
  tint: Tint;
  lit?: "lit";
}) {
  const height = width * 0.5;
  const overhang = width * 0.12;
  const pitch = width * 0.34;
  const wallTop = base - height;
  return (
    <g>
      <rect x={x} y={wallTop} width={width} height={height} fill={tint.wall} />
      <path
        d={`M${x - overhang} ${wallTop}L${x + width * 0.18} ${wallTop - pitch}L${x + width * 0.82} ${wallTop - pitch}L${x + width + overhang} ${wallTop}Z`}
        fill={tint.roof}
      />
      <rect
        x={x + width * 0.42}
        y={base - height * 0.68}
        width={width * 0.18}
        height={height * 0.68}
        fill={tint.trunk}
      />
      <rect
        x={x + width * 0.12}
        y={base - height * 0.68}
        width={width * 0.16}
        height={height * 0.32}
        fill={lit ? tint.glow : tint.trunk}
      />
      <rect
        x={x + width * 0.72}
        y={base - height * 0.68}
        width={width * 0.16}
        height={height * 0.32}
        fill={lit ? tint.glow : tint.trunk}
      />
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

export function Mist({ y, color }: { y: number; color: string }) {
  return <ellipse cx="900" cy={y} rx="680" ry="12" fill={color} opacity="0.45" />;
}

/** A wooden jetty on posts, drawn in the mid layer at the waterline. */
export function Jetty({
  x,
  width,
  deck = WATERLINE - 26,
}: {
  x: number;
  width: number;
  deck?: number;
}) {
  const posts = Array.from({ length: Math.floor(width / 70) + 1 }, (_, i) => x + i * 70);
  return (
    <g fill="#6F5237" stroke={OUTLINE} strokeWidth="2">
      {posts.map((post) => (
        <rect key={post} x={post} y={deck} width="10" height={WATERLINE + 2 - deck} />
      ))}
      <rect x={x - 12} y={deck - 12} width={width + 34} height="14" />
    </g>
  );
}

/** A cantilevered fishing net, with its poles and hanging cloth. */
export function FishingNet({ x, base }: { x: number; base: number }) {
  const tipX = x + 210;
  const tipY = base - 250;
  return (
    <g fill="none" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round">
      <path d={`M${x} ${base}L${tipX} ${tipY}`} strokeWidth="7" stroke="#6F5237" />
      <path d={`M${x + 70} ${base}L${x + 96} ${base - 130}`} strokeWidth="7" stroke="#6F5237" />
      <path d={`M${tipX - 150} ${tipY + 66}Q${tipX} ${tipY + 240} ${tipX + 150} ${tipY + 66}`} fill="#F3EDE0" fillOpacity="0.8" />
      <path d={`M${tipX - 150} ${tipY + 66}L${tipX} ${tipY}L${tipX + 150} ${tipY + 66}`} />
      <path d={`M${tipX - 75} ${tipY + 33}L${tipX - 74} ${tipY + 152}M${tipX} ${tipY}L${tipX} ${tipY + 174}M${tipX + 75} ${tipY + 33}L${tipX + 74} ${tipY + 152}`} strokeWidth="1.5" />
      <path d={`M${x + 34} ${base - 62}L${x - 30} ${base - 8}`} />
    </g>
  );
}

/** A houseboat with a woven arched cabin. */
export function Houseboat({ x, base, width = 300 }: { x: number; base: number; width?: number }) {
  const height = width * 0.28;
  return (
    <g stroke={OUTLINE} strokeWidth="2">
      <path
        d={`M${x + width * 0.08} ${base - height * 0.3}C${x + width * 0.14} ${base - height * 1.2} ${x + width * 0.86} ${base - height * 1.2} ${x + width * 0.92} ${base - height * 0.3}Z`}
        fill="#C8A24A"
      />
      {[0.3, 0.5, 0.7].map((ratio) => (
        <path
          key={ratio}
          d={`M${x + width * ratio} ${base - height * 0.3}L${x + width * ratio} ${base - height * 0.9}`}
          fill="none"
        />
      ))}
      <path
        d={`M${x - width * 0.06} ${base - height * 0.42}Q${x + width * 0.04} ${base - height * 0.28} ${x + width * 0.12} ${base - height * 0.3}L${x + width * 0.88} ${base - height * 0.3}Q${x + width * 0.96} ${base - height * 0.28} ${x + width * 1.06} ${base - height * 0.42}Q${x + width * 0.9} ${base + 4} ${x + width * 0.5} ${base + 4}Q${x + width * 0.1} ${base + 4} ${x - width * 0.06} ${base - height * 0.42}Z`}
        fill="#6F5237"
      />
    </g>
  );
}

export function Basket({ x, base, size = 34 }: { x: number; base: number; size?: number }) {
  return (
    <path
      d={`M${x} ${base - size}L${x + size} ${base - size}L${x + size * 0.84} ${base}L${x + size * 0.16} ${base}Z`}
      fill="#C8A24A"
      stroke={OUTLINE}
      strokeWidth="2"
    />
  );
}

export function Jar({ x, base, fill }: { x: number; base: number; fill: string }) {
  return (
    <path
      d={`M${x + 6} ${base - 34}L${x + 22} ${base - 34}L${x + 20} ${base - 28}Q${x + 32} ${base - 20} ${x + 26} ${base}L${x + 2} ${base}Q${x - 4} ${base - 20} ${x + 8} ${base - 28}Z`}
      fill={fill}
      stroke={OUTLINE}
      strokeWidth="2"
    />
  );
}

/** A market stall with a striped awning and four jars on its counter. */
export function Stall({
  x,
  base,
  awning,
  jars,
}: {
  x: number;
  base: number;
  awning: string;
  jars: string[];
}) {
  const width = 170;
  return (
    <g>
      <rect x={x + 8} y={base - 140} width="8" height="140" fill="#6F5237" />
      <rect x={x + width - 16} y={base - 140} width="8" height="140" fill="#6F5237" />
      <path
        d={`M${x - 10} ${base - 120}L${x + 16} ${base - 170}L${x + width - 16} ${base - 170}L${x + width + 10} ${base - 120}Z`}
        fill={awning}
        stroke={OUTLINE}
        strokeWidth="2"
      />
      <rect x={x} y={base - 54} width={width} height="54" fill="#6F5237" stroke={OUTLINE} strokeWidth="2" />
      {jars.map((fill, index) => (
        <Jar key={`${fill}-${index}`} x={x + 12 + index * 38} base={base - 54} fill={fill} />
      ))}
    </g>
  );
}

export function Lamp({ x, base, height = 120, lit }: { x: number; base: number; height?: number; lit?: "lit" }) {
  const top = base - height;
  return (
    <g>
      {lit && <circle cx={x} cy={top} r="46" fill="#C8A24A" opacity="0.28" />}
      <rect x={x - 3} y={top} width="6" height={height} fill="#14221F" />
      <rect x={x - 11} y={top - 18} width="22" height="26" rx="2" fill={lit ? "#F3D98B" : "#6F5237"} stroke={OUTLINE} strokeWidth="2" />
    </g>
  );
}

/** A small veranda with a standing lamp, unlit, and a glass of chai on a stool. */
export function Veranda({ x, base, tint }: { x: number; base: number; tint: Tint }) {
  return (
    <g>
      <rect x={x} y={base - 16} width="340" height="16" fill={tint.trunk} />
      <rect x={x + 20} y={base - 176} width="300" height="160" fill={tint.wall} />
      <rect x={x + 134} y={base - 136} width="72" height="120" fill={tint.trunk} />
      <path d={`M${x - 36} ${base - 176}L${x + 40} ${base - 244}L${x + 300} ${base - 244}L${x + 376} ${base - 176}Z`} fill={tint.roof} />
      <rect x={x + 8} y={base - 176} width="12" height="160" fill={tint.trunk} />
      <rect x={x + 320} y={base - 176} width="12" height="160" fill={tint.trunk} />
      <g stroke={OUTLINE} strokeWidth="2">
        <path d={`M${x + 60} ${base - 16}l26 0l-8 -10l-3 0l0 -62l-4 0l0 62l-3 0Z`} fill="#C8A24A" />
        <path d={`M${x + 58} ${base - 92}q15 12 30 0Z`} fill="#C8A24A" />
        <rect x={x + 244} y={base - 52} width="44" height="36" fill="#6F5237" />
        <path d={`M${x + 258} ${base - 72}l16 0l-2 20l-12 0Z`} fill="#B4492B" />
      </g>
    </g>
  );
}

export function Footbridge({ x, width, base }: { x: number; width: number; base: number }) {
  const rise = 90;
  return (
    <g fill="none" stroke={OUTLINE} strokeWidth="2">
      <path d={`M${x} ${base}Q${x + width / 2} ${base - rise * 2} ${x + width} ${base}`} stroke="#6F5237" strokeWidth="14" />
      <path d={`M${x + 8} ${base - 34}Q${x + width / 2} ${base - rise * 2 - 34} ${x + width - 8} ${base - 34}`} />
      {[0.25, 0.5, 0.75].map((ratio) => {
        const px = x + width * ratio;
        const py = base - 2 * rise * 2 * ratio * (1 - ratio);
        return <path key={ratio} d={`M${px} ${py}L${px} ${py - 34}`} />;
      })}
    </g>
  );
}

/* Foreground parts, for the band below the waterline (viewBox 1600 by 270). */

export function Reeds({ x, base = 270, color }: { x: number; base?: number; color: string }) {
  const blades = [-34, -22, -8, 6, 18, 30, 42];
  return (
    <g fill="none" stroke={color} strokeWidth="5" strokeLinecap="round">
      {blades.map((offset, index) => (
        <path
          key={offset}
          d={`M${x + offset} ${base}Q${x + offset + 4} ${base - 60} ${x + offset * 1.7} ${base - 92 - (index % 3) * 22}`}
        />
      ))}
    </g>
  );
}

export function Ripples({ color, lines }: { color: string; lines: [number, number, number][] }) {
  return (
    <g stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.5">
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
}: {
  name: string;
  far: ReactNode;
  mid: ReactNode;
  fore: ReactNode;
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
    </>
  );
}
