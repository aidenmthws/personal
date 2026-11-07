import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { buttonStyles } from "@/components/ui/button-styles";
import { landings, site } from "@/content/landings";

export const metadata: Metadata = { title: site.notFound.pageTitle };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 md:px-6">
        <h1 className="max-w-2xl font-display text-title font-medium">
          {site.notFound.title}
        </h1>
        <p className="mt-4">{site.notFound.body}</p>
        <div className="mt-6">
          <Link href="/dry-land" className={buttonStyles.accent}>
            {site.actions.dryLand}
          </Link>
        </div>
        <nav aria-label={site.notFound.routeLabel} className="mt-12">
          <h2 className="font-display text-heading font-medium">
            {site.notFound.routeLabel}
          </h2>
          <ol className="mt-2 flex flex-col">
            {landings.map((landing) => (
              <li key={landing.id}>
                <Link href={`/#${landing.id}`} className="inline-block py-2.5">
                  {landing.title}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </main>
    </>
  );
}
