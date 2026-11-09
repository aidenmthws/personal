# Portfolio plan: The Backwater Journey

Owner: Aiden Mathews. Written 2026-11-06. This is the full spec. `CLAUDE.md` in the repo root holds the short rules that apply every session.

## 1. Concept and goals

The site is one boat ride down a Kerala backwater. The resume is the route: Virginia Tech is the mountain stream where the river starts, each internship is a landing downstream, and a harbor at dusk is where visitors get in touch. The river runs in chronological order, so the ride reads as a career flowing downstream.

Goals:

- Give a recruiter a clear picture of Aiden's work in under 60 seconds, through the Dry Land page or the first few landings.
- Be memorable enough that interviewers bring it up.
- Show front-end craft (illustration, motion, accessibility) next to the backend and AI work on the resume.

Audience: recruiters and engineers hiring for full-time roles and internships, plus peers and classmates.

This replaces the current site at aidenmathews.vercel.app, and that URL keeps working.

Positioning (decided):

- Hero line: "I build backend systems and AI tooling that make messy data easier to use."
- Share description: "Software engineer building APIs, observability, and LLM tooling."
- Page title: "Aiden Mathews | Software engineer building APIs, observability, and LLM tooling."
- Alternate, not used for now: "Backend and AI engineer: Go and Java services, cloud infrastructure, LLM workflows."

Principles:

1. The route is the resume. Landings run in chronological order, source to sea.
2. Native scroll only. The visitor scrolls normally and the boat and scenery respond. No hijacked scrolling.
3. Every word is real text in the page. Scenes are decoration, and the same content powers a plain "Dry Land" version.
4. Kerala is the setting, told with specifics (nets, jetties, spice stalls, lamplight), not a costume. No stock palms and no sacred imagery.
5. One idea per landing: one scene, one interaction (add-on), one number.

The design and engineering rules are in `CLAUDE.md`.

## 2. The route

| # | Landing | Resume source | Time of day |
| --- | --- | --- | --- |
| 1 | Shore | Hero: name and one-liner | Dawn mist |
| 2 | The boatman | About: a short personal note | Sunrise |
| 3 | The source | Virginia Tech, B.S. in CS | Early morning, hills and mist |
| 4 | First canal | Bunchful Enterprise, 2024 to 2025 | Morning, narrow village water |
| 5 | Broad water | Juume AI, 2025 to 2026 | Late morning, fishing nets |
| 6 | The lake | Freddie Mac, 2026 | Noon, houseboats and baskets |
| 7 | Side channels | Two projects, optional detours | Afternoon, quiet branches |
| 8 | Spice market | Skills, linked to the route | Golden hour, jars and lamps |
| 9 | Harbor | Contact, resume, next steps | Dusk, lamps lit |

Ids for deep links: `shore`, `boatman`, `source`, `canal`, `water`, `lake`, `channels`, `market`, `harbor`.

## 3. Landing specs

All figures come from the resume as written. For the MVP, only the scene and content ship; interactions are add-ons.

### 1. Shore (hero)

- Scene: pre-dawn mist over still water. A wooden vallam (country boat) waits at a jetty under a cream-grey sky.
- Content: name, hero line, and two buttons: "Cast off" starts the ride and "Dry Land" opens the plain version. Optional location line (Northern Virginia).
- Add-on interaction: ripples follow the cursor.

### 2. The boatman (about)

- Scene: a small veranda on the bank with an unlit oil lamp (nilavilakku) and a glass of chai.
- Content: 80 to 120 words on who Aiden is, what he builds for fun, and what he wants next, including a line or two on his family being from Kerala, kept light. Photo is optional and an add-on. The MVP uses a short general note from Aiden until the longer one is written.
- Add-on interaction: tap the lamp to light it and reveal a "currently" line.

### 3. The source (Virginia Tech)

- Scene: misty hills and a stream. Blacksburg sits in the Appalachians and Kerala's rivers begin in the Western Ghats. The stream widens as the boat enters.
- Content: Virginia Tech, B.S. in Computer Science, GPA 3.72. Coursework as stones in the stream: Computer Systems, Introduction to AI, Machine Learning, Data Structures and Algorithms, Computer Organization, Discrete Mathematics, Cloud Software Development, Probability and Statistics.

