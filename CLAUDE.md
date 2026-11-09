# Aiden Mathews portfolio: "The Backwater Journey"

A personal portfolio site themed as a boat ride down a Kerala backwater. The resume is the route: each job, project, and skill set is a landing along the river, from a mountain stream (Virginia Tech) to a harbor at dusk (contact). The full spec is in `PLAN.md` in the repo root. Read it before building anything.

## Scope: build the MVP only

The MVP is a complete, deployable site that can be built in two to three days:

- All nine landings, with resume content, drawn from one shared SVG scene kit (water, bank, palms, houses, reeds) recolored and recomposed per landing, three layers each.
- The ride: pinned scene and card layers, a boat that follows scroll, a sky that shifts from dawn to dusk, and a route map with clickable dots.
- A Dry Land page (`/dry-land`): the same content as plain, fast HTML, newest work first, with a header toggle between Ride and Dry Land and a resume PDF link.
- Harbor contact: copy-email button, LinkedIn, resume download.
- A stacked page for phones, small windows, reduced motion, and failed scripts, plus keyboard and contrast checks.

Do not build these yet (add-ons, in priority order): left-rail boat and top-left route map on phones, fishing-net interaction, "Sort the cargo" demo, Spice Market skill lighting, Before/After toggle, unique art per landing, lamp and "currently" line, project links, sound, WebGL water, easter eggs, custom domain, Malayalam text.

## Stack

Next.js (App Router, static generation) with TypeScript, Tailwind with shadcn-style semantic tokens, plain SVG scenes, deployed to Vercel. For the MVP use fixed pinned layers plus a small scroll handler; do not add GSAP until an add-on needs it. Ask before adding any other dependency.

## Commands

- `npm run dev`: start the dev server at http://localhost:3000.
- `npm run build`: production build. Run `npm start` afterward to serve it.
- `npm run lint`: run ESLint.
- `npm test`: run the tests in `content/` and `lib/` with Node's built-in test runner.
- `npm run test:e2e`: build the site and run the browser tests in `e2e/` with Playwright (Chromium, Firefox, WebKit). Browsers install with `npx playwright install`.

This is Next.js 16. Check the bundled guides in `node_modules/next/dist/docs/` before using a Next.js API.

## Architecture

- One typed file, `content/landings.ts`, is the single source of truth. Both the Ride (`/`) and Dry Land (`/dry-land`) render from it. Never duplicate copy in components.
- Next keeps the page you left in the DOM, hidden (`cacheComponents`). Client code must search inside its own page, never the whole document, because Dry Land and the Ride share markup and ids.
- Client components never import `content/landings.ts`, because that ships all copy as JS. Server components pass them strings as props. `content/error-copy.ts` is the one exception, for the error page.
- The landing sections stay in normal flow, so hash links, focus, and find on page work. The stacked page is the default. An inline script in `<head>` sets `data-ride` before first paint at 1024 by 700 and up without reduced motion, and removes it if the Ride's script fails.
- All text lives in the DOM as real HTML, never inside canvas or images. The Ride is progressive enhancement on top of that HTML.
- Scenes are code-built SVG components in `components/scenes/`, one per landing, sharing a kit of reusable parts. All nine ship inline, with no lazy loading.

## Design and engineering rules

1. No AI-slop defaults: no purple-to-blue gradients, no glassmorphism, no stock SaaS hero layout, no single highlighted or italicized word in a headline.
2. One aesthetic, enforced: flat vector illustration, editorial typography, thin gold keylines. Tokens: 4 px radius on cards and buttons, 1.5 px gold keylines, 2 px outlines on foreground illustration objects only, no drop shadows, 4 px spacing base (steps 8, 16, 24, 48, 96).
3. Compound components, never boolean flags: `Landing`, `Landing.Scene`, `Landing.Card`, `Landing.Title`, `Landing.Body`, `Card.Header`, `Card.Body`. No `isCompact` or `hasHeader` props.
4. WCAG 2.2 AA is a hard requirement: semantic landmarks, AA contrast at every sky stop, visible focus, native elements before ARIA, labels on icon-only controls, 44 by 44 px touch targets.
5. Copy: sentence case, plain verbs, active voice, no all-caps kickers, no filler. Landing names are sentence case on the site (The lake, Broad water).
6. Real empty and error states: a 404 that offers the route map and Dry Land; failed copy-email shows the address as selectable text; a missing resume PDF shows "My resume PDF is not posted yet. Email me for a copy." with an email link; a scene that fails to load falls back to Dry Land with a one-line explanation. Never a bare "Something went wrong."
7. Use Tailwind with shadcn-style semantic tokens (`background`, `foreground`, `muted`, `accent`, `border`, `ring`) mapped to the palette; utility classes before arbitrary values. Use shadcn primitives only where behavior is needed (button, dialog, tooltip) and restyle through tokens. Illustration geometry is exempt.
8. Hierarchy and rhythm: a defined type scale, one purpose per element, generous whitespace, group by proximity. The gold keyline appears once per landing card and never as dividers inside it.
9. Motion with restraint: motion explains position (the ride) and state (hover, focus, copy confirmation). Ambient loops (boat bob, ripples) are the one exception: slow, small, never bouncy, pausable. All motion is off or reduced under `prefers-reduced-motion`. Animate only `transform` and `opacity`.

## Content rules

- Use only facts and metrics from the resume, verbatim. Never invent numbers, timings, or percentages.
- Publish the email `2023amathews@gmail.com` and the LinkedIn link. Do not publish the phone number. Leave out GitHub and project links until they exist.
- The Agentic Decision Evaluation Harness is in progress: mark it that way and show no results.
- Do not publish internal system names, ticket content, or screenshots from Freddie Mac or Juume AI. Any demo data must be fictional.
- No Malayalam text in the MVP.
- Hero line: "I build backend systems and AI tooling that make messy data easier to use." Share description: "Software engineer building APIs, observability, and LLM tooling." Page title: "Aiden Mathews | Software engineer building APIs, observability, and LLM tooling."

## Done means

- `build` and `lint` pass; Dry Land scores 100 and the Ride 90 or more on Lighthouse performance, with 100 accessibility on both.
- Works with keyboard only, with `prefers-reduced-motion`, and on a phone-width viewport.
- Every landing's text is present and correct against the resume.