"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

type SkillJarsProps = {
  groups: { name: string; skills: string[] }[];
  /** For each skill, the index of every landing that used it. */
  stops: Record<string, number[]>;
  landingTitles: string[];
  labels: { hint: string; usedAt: string; offRoute: string };
};

const stepKeys: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

type Active = { skill: string; group: number };

/**
 * Each jar lights the landings where that skill was used. Hover, focus, and tap
 * all work, and the result is also written out for anyone who cannot see the
 * map. Each group is one tab stop, and arrow keys move between its jars.
 */
export function SkillJars({ groups, stops, landingTitles, labels }: SkillJarsProps) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Active | null>(null);

  useEffect(() => {
    const landing = root.current?.closest<HTMLElement>("[data-landing]");
    const page = root.current?.closest("main");
    const lit = new Set(active ? stops[active.skill] : []);
    page?.querySelectorAll<HTMLElement>("[data-route-dot]").forEach((dot) => {
      if (lit.has(Number(dot.dataset.routeDot))) dot.dataset.lit = "on";
      else delete dot.dataset.lit;
    });
    if (!landing) return;
    if (active) landing.dataset.litStall = String(active.group);
    else delete landing.dataset.litStall;
  }, [active, stops]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const jars = [...event.currentTarget.querySelectorAll("button")];
    const at = jars.indexOf(event.target as HTMLButtonElement);
    let next = at;
    if (event.key in stepKeys) next = (at + stepKeys[event.key] + jars.length) % jars.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = jars.length - 1;
    else return;
    event.preventDefault();
    jars.forEach((jar, index) => {
      jar.tabIndex = index === next ? 0 : -1;
    });
    jars[next].focus();
  }

  const places = active ? stops[active.skill].map((stop) => landingTitles[stop]) : [];
  const status = !active
    ? labels.hint
    : places.length > 0
      ? `${active.skill}: ${labels.usedAt} ${places.join(", ")}.`
      : `${active.skill}: ${labels.offRoute}`;

  return (
    <div ref={root} className="flex flex-col gap-2">
      {groups.map((group, groupIndex) => (
        <div key={group.name}>
          <h3 className="font-medium">{group.name}</h3>
          <div role="toolbar" aria-label={group.name} onKeyDown={onKeyDown} className="flex flex-wrap gap-x-1">
            {group.skills.map((skill, skillIndex) => (
              <button
                key={skill}
                type="button"
                tabIndex={skillIndex === 0 ? 0 : -1}
                onMouseEnter={() => setActive({ skill, group: groupIndex })}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive({ skill, group: groupIndex })}
                onBlur={() => setActive(null)}
                onClick={() => setActive({ skill, group: groupIndex })}
                className={`min-h-11 min-w-11 cursor-default rounded-sm px-2 font-mono text-label ride:pointer-fine:min-h-8 ride:pointer-fine:min-w-0 ${
                  active?.skill === skill ? "bg-border text-foreground" : "text-muted-foreground"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      ))}
      <p role="status" className="min-h-[3em] text-label text-foreground">
        {status}
      </p>
    </div>
  );
}