### 4. First canal (Bunchful Enterprise, Sep 2024 to Jan 2025)

- Scene: a narrow canal with tile-roofed houses and palms close on both banks, in early-morning gold light.
- Content: Software Engineering Intern, New York. Led the Bunchful.news migration from WordPress to React with React Router and Firebase real-time updates (40% faster load). Built responsive React and CSS components (100% cross-browser and device compatibility, mobile page speed up 22 points). Tested with Jest and React Testing Library (85% coverage).
- Add-on interaction: Before/After toggle that swaps a heavy cargo boat for a light canoe while the 40% figure counts up.

### 5. Broad water (Juume AI, Jun 2025 to Jun 2026)

- Scene: wider water at midday with cantilevered Chinese fishing nets along the bank, an icon of Kochi. Nets stand in for telemetry.
- Content: Junior Fullstack Engineering Intern, Reston. Go (Gin) analytics API for gateway usage, token consumption, and performance metrics. Temporal, DuckDB, Postgres, and GCS for log analytics and PII detection (35% lower API latency, 93% of PII detected). Langfuse tracing stack on Google Cloud provisioned with Terraform. AI Gateway control plane refactor and IAM token refresh race-condition fixes (90% fewer crashes, zero-downtime deploys on Cloud Run).
- Add-on interaction: lower the net and the catch lands in a basket as three labeled results (93% PII detected, 35% lower latency, 90% fewer crashes), each expanding to a two-sentence story.

### 6. The lake (Freddie Mac, May to Aug 2026)

- Scene: open lake at noon with houseboats at anchor and a floating jetty stacked with baskets.
- Content: Software Engineering Intern, McLean. AI-assisted workflows, agent skills, and a Node.js MCP server that groups customer enhancement requests with LLM categorization (40% less manual triage across hundreds of tickets). Java Spring Boot and MongoDB backend for a portal used by 50+ internal stakeholders. Angular chatbot UI (30% less review time per request). Bruno and Jenkins checks (25% fewer environment-related deployment failures).

### 7. Side channels (projects)

- Scene: the canal forks into two narrow channels under a footbridge, in afternoon light.
- Content:
  - Agentic Decision Evaluation Harness (Sep 2026; TypeSafe Jev, Claude API, Python, MCP). An MCP-based harness comparing Jev against Claude on infrastructure tool-routing and risk-gating decisions (Terraform, kubectl) with identical typed output schemas, measuring tool-selection accuracy, hallucination rate, Brier score, latency, and cost, plus a confidence-threshold hybrid that escalates to Claude. Status: in progress, so show no results.
  - Smart Legal Document Analyzer (Jul 2025; React, FastAPI, OpenAI API). LLM extraction and PDF parsing on Vercel serverless (30% better comprehension, 35% faster load).
- The Ride shows each project's name, date, status, and stack. Dry Land adds the full description. No links until repos or demos exist.

### 8. Spice market (skills)

- Scene: stalls on the water's edge in golden-hour light. Four stalls match the resume categories.
- Content: every skill on the resume as a jar on its stall. No self-rated bars or percentages.
  - Languages: Java, JavaScript, Python, Go, C++, C#, SQL, HTML/CSS.
  - Frameworks: React, Spring Boot, Angular, Node.js, FastAPI, Gin, Tailwind.
  - Databases: PostgreSQL, MongoDB, ClickHouse, DuckDB, Firebase.
  - Cloud and tools: Docker, GCP, AWS, Terraform, MCP, Langfuse, CI/CD, Redis, Git, Vercel, OpenAI API, Agile/Scrum.
- Add-on interaction: hover or focus a jar and the route map lights the landings where that skill was used.

### 9. Harbor (contact)

- Scene: dusk at a busy harbor with lamps lit. The boat docks and the sky settles to deep teal.
- Content: one-line ask (open to full-time roles and internships), copy-to-clipboard email (2023amathews@gmail.com), LinkedIn (linkedin.com/in/aiden-mathews), and the resume PDF. A footer "log of the voyage" covering the stack, fonts, and how the site was built. Do not publish the phone number. GitHub is added once there is a profile to link.

## 4. Visual design system

