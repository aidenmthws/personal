import type { CSSProperties } from "react";

import { OUTLINE, WATERLINE, type Tint } from "./kit";

/** A Kerala house: steep tiled roof, a small gable, and a shaded veranda. */
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
  const overhang = width * 0.14;
  const pitch = width * 0.42;
  const wallTop = base - height;
  const courses = [0.3, 0.55, 0.8];
  const windowFill = lit ? tint.glow : tint.trunk;
  return (
    <g>
      <rect x={x} y={wallTop} width={width} height={height} fill={tint.wall} />
      <path
        d={`M${x - overhang} ${wallTop}L${x + width * 0.22} ${wallTop - pitch}L${x + width * 0.78} ${wallTop - pitch}L${x + width + overhang} ${wallTop}Z`}
        fill={tint.roof}
      />
      <g stroke={tint.trunk} strokeOpacity="0.35" strokeWidth="1.5">
        {courses.map((ratio) => {
          const inset = (1 - ratio) * (width * 0.36 + overhang);
          const y = wallTop - pitch + pitch * ratio;
          return <path key={ratio} d={`M${x - overhang + inset} ${y}H${x + width + overhang - inset}`} />;
        })}
      </g>
      <path
        d={`M${x + width * 0.36} ${wallTop - pitch}L${x + width * 0.5} ${wallTop - pitch - width * 0.14}L${x + width * 0.64} ${wallTop - pitch}Z`}
        fill={tint.trunk}
      />
      <rect x={x + width * 0.42} y={base - height * 0.68} width={width * 0.18} height={height * 0.68} fill={tint.trunk} />
      <rect
        className={lit ? "arrive-lamp" : undefined}
        x={x + width * 0.12}
        y={base - height * 0.68}
        width={width * 0.16}
        height={height * 0.32}
        fill={windowFill}
      />
      <rect
        className={lit ? "arrive-lamp" : undefined}
        x={x + width * 0.72}
        y={base - height * 0.68}
        width={width * 0.16}
        height={height * 0.32}
        fill={windowFill}
      />
    </g>
  );
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

/**
 * A whitewashed church with a bell tower over its gable and lower roofs to
 * each side. Wrap it in a stroke to outline it.
 */
export function Church({ x, base, wall, shade }: { x: number; base: number; wall: string; shade: string }) {
  return (
    <g>
      <path d={`M${x - 46} ${base}V${base - 30}L${x - 20} ${base - 44}H${x + 20}L${x + 46} ${base - 30}V${base}Z`} fill={shade} />
      <path d={`M${x - 24} ${base}V${base - 46}L${x} ${base - 62}L${x + 24} ${base - 46}V${base}Z`} fill={wall} />
      <path d={`M${x - 8} ${base - 52}V${base - 86}L${x} ${base - 96}L${x + 8} ${base - 86}V${base - 52}Z`} fill={wall} />
      <path d={`M${x} ${base - 96}V${base - 110}M${x - 5} ${base - 105}H${x + 5}`} stroke={wall} strokeWidth="2.5" />
      <path d={`M${x - 7} ${base}V${base - 16}Q${x} ${base - 25} ${x + 7} ${base - 16}V${base}Z`} fill={shade} />
      <path d={`M${x - 3} ${base - 74}Q${x} ${base - 80} ${x + 3} ${base - 74}V${base - 68}H${x - 3}Z`} fill={shade} />
    </g>
  );
}

/**
 * A chundan vallam, the long snake boat, with a crew rowing in time and a
 * helmsman at the raised stern. Its paddles dip on `row`, and the boat
 * glides on `glide`.
 */
