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

/** A small label that names an icon-only control on hover and focus. */
function BarTip({ children }: { children: string }) {
  return (
    <span
      aria-hidden="true"
      className="bar-tip pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-sm bg-secondary px-2 py-1 text-label whitespace-nowrap text-secondary-foreground"
    >
      {children}
    </span>
  );
}

/**
 * Stops are real links, so the map works with or without script. On the
 * stacked page it is a strip of icons in normal flow, so it can never cover
 * content. On the full Ride it is a slim river with a dot per landing and a
 * boat on it, and it fades back to that river when the visitor is idle.
 */
export function RouteMap() {
  const width = ROUTE_STEP * landings.length;
  return (
    <div
      data-route-bar
      className="relative z-40 flex flex-wrap items-center justify-center gap-2 bg-background px-2 py-1 ride:fixed ride:bottom-4 ride:left-1/2 ride:w-max ride:flex-nowrap ride:-translate-x-1/2 ride:gap-1 ride:bg-transparent ride:py-0"
    >
      {/* The bar's panel. It fades on its own, so the river can stay. */}
      <div
        aria-hidden="true"
        className="bar-fade absolute inset-0 -z-10 hidden rounded-sm border-keyline border-border bg-background ride:block"
      />
      <nav aria-label={site.ride.routeLabel}>
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${width} ${ROUTE_HEIGHT}`}
            width={width}
            height={ROUTE_HEIGHT}
            className="absolute inset-0 hidden ride:block"
          >
            <path d={riverPath()} fill="none" stroke="#1f7a74" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <ol className="route-stops relative flex max-w-55 flex-wrap justify-center min-[420px]:max-w-none ride:flex-nowrap">
            {landings.map((landing, index) => (
              <li key={landing.id} className="relative">
                <a
                  href={`#${landing.id}`}
                  data-route-dot={index}
                  aria-current={index === 0 ? "location" : undefined}
                  className="route-stop group relative flex size-11 items-center justify-center text-muted-foreground no-underline aria-[current=location]:text-accent ride:w-16"
                >
                  <span className="rounded-full p-0.5 group-data-lit:bg-border group-data-lit:text-foreground ride:hidden">
                    <RouteGlyph id={landing.id} />
                  </span>
                  {/* On the Ride, a dot on the river. It grows when pointed at,
                      and turns red when a skill lights this landing. */}
                  <span
                    aria-hidden="true"
                    className="route-dot absolute hidden size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground ride:block group-hover:scale-150 group-focus-visible:scale-150 group-data-lit:scale-175 group-data-lit:bg-accent"
                    style={{ left: "50%", top: routePoint(index).y }}
                  />
                  <span className="route-name sr-only ride:not-sr-only ride:pointer-events-none ride:absolute! ride:bottom-full ride:left-1/2 ride:mb-2 ride:-translate-x-1/2 ride:rounded-sm ride:bg-secondary ride:px-2 ride:py-1 ride:text-label ride:whitespace-nowrap ride:text-secondary-foreground">
                    {landing.title}
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <div data-route-boat aria-hidden="true" className="pointer-events-none absolute top-0 left-0 hidden ride:block">
            <svg viewBox="0 0 34 16" width="28" height="13" className="-translate-x-1/2 -translate-y-[70%]">
              <path d="M1 3C6 8 12 9 17 9S28 8 33 3C31 11 25 15 17 15S3 11 1 3Z" fill="#6f5237" stroke="#14221f" strokeWidth="1.5" />
              <path d="M12 9L13 4H21L22 9Z" fill="#b4492b" stroke="#14221f" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </nav>
      <div className="bar-fade hidden items-center ride:flex">
        <button
          type="button"
          data-tour-toggle
          data-state="play"
          aria-label={site.ride.tour.play}
          data-play={site.ride.tour.play}
          data-pause={site.ride.tour.pause}
          data-again={site.ride.tour.again}
          className="tour-toggle relative flex size-11 items-center justify-center rounded-sm text-accent"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="tour-play size-5" fill="currentColor">
            <path d="M7 4.5v15l12.5-7.5z" />
          </svg>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="tour-pause size-5" fill="currentColor">
            <rect x="6" y="4.5" width="4" height="15" rx="1" />
            <rect x="14" y="4.5" width="4" height="15" rx="1" />
          </svg>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="tour-again size-5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" />
          </svg>
          <BarTip>{site.ride.tour.play}</BarTip>
        </button>
        <AmbientToggle
          pauseLabel={site.ride.pause}
          playLabel={site.ride.play}
          className="ambient-toggle group relative flex size-11 items-center justify-center rounded-sm text-foreground"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 9c3-2.5 6-2.5 9 0s6 2.5 9 0M3 15c3-2.5 6-2.5 9 0s6 2.5 9 0" />
            <path d="M4 20L20 4" className="hidden group-data-paused:block" />
          </svg>
        </AmbientToggle>
      </div>
      <p data-tour-status role="status" className="sr-only" />
      <div
        data-tour-progress
        aria-hidden="true"
        className="absolute inset-x-1 bottom-0 hidden h-0.5 origin-left bg-accent opacity-0 ride:block"
      />
    </div>
  );
}
