import Link from "next/link";

import { NameSwap } from "@/components/name-swap";
import { site } from "@/content/landings";

type SiteVersion = "ride" | "dry-land";

const skipLinks: Record<SiteVersion | "elsewhere", { href: string; label: string }[]> = {
  ride: [
    { href: "/dry-land", label: site.skipLinks.dryLand },
    { href: "#harbor", label: site.skipLinks.contact },
  ],
  "dry-land": [
    { href: "#main", label: site.skipLinks.content },
    { href: "#harbor", label: site.skipLinks.contact },
  ],
  elsewhere: [
    { href: "#main", label: site.skipLinks.content },
    { href: "/#harbor", label: site.skipLinks.contact },
  ],
};

const versions: { id: SiteVersion; href: string; label: string }[] = [
  { id: "ride", href: "/", label: site.nav.ride },
  { id: "dry-land", href: "/dry-land", label: site.nav.dryLand },
];

const skipLinkStyles =
  "sr-only rounded-sm bg-secondary px-4 py-2 text-secondary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:inline-flex focus:min-h-11 focus:items-center";

const toggleStyles =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm px-2 font-medium whitespace-nowrap no-underline md:px-4";

/**
 * `current` is the version being viewed. Pages outside the two leave it unset.
 * Links skip prefetching so Dry Land never downloads the Ride's scenes unasked.
 */
export function SiteHeader({ current }: { current?: SiteVersion }) {
  const isRide = current === "ride";

  return (
    <header className={isRide ? "sticky top-0 z-50 h-19 bg-background" : ""}>
      <div
        className={`mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-4 md:px-6 ${
          isRide ? "ride:max-w-none ride:px-[max(2rem,6vw)]" : ""
        }`}
      >
        {skipLinks[current ?? "elsewhere"].map((link) => (
          <a key={link.href} href={link.href} className={skipLinkStyles}>
            {link.label}
          </a>
        ))}
        <Link
          href="/"
          prefetch={false}
          className="group inline-flex min-h-11 items-center font-display text-body whitespace-nowrap text-foreground no-underline md:text-lead"
        >
          <NameSwap />
        </Link>
        <nav aria-label={site.nav.label}>
          <ul className="flex gap-1 md:gap-2">
            {versions.map((version) => (
              <li key={version.id}>
                <Link
                  href={version.href}
                  prefetch={false}
                  aria-current={version.id === current ? "page" : undefined}
                  className={`${toggleStyles} ${
                    version.id === current
                      ? "bg-secondary text-secondary-foreground"
                      : "text-foreground underline"
                  }`}
                >
                  {version.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
