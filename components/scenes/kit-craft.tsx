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
 * A cantilevered fishing net seen from the side, reaching left over the water.
 * `net-arm` pivots on the fulcrum, so the net can be lowered.
 */
export function FishingNet({ x, base, scale = 1 }: { x: number; base: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${base}) scale(${scale})`} fill="none" strokeLinecap="round">
      <path d="M-34 0L-4 -118M62 0L0 -118" stroke="#6F5237" strokeWidth="9" />
      <rect x="-70" y="-6" width="190" height="10" fill="#6F5237" stroke={OUTLINE} strokeWidth="2" />
      <g className="net-arm" style={{ transformOrigin: "0px -118px" }}>
        <path d="M120 -60L-250 -318" stroke="#6F5237" strokeWidth="9" />
        <path d="M-430 -198L-250 -318L-70 -198" stroke="#6F5237" strokeWidth="5" />
        <path
          d="M-430 -198Q-250 90 -70 -198Z"
          fill="#F3EDE0"
          fillOpacity="0.72"
          stroke={OUTLINE}
          strokeWidth="2"
        />
        <g stroke={OUTLINE} strokeWidth="1.25" strokeOpacity="0.55">
          <path d="M-385 -198L-340 -112M-340 -198L-296 -72M-295 -198L-262 -58M-250 -198L-228 -58M-205 -198L-195 -72M-160 -198L-160 -112M-115 -198L-130 -140" />
          <path d="M-398 -160Q-250 -126 -102 -160M-360 -118Q-250 -88 -140 -118M-310 -80Q-250 -66 -190 -80" />
        </g>
        <path d="M-250 -318L-250 -198M-250 -318L-340 -198M-250 -318L-160 -198" stroke={OUTLINE} strokeWidth="1.5" />
        <path d="M-250 -318L128 -60" stroke={OUTLINE} strokeWidth="1.5" />
        <g fill="#8A7A66" stroke={OUTLINE} strokeWidth="2">
          <circle cx="120" cy="-42" r="11" />
          <circle cx="96" cy="-52" r="8" />
        </g>
      </g>
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
