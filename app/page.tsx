import type { CSSProperties } from "react";

import Link from "next/link";

import { LandingCardBody, LandingMeta } from "@/components/landing-details";
import { Boat } from "@/components/ride/boat";
import { RideController } from "@/components/ride/ride-controller";
import { RouteMap } from "@/components/ride/route-map";
import { LandingSky, Sky } from "@/components/ride/sky";
import { ReflectionDefs } from "@/components/scenes/kit";
import { scenes } from "@/components/scenes/scenes";
import { SiteHeader } from "@/components/site-header";
import { buttonStyles } from "@/components/ui/button-styles";
import { Card } from "@/components/ui/card";
import { Landing } from "@/components/ui/landing";
import { landings, site } from "@/content/landings";
import { landingSky, landingStage } from "@/lib/ride";

/**
 * The sections stay in normal document flow, so hash links, focus, and find on
 * page all work. On the full Ride their scenes and cards are pinned and moved
 * by RideController. Without it they read as a plain stacked page.
 */
export default function RidePage() {
  return (
    <>
      <SiteHeader current="ride" />
      <main id="main" className="flex-1">
        <Sky />
        <ReflectionDefs />
        <RouteMap />
        <Boat />
        <div id="ride" className="ride:-mt-19">
          {landings.map((landing, index) => {
            const Scene = scenes[landing.scene];
            const isShore = index === 0;
            const stage = landingStage[landing.id];
            const edge =
              stage.side === "left" ? "ride:left-[max(2rem,6vw)]" : "ride:right-[max(2rem,6vw)]";

            return (
              <Landing
                key={landing.id}
                id={landing.id}
                className="relative isolate flex min-h-svh flex-col justify-center px-4 py-12 md:px-6 ride:static ride:isolation-auto ride:block ride:h-[110svh] ride:min-h-0 ride:p-0 ride:last:h-svh"
              >
                <Landing.Scene
                  className={`sky sky-${landingSky[landing.id]}`}
                  style={{ "--landing": index, "--focus": stage.focus } as CSSProperties}
                >
                  <LandingSky
                    stop={landingSky[landing.id]}
                    index={index}
                    last={landings.length - 1}
                  />
                  <Scene />
                </Landing.Scene>
                <Landing.Card
                  className={`mx-auto w-full max-w-xl ride:fixed ride:top-1/2 ${edge} ride:z-30 ride:mx-0 ride:max-w-lg ride:-translate-y-[calc(50%+0.5rem)] ${
                    isShore ? "" : "ride:opacity-0"
                  }`}
                >
                  <Card.Header>
                    <Landing.Title as={isShore ? "h1" : "h2"}>
                      {landing.dryTitle}
                    </Landing.Title>
                    {!isShore && <LandingMeta landing={landing} />}
                  </Card.Header>
                  <Card.Body>
                    <Landing.Body>
                      {isShore ? (
                        <>
                          <p className="text-lead">{landing.summary}</p>
                          <p className="text-label text-muted-foreground">{landing.location}</p>
                          <div className="flex flex-wrap gap-4">
                            <a href={`#${landings[1].id}`} className={buttonStyles.accent}>
                              {site.actions.castOff}
                            </a>
                            <Link href="/dry-land" className={buttonStyles.outline}>
                              {site.actions.dryLand}
                            </Link>
                          </div>
                          <p className="hidden text-label text-muted-foreground ride:block">
                            {site.ride.hint}
                          </p>
                        </>
                      ) : (
                        <LandingCardBody landing={landing} />
                      )}
                    </Landing.Body>
                  </Card.Body>
                </Landing.Card>
              </Landing>
            );
          })}
        </div>
        <RideController />
      </main>
    </>
  );
}
