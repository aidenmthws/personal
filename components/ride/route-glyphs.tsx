import type { LandingId } from "@/content/landings";

/* Drawn on a 24 by 24 grid with one stroke, so they sit together as a set. */
const glyphs: Record<LandingId, string> = {
  shore: "M2 13h20M6 13v7M12 13v7M18 13v7M4 9h8",
  boatman: "M3 11l9-7 9 7M5 11v9h14v-9M12 20v-6",
  source: "M2 20l7-13 4 7 2-3 7 9M13 20c-1-2 1-3 0-5",
  canal: "M3 12l9-8 9 8M6 10v10h12V10M10 20v-5h4v5",
  water: "M12 3L3 11c3 9 15 9 18 0zM12 3v14M7.5 7v9M16.5 7v9",
  lake: "M2 16c3 5 17 5 20 0zM5 15c1-9 13-9 14 0M10 8.5V15M14 8.5V15",
  channels: "M12 22v-8M12 14C12 8 6 8 6 2M12 14c0-6 6-6 6-12",
  market: "M9 3h6l-1 3c5 3 4 13 1 15H9C6 19 5 9 10 6zM7 13h10",
  harbor: "M12 22V8M9 22h6M8.5 3h7v6h-7zM8 9h8",
};

export function RouteGlyph({ id }: { id: LandingId }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="block size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={glyphs[id]} />
    </svg>
  );
}
