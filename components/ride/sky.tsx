import { skyStops } from "@/lib/ride";

/** One static layer per stop. The Ride crossfades them with opacity only. */
export function Sky() {
  return (
    <div aria-hidden="true" className="hidden ride:block">
      {skyStops.map((stop, index) => (
        <div
          key={stop}
          data-sky-layer={index}
          className={`sky sky-${stop} fixed inset-0 z-0 ${index === 0 ? "" : "opacity-0"}`}
        />
      ))}
      <div className="pointer-events-none fixed inset-0 z-25 bg-[url(/grain.png)] opacity-3" />
    </div>
  );
}
