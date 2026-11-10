import type { Metadata } from "next";

import { DryLandHorizon } from "@/components/dry-land-horizon";
import { LandingDetails, LandingMeta } from "@/components/landing-details";
import { ResumeLink } from "@/components/resume-link";
import { RouteGlyph } from "@/components/ride/route-glyphs";
import { SiteHeader } from "@/components/site-header";
import { Landing } from "@/components/ui/landing";
import { dryLandLandings, site } from "@/content/landings";

export const metadata: Metadata = {
  title: site.dryLandPageTitle,
  alternates: { canonical: "/dry-land" },
};

const [shore, ...sections] = dryLandLandings;

export default function DryLandPage() {
  return (
    <>
      <SiteHeader current="dry-land" />
      <main id="main" className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-4 md:px-6">
          <Landing id={shore.id} className="py-12">
            <Landing.Title as="h1">{shore.dryTitle}</Landing.Title>
            <p className="mt-4 max-w-2xl text-lead">{shore.summary}</p>
            <p className="mt-2 text-label text-muted-foreground">{shore.location}</p>
            <div className="mt-6">
              <ResumeLink variant="accent" />
            </div>
          </Landing>
        </div>

        <DryLandHorizon pauseLabel={site.ride.pause} playLabel={site.ride.play} />
        <div aria-hidden="true" className="kasavu-cap" />

        <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6">
          {sections.map((landing, index) => (
            <Landing
              key={landing.id}
              id={landing.id}
              className="relative grid gap-4 py-12 pl-12 md:grid-cols-4 md:gap-12 md:pl-14"
            >
              {/* Each stop runs the river on to the next one, so it ends at the last stop. */}
              {index < sections.length - 1 && (
                <span aria-hidden="true" className="river-line absolute top-12 -bottom-12 left-3" />
              )}
              <span
                aria-hidden="true"
                className="absolute top-12 left-0 flex size-9 items-center justify-center rounded-full border-keyline border-border bg-background text-link"
              >
                <RouteGlyph id={landing.id} />
              </span>
              <div>
                <p className="text-label text-muted-foreground">{landing.title}</p>
                <Landing.Title>{landing.dryTitle}</Landing.Title>
                <LandingMeta landing={landing} />
              </div>
              <Landing.Body className="md:col-span-3">
                <LandingDetails landing={landing} />
              </Landing.Body>
            </Landing>
          ))}
        </div>
      </main>
    </>
  );
}
