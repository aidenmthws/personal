import { AmbientToggle } from "@/components/ride/ambient-toggle";
import { landings, site } from "@/content/landings";

/**
 * Dots are real links, so the map works with or without script. On the stacked
 * page it is a strip in normal flow, so it can never cover content.
 */
export function RouteMap() {
  return (
    <div className="relative z-40 flex flex-wrap items-center justify-center gap-2 bg-background px-2 py-1 ride:fixed ride:bottom-4 ride:left-1/2 ride:-translate-x-1/2 ride:rounded-sm ride:border-keyline ride:border-border">
      <nav aria-label={site.ride.routeLabel}>
        <ol className="relative flex flex-wrap justify-center">
          <span
            aria-hidden="true"
            className="absolute inset-x-5 top-1/2 hidden h-px bg-secondary ride:block"
          />
          {landings.map((landing, index) => (
            <li key={landing.id} className="relative">
              <a
                href={`#${landing.id}`}
                data-route-dot={index}
                aria-current={index === 0 ? "location" : undefined}
                className="group relative flex size-11 items-center justify-center no-underline"
              >
                <span
                  aria-hidden="true"
                  className="size-3 rounded-full border-keyline border-secondary bg-background group-aria-[current=location]:size-4 group-aria-[current=location]:bg-accent"
                />
                <span className="sr-only ride:not-sr-only ride:pointer-events-none ride:absolute! ride:bottom-full ride:left-1/2 ride:mb-2 ride:-translate-x-1/2 ride:rounded-sm ride:bg-secondary ride:px-2 ride:py-1 ride:text-label ride:whitespace-nowrap ride:text-secondary-foreground ride:opacity-0 ride:group-hover:opacity-100 ride:group-focus-visible:opacity-100">
                  {landing.title}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <AmbientToggle pauseLabel={site.ride.pause} playLabel={site.ride.play} />
    </div>
  );
}