The look is one day on the water, in flat, layered vector illustration with kasavu-style gold borders on every information card. Sunrise at the source, dusk at the harbor.

Palette (starting points; contrast-test before shipping):

| Token | Hex | Use |
| --- | --- | --- |
| Mist | #F3EDE0 | Page base, dawn sky, card fill |
| Kasavu gold | #C8A24A | Card borders, focus rings, lit lamps; never body text on light backgrounds |
| Backwater teal | #1F7A74 | Water, links |
| Deep canal | #0F3B3A | Dusk sky, dark panels |
| Palm green | #4B7B3C | Banks and foliage |
| Laterite red | #B4492B | Roof tiles and the one call-to-action accent |
| Husk brown | #6F5237 | Boat, jetties, stalls |
| Ink | #14221F | Body text on Mist |

Map these to shadcn-style semantic tokens (`background` = Mist, `foreground` = Ink, `muted`, `accent`, `border` = gold, `ring` = gold, and so on) in CSS variables.

Time of day: the sky gradient is driven by scroll position through six stops: pre-dawn grey-blue (Shore, Boatman), peach sunrise (Source), pale gold (First canal), bright blue-green (Broad water, Lake), warm amber (Side channels, Spice market), deep teal with lantern glow (Harbor).

Type:

- Display: Fraunces.
- Body: Instrument Sans.
- Tags and tech labels: IBM Plex Mono, in sentence case.
- No Malayalam in the MVP.

Illustration rules:

- Five layers per scene (far hills and groves, mid bank, reflection, water and reeds, and a fast frame of overhanging fronds), over a shared moving sky. Every layer uses one scale, so the art always fills the width, and below 900 px it crops to the landing's focal point.
- Flat color fields from the palette. Bold dark outlines only on foreground objects (boat, nets, jars), in the spirit of Kerala mural painting without copying it.
- A 3% paper-grain overlay, pre-rendered as a small tile rather than computed live.
- Reusable parts (palms, houses, reeds, birds) are shared across scenes. Scenes are code-built SVG.

Kasavu card: Mist fill, 1.5 px gold border with a thin inner rule, and a woven-stripe cap on the header. All body text sits on this solid card, never directly on the sky, so contrast holds at every time of day.

## 5. Interaction and motion (MVP)

- Full Ride (1024 by 700 and up, without reduced motion): scene and card layers are pinned with `position: fixed` while the landing sections stay in normal flow, so hash links, focus, and find on page work. Scroll position maps to the world sliding sideways past a boat near center. Each landing gets about 110svh of page height.
- Stacked page: the default, used on phones, in small windows, with reduced motion, and if scripts fail. An inline script in `<head>` opts in to the full Ride before first paint, and opts back out if the Ride's script errors or has not started 3 seconds after load (8 seconds at most).
- Moving: one scroll gesture, swipe, or key press is one landing. The page jumps straight to that landing's dock, which is invisible because everything is pinned, and the world travels there on a critically damped spring that eases in and out in about a second, with no pause at any point. A trackpad's momentum belongs to the step already taken; a new push during momentum, or a reversal, takes another step and the spring carries its speed through the change of target. Native scrolling between landings was tried and rejected, because it could stop between two landings and had to wait for input to go still before finishing the trip. CSS scroll snapping was also rejected: Firefox skipped landings and Chromium snapped slow scrolls back. A dragged scrollbar still works, and settles on a landing if it stops between two. The footer scrolls normally past the last landing. The route map follows what is on screen. Each dock sits at its section's top, so hash links land docked. The Shore card says to scroll or use the arrow keys.
- Cards are headed by the organization or a plain title (About, Projects, Skills, Contact). Landing names appear only on the route map. Cards alternate sides so each scene composes around its own art, and the Skills card is wider so it fits short windows.
- Phones: the stacked page, with each scene in its own band above its card.
- Boat: an SVG sprite with a boatman, positioned along a gently winding path, rotated to the path tangent, and docked clear of each card. It bobs about 3 px on a 4 second loop, leans and trails a wake with speed, and the pole strokes once per landing.
- Route map: a winding river with one glyph per landing and a small boat that follows the ride, fixed at bottom center on the full Ride. On the stacked page it is a strip in normal flow, with 44 by 44 px targets, so it never covers content. The current landing is highlighted and named. Stops are real links, so it doubles as navigation.
- Sky: six static layers, one per stop, crossfaded with opacity only. Each paints the sky, the water, and its own clouds. A sun crosses the route, rising after the Shore and setting by the Harbor, with a moon and stars at the Harbor.
- Arrivals: each landing plays one small event as the boat docks, such as birds lifting or the Harbor lamps coming on in turn. Cast off drops the mooring and lifts the mist before the first trip. Without the Ride's script everything simply stays lit.
- Guided ride: Cast off, or the button by the route map, sails the route by itself and stays at each card for its reading time, measured from the card's word count. Pause holds the stop and resumes it. Any scroll, swipe, key, route map click, or Tab hands control back to the visitor, and Cast off then continues from that landing. Using a control in a card pauses the ride, and pointing at one holds it. The ride stops at the Harbor and offers to ride again. On the stacked page, Cast off is a plain link.
- Ambient loops: palms, mist, ripples, ducks, steam, and water run only at the docked landing and stop with the pause control.
- Deep links: each landing has a hash URL such as `#lake`, updated with `replaceState` as the visitor scrolls.
- Keyboard: arrow keys, Page Up, Page Down, Space, `[`, and `]` move one landing, Home and End go to the Shore and Harbor, and every interactive object is reachable by Tab.
- Timing: scene reveals 600 to 900 ms on a slow ease-out. Ripples loop 2 to 3 seconds. A trip between landings takes about a second. Nothing flashes.
- Reduced motion: the stacked page, with the same illustrated scenes and no animation.
- Loading: all nine scenes ship inline in the page, with no lazy loading. Together they add about 28 KB gzipped.

