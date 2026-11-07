import type { Metadata } from "next";

import { LandingDetails, LandingMeta } from "@/components/landing-details";
import { ResumeLink } from "@/components/resume-link";
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
      <main id="main" className="mx-auto w-full max-w-4xl flex-1 px-4 md:px-6">
        <Landing id={shore.id} className="py-12">
          <Landing.Title as="h1">{shore.dryTitle}</Landing.Title>
          <p className="mt-4 max-w-2xl text-lead">{shore.summary}</p>
          <p className="mt-2 text-label text-muted-foreground">{shore.location}</p>
          <div className="mt-6">
            <ResumeLink variant="accent" />
          </div>
        </Landing>

        {sections.map((landing) => (
          <Landing
            key={landing.id}
            id={landing.id}
            className="grid gap-4 py-12 md:grid-cols-4 md:gap-12"
          >
            <div>
              <Landing.Title>{landing.dryTitle}</Landing.Title>
              <LandingMeta landing={landing} />
            </div>
            <Landing.Body className="md:col-span-3">
              <LandingDetails landing={landing} />
            </Landing.Body>
          </Landing>
        ))}
      </main>
    </>
  );
}
