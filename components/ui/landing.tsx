import type { ComponentProps } from "react";

import type { LandingId } from "@/content/landings";

import { Card } from "./card";

type LandingProps = ComponentProps<"section"> & { id: LandingId };

function LandingRoot({ className = "", ...props }: LandingProps) {
  return <section data-landing className={className} {...props} />;
}

/** The decorative illustration layer, hidden from assistive tech. */
function LandingScene({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-scene
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ride:fixed ride:z-10 ride:overflow-visible ride:bg-none ${className}`}
      {...props}
    />
  );
}

function LandingCard({ className = "", ...props }: ComponentProps<typeof Card>) {
  return <Card data-card className={`relative ride:max-h-[calc(100svh-11rem)] ride:overflow-y-auto ${className}`} {...props} />;
}

type LandingTitleProps = ComponentProps<"h2"> & { as?: "h1" | "h2" };

const titleSizes = { h1: "text-display", h2: "text-heading" };

function LandingTitle({ as: Heading = "h2", className = "", ...props }: LandingTitleProps) {
  return (
    <Heading
      className={`font-display font-medium text-foreground ${titleSizes[Heading]} ${className}`}
      {...props}
    />
  );
}

function LandingBody({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`flex flex-col gap-4 ${className}`} {...props} />;
}

export const Landing = Object.assign(LandingRoot, {
  Scene: LandingScene,
  Card: LandingCard,
  Title: LandingTitle,
  Body: LandingBody,
});
