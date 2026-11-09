import { AmbientToggle } from "@/components/ride/ambient-toggle";
import { RouteGlyph } from "@/components/ride/route-glyphs";
import { landings, site } from "@/content/landings";
import { ROUTE_HEIGHT, ROUTE_STEP, routePoint } from "@/lib/ride";

function riverPath() {
  const stops = landings.map((_, index) => routePoint(index));
  const body = stops
    .slice(1)
    .map((point, index) => {
      const before = stops[index];
      const midX = (before.x + point.x) / 2;
      return `C${midX} ${before.y} ${midX} ${point.y} ${point.x} ${point.y}`;
    })
    .join("");
  return `M0 ${stops[0].y}L${stops[0].x} ${stops[0].y}${body}L${ROUTE_STEP * landings.length} ${stops[stops.length - 1].y}`;
}

/**
 * Stops are real links, so the map works with or without script. On the
 * stacked page it is a strip in normal flow, so it can never cover content. On
 * the full Ride a winding river runs under the stops with a boat on it.
 */
export function RouteMap() {
  const width = ROUTE_STEP * landings.length;
  return (
    <div className="relative z-40 flex flex-wrap items-center justify-center gap-2 bg-background px-2 py-1 ride:fixed ride:bottom-4 ride:left-1/2 ride:w-max ride:flex-nowrap ride:-translate-x-1/2 ride:rounded-sm ride:border-keyline ride:border-border">
      <nav aria-label={site.ride.routeLabel}>
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${width} ${ROUTE_HEIGHT}`}
            width={width}
            height={ROUTE_HEIGHT}
            className="absolute inset-0 hidden ride:block"
          >
            <path d={riverPath()} fill="none" stroke="#1f7a74" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <ol className="route-stops relative flex flex-wrap justify-center ride:flex-nowrap">
            {landings.map((landing, index) => (
              <li key={landing.id} className="relative">
                <a
                  href={`#${landing.id}`}
                  data-route-dot={index}
                  aria-current={index === 0 ? "location" : undefined}
                  className="route-stop group relative flex size-11 items-center justify-center text-muted-foreground no-underline aria-[current=location]:text-accent ride:h-14.5 ride:w-16 ride:items-start ride:pt-1"
                >
                  <span className="rounded-full p-0.5 group-data-lit:bg-border group-data-lit:text-foreground">
                    <RouteGlyph id={landing.id} />
                  </span>
                  <span className="route-name sr-only ride:not-sr-only ride:pointer-events-none ride:absolute! ride:bottom-full ride:left-1/2 ride:mb-2 ride:-translate-x-1/2 ride:rounded-sm ride:bg-secondary ride:px-2 ride:py-1 ride:text-label ride:whitespace-nowrap ride:text-secondary-foreground">
                    {landing.title}
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <div data-route-boat aria-hidden="true" className="pointer-events-none absolute top-0 left-0 hidden ride:block">
            <svg viewBox="0 0 34 16" width="34" height="16" className="-translate-x-1/2 -translate-y-1/2">
              <path d="M1 3C6 8 12 9 17 9S28 8 33 3C31 11 25 15 17 15S3 11 1 3Z" fill="#6f5237" stroke="#14221f" strokeWidth="1.5" />
              <path d="M12 9L13 4H21L22 9Z" fill="#b4492b" stroke="#14221f" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </nav>
      <AmbientToggle pauseLabel={site.ride.pause} playLabel={site.ride.play} />
    </div>
  );
}