export function SnakeBoat({ x, base, length }: { x: number; base: number; length: number }) {
  const stern = x + length;
  const rowers = Array.from({ length: 13 }, (_, index) => Math.round(x + 34 + index * ((length - 96) / 12)));
  return (
    <g className="glide ambient">
      <g className="row ambient" stroke="#6f5237" strokeWidth="2.5" strokeLinecap="round">
        {rowers.map((rx) => (
          <path key={rx} d={`M${rx + 3} ${base - 14}L${rx - 9} ${base + 4}`} />
        ))}
      </g>
      {rowers.map((rx, index) => (
        <g key={rx}>
          <rect x={rx - 3} y={base - 20} width="7" height="10" fill="#f3ede0" />
          <circle cx={rx + 0.5} cy={base - 24} r="3.6" fill="#5a3a28" />
          {index % 3 === 0 && <path d={`M${rx - 3} ${base - 26}h7`} stroke="#b4492b" strokeWidth="2" />}
        </g>
      ))}
      <path d={`M${stern - 36} ${base - 14}L${stern - 52} ${base - 60}`} stroke="#6f5237" strokeWidth="3" strokeLinecap="round" />
      <rect x={stern - 40} y={base - 34} width="8" height="18" fill="#f3ede0" />
      <circle cx={stern - 36} cy={base - 39} r="4.2" fill="#5a3a28" />
      <path
        d={`M${x} ${base - 8}Q${x + length * 0.5} ${base + 6} ${stern - 26} ${base - 10}Q${stern - 4} ${base - 22} ${stern + 6} ${base - 70}Q${stern - 2} ${base - 34} ${stern - 30} ${base - 16}Q${x + length * 0.5} ${base - 8} ${x + 6} ${base - 12}Z`}
        fill="#24201c"
        stroke={OUTLINE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d={`M${x + 12} ${base - 9}Q${x + length * 0.5} ${base + 1} ${stern - 28} ${base - 12}`} fill="none" stroke="#c8a24a" strokeWidth="2" />
      <circle cx={stern + 6} cy={base - 72} r="3" fill="#c8a24a" />
    </g>
  );
}

/** A kettuvallam: a long hull with a woven, arched cabin and open windows. */
export function Houseboat({ x, base, width = 300 }: { x: number; base: number; width?: number }) {
  const height = width * 0.3;
  const roofY = base - height * 1.12;
  const deckY = base - height * 0.3;
  const ribs = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
  const windows = [0.22, 0.36, 0.5, 0.64];
  return (
    <g stroke={OUTLINE} strokeWidth="2">
      <path
        d={`M${x + width * 0.09} ${deckY}C${x + width * 0.14} ${roofY} ${x + width * 0.86} ${roofY} ${x + width * 0.91} ${deckY}Z`}
        fill="#C8A24A"
      />
      {ribs.map((ratio) => {
        const rise = 1 - ((ratio - 0.5) / 0.45) ** 2;
        return (
          <path
            key={ratio}
            d={`M${x + width * ratio} ${deckY}L${x + width * ratio} ${deckY - height * 0.62 * rise}`}
            fill="none"
            strokeWidth="1.25"
            strokeOpacity="0.6"
          />
        );
      })}
      {windows.map((ratio) => (
        <rect
          key={ratio}
          x={x + width * ratio}
          y={deckY - height * 0.3}
          width={width * 0.09}
          height={height * 0.26}
          fill="#3f3226"
          strokeWidth="1.25"
        />
      ))}
      <path
        d={`M${x - width * 0.07} ${base - height * 0.5}Q${x + width * 0.04} ${base - height * 0.28} ${x + width * 0.12} ${deckY}L${x + width * 0.88} ${deckY}Q${x + width * 0.96} ${base - height * 0.28} ${x + width * 1.07} ${base - height * 0.5}Q${x + width * 0.9} ${base + 5} ${x + width * 0.5} ${base + 5}Q${x + width * 0.1} ${base + 5} ${x - width * 0.07} ${base - height * 0.5}Z`}
        fill="#6F5237"
      />
      <path
        d={`M${x + width * 0.03} ${base - height * 0.16}Q${x + width * 0.5} ${base - height * 0.02} ${x + width * 0.97} ${base - height * 0.16}`}
        fill="none"
        stroke="#C8A24A"
      />
    </g>
  );
}

/** A small dugout, for distance and for working the water. */
export function Canoe({ x, base, width = 120 }: { x: number; base: number; width?: number }) {
  return (
    <path
      d={`M${x} ${base - 12}Q${x + width * 0.1} ${base} ${x + width * 0.3} ${base + 2}L${x + width * 0.7} ${base + 2}Q${x + width * 0.9} ${base} ${x + width} ${base - 12}Q${x + width * 0.5} ${base - 2} ${x} ${base - 12}Z`}
      fill="#5a4029"
      stroke={OUTLINE}
      strokeWidth="2"
    />
  );
}

export function Basket({ x, base, size = 34 }: { x: number; base: number; size?: number }) {
  return (
    <g stroke={OUTLINE} strokeWidth="2">
      <path
        d={`M${x} ${base - size}L${x + size} ${base - size}L${x + size * 0.84} ${base}L${x + size * 0.16} ${base}Z`}
        fill="#C8A24A"
      />
      <path
        d={`M${x + size * 0.08} ${base - size * 0.66}H${x + size * 0.92}M${x + size * 0.12} ${base - size * 0.33}H${x + size * 0.88}`}
        fill="none"
        strokeWidth="1.25"
        strokeOpacity="0.55"
      />
    </g>
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

/** A market stall with a striped awning, jars on its counter, and a lamp. */
export function Stall({
  x,
  base,
  awning,
  jars,
  index,
}: {
  x: number;
  base: number;
  awning: string;
  jars: string[];
  /** Which skill group the stall sells, so the card can light it. */
  index: number;
}) {
  const width = 190;
  const stripes = [0, 1, 2, 3, 4, 5, 6];
  return (
    <g data-stall={index}>
      <circle className="stall-glow" cx={x + width / 2} cy={base - 96} r="112" fill="#F3D98B" opacity="0" />
      <rect x={x + 8} y={base - 150} width="8" height="150" fill="#6F5237" />
      <rect x={x + width - 16} y={base - 150} width="8" height="150" fill="#6F5237" />
      <rect x={x + 16} y={base - 128} width={width - 32} height="74" fill="#3f3226" opacity="0.28" />
      <path
        d={`M${x - 12} ${base - 128}L${x + 18} ${base - 186}L${x + width - 18} ${base - 186}L${x + width + 12} ${base - 128}Z`}
        fill={awning}
        stroke={OUTLINE}
        strokeWidth="2"
      />
      <g fill="#14221f" opacity="0.16">
        {stripes.map((stripe) => {
          const low = x - 12 + ((width + 24) / 7) * stripe;
          const high = x + 18 + ((width - 36) / 7) * stripe;
          return stripe % 2 === 0 ? (
            <path
              key={stripe}
              d={`M${low} ${base - 128}L${high} ${base - 186}L${high + (width - 36) / 7} ${base - 186}L${low + (width + 24) / 7} ${base - 128}Z`}
            />
          ) : null;
        })}
      </g>
      <path d={`M${x + width / 2} ${base - 128}v22`} stroke={OUTLINE} strokeWidth="1.5" />
      <rect x={x + width / 2 - 8} y={base - 106} width="16" height="20" rx="2" fill="#F3D98B" stroke={OUTLINE} strokeWidth="2" />
      <rect x={x} y={base - 56} width={width} height="56" fill="#6F5237" stroke={OUTLINE} strokeWidth="2" />
      {jars.map((fill, jar) => (
        <Jar key={`${fill}-${jar}`} x={x + 14 + jar * 42} base={base - 56} fill={fill} />
      ))}
    </g>
  );
}

/** A harbor lamp. Lit lamps come on one at a time as the boat arrives. */
export function Lamp({
  x,
  base,
  height = 130,
  lit,
  order = 0,
}: {
  x: number;
  base: number;
  height?: number;
  lit?: "lit";
  order?: number;
}) {
  const top = base - height;
  const glass = lit ? "#F3D98B" : "#6F5237";
  return (
    <g>
      {lit && (
        <circle
          className="arrive-lamp"
          style={{ "--i": order } as CSSProperties}
          cx={x}
          cy={top}
          r="52"
          fill="#C8A24A"
          opacity="0.3"
        />
      )}
      <rect x={x - 3} y={top} width="6" height={height} fill="#14221F" />
      <rect x={x - 11} y={top - 18} width="22" height="26" rx="2" fill="#6F5237" stroke={OUTLINE} strokeWidth="2" />
      {lit && (
        <rect
          className="arrive-lamp"
          style={{ "--i": order } as CSSProperties}
          x={x - 11}
          y={top - 18}
          width="22"
          height="26"
          rx="2"
          fill={glass}
          stroke={OUTLINE}
          strokeWidth="2"
        />
      )}
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
      <path d={`M${x - 36} ${base - 176}L${x + 40} ${base - 250}L${x + 300} ${base - 250}L${x + 376} ${base - 176}Z`} fill={tint.roof} />
      <g stroke={tint.trunk} strokeOpacity="0.3" strokeWidth="1.5">
        <path d={`M${x + 16} ${base - 200}H${x + 324}M${x + 32} ${base - 225}H${x + 308}`} />
      </g>
      <rect x={x + 8} y={base - 176} width="12" height="160" fill={tint.trunk} />
      <rect x={x + 320} y={base - 176} width="12" height="160" fill={tint.trunk} />
      <g stroke={OUTLINE} strokeWidth="2">
        <path d={`M${x + 60} ${base - 16}l26 0l-8 -10l-3 0l0 -62l-4 0l0 62l-3 0Z`} fill="#C8A24A" />
        <path d={`M${x + 58} ${base - 92}q15 12 30 0Z`} fill="#C8A24A" />
        <rect x={x + 244} y={base - 52} width="44" height="36" fill="#6F5237" />
        <path d={`M${x + 258} ${base - 72}l16 0l-2 20l-12 0Z`} fill="#B4492B" />
      </g>
      <path
        className="steam ambient"
        d={`M${x + 266} ${base - 80}q-6 -10 0 -18q6 -9 0 -18`}
        fill="none"
        stroke="#f3ede0"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
  );
}

export function Footbridge({ x, width, base }: { x: number; width: number; base: number }) {
  const rise = 90;
  return (
    <g fill="none" stroke={OUTLINE} strokeWidth="2">
      <path d={`M${x} ${base}Q${x + width / 2} ${base - rise * 2} ${x + width} ${base}`} stroke="#6F5237" strokeWidth="14" />
      <path d={`M${x + 8} ${base - 34}Q${x + width / 2} ${base - rise * 2 - 34} ${x + width - 8} ${base - 34}`} />
      {[0.15, 0.32, 0.5, 0.68, 0.85].map((ratio) => {
        const px = x + width * ratio;
        const py = base - 2 * rise * 2 * ratio * (1 - ratio);
        return <path key={ratio} d={`M${px} ${py}L${px} ${py - 34}`} />;
      })}
    </g>
  );
}

/** A string of small flags between two poles. */
export function Bunting({
  from,
  to,
  sag = 34,
  colors,
}: {
  from: [number, number];
  to: [number, number];
  sag?: number;
  colors: string[];
}) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const flags = 13;
  return (
    <g>
      <path d={`M${x1} ${y1}Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + sag * 2} ${x2} ${y2}`} fill="none" stroke="#14221f" strokeWidth="1.5" />
      {Array.from({ length: flags }, (_, index) => {
        const t = (index + 0.5) / flags;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t + 4 * sag * t * (1 - t);
        return <path key={index} d={`M${x - 8} ${y}h16l-8 16Z`} fill={colors[index % colors.length]} />;
      })}
    </g>
  );
}

/** A waterfall that drops in flat tiers off the Ghats. */
export function Waterfall({ x, top, bottom, width = 54 }: { x: number; top: number; bottom: number; width?: number }) {
  const height = bottom - top;
  const threads = [0.16, 0.38, 0.62, 0.84];
  return (
    <g>
      <path
        d={`M${x} ${top}L${x + width} ${top}L${x + width * 1.22} ${bottom}L${x - width * 0.22} ${bottom}Z`}
        fill="#f6f1e4"
      />
      <g stroke="#a9c9c6" strokeWidth="3" strokeLinecap="round">
        {threads.map((ratio, index) => (
          <path
            key={ratio}
            className="fall ambient"
            style={{ animationDelay: `${index * 0.6}s` }}
            d={`M${x + width * ratio} ${top + height * 0.08 + index * 26}v${height * 0.34}`}
          />
        ))}
      </g>
      <g fill="#fbf4e6">
        <circle cx={x - 6} cy={bottom} r="24" />
        <circle cx={x + width / 2} cy={bottom + 4} r="34" />
        <circle cx={x + width + 6} cy={bottom} r="26" />
      </g>
    </g>
  );
}
