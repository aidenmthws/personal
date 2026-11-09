"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";

import { buttonStyles } from "@/components/ui/button-styles";

type SortCargoProps = {
  labels: {
    action: string;
    title: string;
    intro: string;
    note: string;
    unsorted: string;
    auto: string;
    reset: string;
    close: string;
    score: string;
    empty: string;
    moveTo: string;
  };
  baskets: string[];
  requests: { text: string; basket: string }[];
};

/** How far apart the sample sort drops each request into its basket. */
const AUTO_STEP_MS = 180;

type Placement = Record<string, string>;

/**
 * A small demo of LLM request grouping, using invented data and a pre-computed
 * answer. Every drag has a button alternative, and the dialog's focus handling
 * is the browser's own.
 */
export function SortCargo({ labels, baskets, requests }: SortCargoProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const timers = useRef<number[]>([]);
  const [placed, setPlaced] = useState<Placement>({});

  function stopAuto() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }

  useEffect(() => stopAuto, []);

  function place(text: string, basket: string) {
    setPlaced((current) => ({ ...current, [text]: basket }));
  }

  function sortAll() {
    stopAuto();
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requests.forEach((request, index) => {
      if (still) place(request.text, request.basket);
      else
        timers.current.push(
          window.setTimeout(() => place(request.text, request.basket), index * AUTO_STEP_MS),
        );
    });
  }

  function reset() {
    stopAuto();
    setPlaced({});
  }

  function onDrop(event: DragEvent<HTMLElement>, basket: string) {
    event.preventDefault();
    const text = event.dataTransfer.getData("text/plain");
    if (requests.some((request) => request.text === text)) place(text, basket);
  }

  const matched = requests.filter((request) => placed[request.text] === request.basket).length;
  const sorted = Object.keys(placed).length;
  const score = labels.score
    .replace("{matched}", String(matched))
    .replace("{total}", String(requests.length));

  function renderRequest(request: { text: string }) {
    const here = placed[request.text];
    return (
      <li
        key={request.text}
        draggable
        onDragStart={(event) => event.dataTransfer.setData("text/plain", request.text)}
        className="cursor-grab rounded-sm bg-muted p-2"
      >
        <p>{request.text}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-1">
          <span className="sr-only">{labels.moveTo}</span>
          {baskets
            .filter((basket) => basket !== here)
            .map((basket) => (
              <button
                key={basket}
                type="button"
                aria-label={`${labels.moveTo} ${basket}: ${request.text}`}
                onClick={() => place(request.text, basket)}
                className="min-h-11 rounded-sm px-2 text-label text-link underline"
              >
                {basket}
              </button>
            ))}
        </div>
      </li>
    );
  }

  const waiting = requests.filter((request) => !placed[request.text]);

  return (
    <div className="invisible hydrated:visible">
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className={buttonStyles.outline}
      >
        {labels.action}
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="cargo-title"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close();
        }}
        onClose={stopAuto}
        className="m-auto max-h-[90svh] w-[min(64rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-sm border-keyline border-border bg-card p-6 text-card-foreground"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="cargo-title" className="font-display text-title font-medium">
            {labels.title}
          </h2>
          <button type="button" onClick={() => dialog.current?.close()} className={buttonStyles.outline}>
            {labels.close}
          </button>
        </div>
        <p className="mt-2">{labels.intro}</p>
        <p className="mt-2 text-label text-muted-foreground">{labels.note}</p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button type="button" onClick={sortAll} className={buttonStyles.accent}>
            {labels.auto}
          </button>
          <button type="button" onClick={reset} className={buttonStyles.outline}>
            {labels.reset}
          </button>
          <p role="status" className="text-label">
            {sorted > 0 && score}
          </p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <section aria-labelledby="cargo-waiting">
            <h3 id="cargo-waiting" className="font-medium">
              {labels.unsorted}
            </h3>
            {waiting.length > 0 ? (
              <ul className="mt-2 flex flex-col gap-2">{waiting.map(renderRequest)}</ul>
            ) : (
              <p className="mt-2 text-label text-muted-foreground">{labels.empty}</p>
            )}
          </section>
          {baskets.map((basket) => {
            const inBasket = requests.filter((request) => placed[request.text] === basket);
            return (
              <section
                key={basket}
                aria-label={basket}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => onDrop(event, basket)}
                className="min-h-24 rounded-sm border-keyline border-dashed border-muted-foreground p-2"
              >
                <h3 className="font-medium">{basket}</h3>
                {inBasket.length > 0 ? (
                  <ul className="mt-2 flex flex-col gap-2">{inBasket.map(renderRequest)}</ul>
                ) : (
                  <p className="mt-2 text-label text-muted-foreground">{labels.empty}</p>
                )}
              </section>
            );
          })}
        </div>
      </dialog>
    </div>
  );
}
