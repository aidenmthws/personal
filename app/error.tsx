"use client";

import Link from "next/link";

import { buttonStyles } from "@/components/ui/button-styles";
import { errorCopy } from "@/content/error-copy";

export default function RideError({ retry }: { retry: () => void }) {
  return (
    <main id="main" className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 md:px-6">
      <h1 className="font-display text-title font-medium">{errorCopy.title}</h1>
      <p className="mt-4">{errorCopy.body}</p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/dry-land" className={buttonStyles.accent}>
          {errorCopy.dryLand}
        </Link>
        <button type="button" onClick={() => retry()} className={buttonStyles.outline}>
          {errorCopy.retry}
        </button>
      </div>
    </main>
  );
}