Dry Land (`/dry-land`): a plain, fast page with the same content, laid out as a normal resume-style page with the resume PDF link at the top, newest work first. The Ride keeps the river order. A "Ride / Dry Land" toggle sits in the header on every page. Dry Land is offered (not forced) when the visitor prefers reduced motion or has data saver on, and it is the no-JavaScript fallback.

## 6. Content model

```ts
type Landing = {
  id: string            // "lake"
  title: string         // "The lake"
  org?: string          // "Freddie Mac"
  role?: string
  dates?: string        // "May 2026 to Aug 2026"
  summary: string       // <= 45 words, for the card
  bullets: string[]     // full resume bullets, for Dry Land
  metrics: { value: string; label: string }[]
  skills: string[]      // feeds Spice Market lighting (add-on)
  links?: { label: string; href: string }[]
  scene: string         // key of the scene component
}
```

The built type also has `dryTitle`, `location`, `coursework`, `projects`, and `skillGroups`.

Copy rules: first person, plain verbs, one number per card, no more than 45 words on a landing card. Full bullets live on Dry Land. Metrics are taken verbatim from the resume.

## 7. Architecture

```text
/app
  /page.tsx              Ride (default route)
  /dry-land/page.tsx     Plain version of the same content
/content/landings.ts     Single source of truth
/components
  /scenes/*              One SVG scene per landing, shared kit
  /boat, /route-map, /sky
  /ui                    Compound components (Landing, Card)
/lib/scroll, /lib/motion
/app/fonts              Subset Fraunces and Instrument Sans
/public/Aiden_Mathews_resume.pdf
```

- Next.js (App Router, static generation) with TypeScript, deployed to Vercel, keeping aidenmathews.vercel.app live.
- Tailwind with shadcn-style semantic tokens mapped to the palette. shadcn primitives only for button, dialog, and tooltip.
- Scroll: fixed pinned layers and a small scroll handler. GSAP ScrollTrigger only if an add-on needs it.
- Testing: Playwright smoke tests, axe-core, Lighthouse CI, and Jest with React Testing Library for components.
- Analytics: Vercel Web Analytics or Plausible. Track reaching the Harbor, resume downloads, email copies, and Dry Land use.

Performance budget (starting targets; sizes are compressed transfer):

| Metric | Ride | Dry Land |
| --- | --- | --- |
| Largest Contentful Paint | 2.5 s or less | 1.5 s or less |
| Initial JavaScript (gzipped) | 180 KB or less | About 140 KB |
| First-load transfer | 600 KB or less | About 230 KB |
| One scene's SVG (gzipped) | 80 KB or less | Not used |
| Layout shift | Under 0.05 | Under 0.05 |
| Lighthouse performance | 90 or more | 100 |

Tactics: animate only `transform` and `opacity` from one shared animation loop; pause off-screen scenes and pause everything when the tab is hidden; subset fonts; use AVIF or WebP for any photos.

## 8. Accessibility checklist (WCAG 2.2 AA)

- [ ] Every landing is a `section` with a real heading. The Ride uses river order and Dry Land uses newest first.
- [ ] All text lives in the DOM, never inside canvas or images.
- [ ] Scenes are decorative and hidden from assistive tech; meaningful content has text alternatives.
- [ ] Contrast of at least 4.5:1 for text at every sky stop, guaranteed by solid kasavu cards.
- [ ] Visible gold focus rings on every interactive element.
- [ ] Every drag interaction has a button or keyboard alternative.
- [ ] Skip links to Dry Land and to Contact at the top of the page.
- [ ] Touch targets of at least 44 by 44 px.
- [ ] A pause control for ambient animation, and `prefers-reduced-motion` honored.
- [ ] Tested with VoiceOver and NVDA, plus axe-core in CI.

Phones: the stacked page, tap alternatives for every hover interaction, `svh` and `dvh` units so the browser toolbar does not break the height, and testing on real iPhone Safari and a low-end Android phone.

## 9. MVP build plan

| Day | Work | Done when |
| --- | --- | --- |
| 1 | Next.js project, design tokens and fonts, typed content file with all nine landings, Dry Land page, resume link | Dry Land passes build and lint locally |
| 2 | Scene kit, scroll stage, boat, sky gradient, route map, nine landing cards, Harbor, first deploy | The full ride works on desktop and replaces the current site |
| 3 (buffer) | Mobile pass, reduced motion, keyboard and contrast check, share image, final copy edit, deploy | Safe to send to recruiters |

Dry Land comes first so the content is proven after Day 1, and the Ride is built on the same content file. The live site stays in place until the Ride exists.

Add-ons after the MVP, in priority order (each can ship on its own):

1. Phone Ride: a left-rail boat and a top-left route map.
2. Before/After toggle at the First canal.
3. Lamp-lighting, "currently" line, and a photo in About.
4. Project links and results once repos or demos exist, and Harness results once measured.
5. Easter eggs (kingfisher dive, snake-boat race) and Malayalam words (reviewed by a speaker first).
6. A custom domain.

Shipped after the MVP: the fishing-net catch, Spice market skill lighting, unique art per landing, and the guided ride. Sound, WebGL water, and Sort the cargo were dropped: sound adds little for a recruiter, WebGL breaks the flat style and risks the Lighthouse target, and the demo did not make its link to the Freddie Mac work clear.

## 10. Risks

| Risk | Mitigation |
| --- | --- |
| Nine illustrated scenes take too long | One shared scene kit varied per landing. Unique art per landing is an add-on. |
| The ride feels gimmicky or gets in the way | Native scroll, docking zones, a clickable route map, and Dry Land one click away. |
| Poor performance on phones | Hard budgets, fewer layers on mobile, and Lighthouse CI on every push. |
| Kerala is shown inaccurately or as a stereotype | Have a Malayali friend or family member review the art, and avoid sacred imagery. |
| Employer confidentiality | Use only resume-level facts, invent all demo data, and check each employer's policy. |
| MVP scope creep | MVP capped at two to three days, with everything else as an optional add-on. |
| The Harness project has no results yet | Mark it in progress and add numbers only when they exist. |

## 11. Decisions already made

- Positioning lines as listed in section 1.
- Scenes are code-built SVG.
- Applying for both full-time roles and internships.
- Public email is 2023amathews@gmail.com. No GitHub or project links yet.
- Aiden's family is from Kerala; the About mentions it lightly.
- No Malayalam in the MVP.

## 12. Inputs still needed from Aiden

- About copy (80 to 120 words) and optionally a photo.
- The final resume PDF, saved as `public/Aiden_Mathews_resume.pdf`.
- Problem statements for the two project cards, which use the descriptions in section 3 until then.
- Confirmation of what can be public about Freddie Mac and Juume AI beyond the resume bullets.