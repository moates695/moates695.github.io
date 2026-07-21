# Handoff: Marcus Oates Portfolio — "Tech Sand" Redesign

## Overview
A single-page personal portfolio for an AI & backend engineer. Warm near-black background,
gold primary accent, a cool blue/cyan secondary accent, and a full-bleed wireframe-dune hero
image. Sections top-to-bottom: sticky nav → hero → featured project → more projects grid →
tech stack → footer.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that show the
intended look and behavior. They are **not** production code to copy directly. They use an
in-house "Design Component" runtime (`*.dc.html` + a `support.js` you do NOT have here), so
they will not run standalone outside that tool.

Your task: **recreate these designs in the target codebase's existing environment** (React,
Next, Vue, Svelte, SwiftUI, etc.) using its established patterns, component library, and
styling approach. If no project exists yet, pick the most appropriate framework — a React +
Tailwind (or CSS Modules) single-page app is a natural fit. Treat the `.dc.html` markup as a
spec for structure, copy, and exact styling values; re-express it as idiomatic components.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions are specified
below. Recreate the UI pixel-accurately using your codebase's libraries and patterns. The one
piece intentionally left as a placeholder is the phone "PRODUCT SHOT" mock in the featured
card — swap in a real screenshot.

## Layout & Sizing
- Page is centered, `max-width: 1440px`, dark background `#0b0908`.
- Global box-sizing: `border-box`. Body font: IBM Plex Sans.
- Horizontal section padding: `48px` left/right throughout.
- Everything is one vertical flow; no client-side routing (nav links are in-page anchors).

## Screens / Views

### 1. Nav (sticky)
- **Layout**: `position: sticky; top: 0; z-index: 40`. Flex row, space-between, padding
  `20px 48px`. Background `rgba(11,9,8,.72)` with `backdrop-filter: blur(10px)`; bottom border
  `1px solid rgba(255,255,255,.05)`.
- **Left**: monogram `MO` — Space Grotesk 500, 20px, `letter-spacing: .3em`, color `#ece5d9`.
- **Right**: link row, `gap: 28px`, IBM Plex Sans 400 14px. Links: Home (active `#ece5d9`),
  Projects, About, Writing, Tech (inactive `#97907f`). Then a **Contact** button:
  inline-flex, gap 8px, `border: 1px solid rgba(216,170,120,.32)`, radius 8px, padding
  `9px 15px`, text `#ece5d9`, trailing arrow `→` in `#d8aa78`.

### 2. Hero
- **Layout**: `min-height: 88vh`, flex, vertically centered, `overflow: hidden`.
- **Background**: the image `assets/tech-sand-hero.png`, `background-size: cover`,
  `background-position: 60% center`.
- **Scrim overlays** (for text legibility over the image), two absolutely-positioned layers:
  - `linear-gradient(100deg, #0b0908 22%, rgba(11,9,8,.55) 52%, rgba(11,9,8,.12) 78%, rgba(11,9,8,.35) 100%)`
  - bottom fade: 180px tall, `linear-gradient(transparent, #0b0908)`.
- **Left rail** (decorative): absolute, left, full height, width `52px`, right border
  `1px solid rgba(255,255,255,.05)`. Top: `01` in JetBrains Mono 12px `#d8aa78`. Middle: 5 tick
  marks (1px tall, alternating 10px / 6px wide, `#fff` at 35% opacity). Bottom: vertical text
  `SCROLL ↓` (JetBrains Mono 9px, `letter-spacing: .2em`, `#8f8776`,
  `writing-mode: vertical-rl; transform: rotate(180deg)`).
- **Content block**: `padding: 0 48px 0 108px; max-width: 620px`.
  - **Eyebrow**: JetBrains Mono 500 12.5px, `letter-spacing: .16em`, uppercase, `#d8aa78`.
    Reads `// the ` (at 50% opacity) + an **animated typewriter word** + a blinking caret.
    See Interactions.
  - **H1**: Space Grotesk 600, `76px`, `line-height: .98`, `letter-spacing: -.03em`.
    Two lines: `Marcus` in `#ece5d9`, `Oates.` in `#d8aa78`.
  - **Subhead**: IBM Plex Sans 400 16.5px, `line-height: 1.65`, color `#b3ab9c`,
    `max-width: 440px`. Copy: "AI & backend engineer. I turn messy, manual work into automated
    systems — the models, the services behind them, and the web & mobile apps that make them a
    joy to use."
  - **CTAs** (flex, gap 22px, margin-top 38px):
    - Primary: text `#0b0908` on `#d8aa78`, radius 9px, padding `13px 24px`, "View all
      projects →".
    - Secondary: text `#ece5d9`, "About me ◉" (the ◉ in `#d8aa78`).

### 3. Featured Project (id="projects")
- **Section header row**: `// FEATURED PROJECT` (JetBrains Mono 500 12px, `letter-spacing:
  .18em`, `#8f8776`) on the left, `VIEW ALL →` (`#d8aa78`) on the right.
- **Panel**: `border: 1px solid rgba(216,170,120,.14)`, radius 16px,
  `background: linear-gradient(160deg, #131009, #0d0b07)`, padding 40px, flex row, gap 48px,
  vertically centered.
- **Left column** (flex 1, column, gap 16px):
  - **Status line**: `FEATURED PROJECT` label (JetBrains Mono 500 10.5px, `letter-spacing:
    .2em`, `#8fd0d4`) followed by a **PROD pill** (see Status Pills) in green.
  - **Title**: `Gym Junkie` — Space Grotesk 600 44px, `#ece5d9`, `letter-spacing: -.02em`.
  - **Blurb**: IBM Plex Sans 400 15px/1.6, `#97907f`, `max-width: 470px`. Copy: "A fitness app
    built the backend-engineer way: fast set logging over a FastAPI + Postgres core, analytics,
    progressive-overload graphs, and an ML layer doing the quiet heavy lifting. React Native up
    front, no subscription in sight."
  - **Tag row**: colored tech tags (see Tech Tag Colors): FastAPI, React Native, PostgreSQL,
    Python, AWS.
  - **Link**: `View case study →`, `#ecc79a`.
- **Right column**: phone placeholder — `width: 220px; height: 320px`, radius 26px, border
  `1px solid rgba(216,170,120,.25)`, diagonal hatch background
  `repeating-linear-gradient(135deg, rgba(216,170,120,.055) 0 8px, transparent 8px 16px)`, a
  small notch bar on top, centered mono label `PRODUCT SHOT`. **Replace with a real screenshot.**

### 4. More Projects
- **Header**: `// MORE PROJECTS`.
- **Grid**: flex, `flex-wrap: wrap`, gap 20px. Five project cards (see Project Card component).
  Cards, in order:
  1. **Woodchuck** — status TEST — "On-device scorer for the lawn game Finska. No sign-in, no
     backend, gloriously no tracking." — tags: React Native, Expo, TypeScript
  2. **Poppycock** — status POC — "Real-time companion app for the Balderdash card game —
     someone had to keep the liars honest." — tags: FastAPI, WebSocket, PostgreSQL
  3. **Cellular Tracking** — status PROD — "Computer-vision pipeline that segments and tracks
     dividing cells so researchers don't have to squint." — tags: Python, OpenCV, YOLOv8
  4. **Downer Helper** — status PROD — "A tidy Python package that wraps the Azure SDK and cuts
     the copy-paste out of every project." — tags: Python, Azure, PyPI
  5. **Postgres Deploy** — status PROD — "Deploys and updates Postgres schemas straight from
     config files, so nobody hand-runs migrations." — tags: Python, PostgreSQL, CLI

### 5. Tech Stack (id="tech")
- **Header**: `// TECH STACK`.
- **Chips**: flex, wrap, gap 12px. Each chip: JetBrains Mono 500 13px, radius 9px,
  padding `11px 16px`, `background: #100d08`, `white-space: nowrap`, `color` = its hue, and
  `border: 1px solid <hue>3d` (hue at 24% alpha). Chips + hues:
  Python `#d8aa78`, TypeScript `#7aa2e3`, FastAPI `#63c7b0`, PostgreSQL `#8fa0e8`,
  Redis `#e0897a`, Docker `#79b8e0`, AWS `#e0a86a`, PyTorch `#e0846a`, OpenAI API `#77c7cc`,
  LangChain `#8bcf8f`.

### 6. Footer (id="contact")
- `margin-top: 64px`, top border `1px solid rgba(255,255,255,.06)`, padding `48px 48px 40px`.
- **Top row**: flex, wrap, space-between, gap 48px. Three columns, each with a JetBrains Mono
  500 11px `letter-spacing: .2em` `#8f8776` label:
  - **PHILOSOPHY** — body IBM Plex Sans 14px/1.6 `#97907f`, `max-width: 300px`: "Build systems
    that are reliable, observable and easy to evolve. Solve real problems with clean
    abstractions — and the occasional bad pun."
  - **BASED IN** — Space Grotesk 500 15px `#ece5d9`: "Australia".
  - **LET'S BUILD SOMETHING** — body then link `Get in touch →` (`#ecc79a`,
    `mailto:hello@marcusoates.dev`).
- **Bottom row**: `margin-top: 44px`, top border, space-between. Left: social pill links
  (GitHub, LinkedIn, PyPI, Discord) — JetBrains Mono 500 11px, `#97907f`, border
  `1px solid rgba(255,255,255,.1)`, radius 7px, padding `8px 12px`. Right: `© 2026 MARCUS
  OATES` in JetBrains Mono 500 10px `letter-spacing: .16em` `#5f584d`.

## Reusable Components

### Project Card (from SandCard.dc.html)
- **Container**: `width: 340px`, `background: #100d08`, `border: 1px solid rgba(216,170,120,.14)`,
  radius 11px, padding `22px 22px 20px`, flex column, gap 12px.
- **Header row**: flex, space-between, align-items flex-start, gap 12px.
  - **Title**: Space Grotesk 600 19px, `#ece5d9`, `letter-spacing: -.01em`.
  - **Status pill**: see Status Pills.
- **Blurb**: IBM Plex Sans 400 13.5px/1.55, `#8f8776`.
- **Tags**: flex, wrap, gap 7px. Each tag: JetBrains Mono 500 11px, radius 6px, padding
  `6px 9px`, `white-space: nowrap`, `color` = tech hue, `border: 1px solid <hue>3d`.

### Status Pills
Inline-flex, gap 6px, JetBrains Mono 500 9.5px, `letter-spacing: .14em`, radius 20px, padding
`5px 9px 4px`. Leading 5px dot (radius 50%) with `box-shadow: 0 0 6px <color>`. Text + dot +
border all share the status color:
- **PROD**: `#6fcf97` (green), border `rgba(111,207,151,.32)`
- **TEST**: `#e0b24d` (amber), border `rgba(224,178,77,.32)`
- **POC**: `#b18cf0` (purple), border `rgba(177,140,240,.32)`
- **Fallback (unknown status)**: `#8fd0d4` / dot `#77c7cc`, border `rgba(119,199,204,.28)`

### Tech Tag Colors (used by both cards and the featured panel)
Map tag name → hue; fall back to `#c7b191` if unmapped. Border = `<hue>3d` (24% alpha).
```
Python #d8aa78   TypeScript #7aa2e3   React TS #7aa2e3   React Native #63b8e0   Expo #9aa6b8
FastAPI #63c7b0  PostgreSQL #8fa0e8   Postgres #8fa0e8   WebSocket #b18cf0       Redis #e0897a
Docker #79b8e0   AWS #e0a86a          PyTorch #e0846a    OpenCV #6fcf97          YOLOv8 #8bcf8f
Azure #79b8e0    PyPI #d8aa78         CLI #9aa6b8         Package #d8aa78         Full Stack #d8aa78
Client Side #9aa6b8
```

## Interactions & Behavior
- **Typewriter eyebrow**: cycles a list of role words in the hero eyebrow. Type forward at
  ~85ms/char; when a word completes, pause 1500ms, then delete at ~45ms/char; when empty, pause
  380ms and advance to the next word (wrapping). Default word list:
  `AI specialist, solutions architect, ML wizard, automation engineer, backend nerd`
  (make this a prop/config). A caret block blinks via a 1s step keyframe (visible 0–49%, hidden
  50–100%): `width: 8px; height: 1em; background: #d8aa78`.
- **Nav links**: in-page anchor scroll to `#projects`, `#tech`, `#contact`.
- **Hover states**: links lighten from `#ecc79a` to `#f4d9b4` (define default `a`/`a:hover`).
  Add subtle hover affordances per your design system (e.g. card border brighten, button
  darken) — not specified in the mock.
- **Responsive**: mock is desktop-first at ~1440px. For narrower widths, stack the featured
  panel columns, wrap the project grid to fewer columns, and reduce the H1 size; exact
  breakpoints are your call.

## Design Tokens
**Colors**
- Background: `#0b0908`; panel/card surface: `#100d08`; featured gradient `#131009 → #0d0b07`.
- Text: primary `#ece5d9`, body `#97907f`, hero body `#b3ab9c`, faint `#8f8776`, faintest `#5f584d`.
- Gold accent: base `#d8aa78`, lighter `#ecc79a`, hover `#f4d9b4`, tag gold `#c7b191`.
- Cool accent (blue/cyan): `#8fd0d4` / `#77c7cc`.
- Status: green `#6fcf97`, amber `#e0b24d`, purple `#b18cf0`.
- Hairlines: `rgba(255,255,255,.05)`; gold borders `rgba(216,170,120,.14–.32)`.

**Typography** (Google Fonts)
- Display/headings: **Space Grotesk** (500/600).
- Body: **IBM Plex Sans** (400/500).
- Mono / labels / tags: **JetBrains Mono** (500).

**Spacing**: section padding 48px; common gaps 8–48px. **Radius**: cards 11px, panel 16px,
buttons/chips 6–9px, pills 20px, phone mock 26px.

## Assets
- `assets/tech-sand-hero.png` — the hero background (AI-generated wireframe-dune image the
  client supplied). Ship it as an optimized asset; it is the only bitmap in the design.
- No icon set is used (social links are text pills). If you want brand icons, add them from
  your own icon library.

## Files in this bundle
- `Portfolio Tech Sand.dc.html` — full-page design reference (nav, hero, all sections).
- `SandCard.dc.html` — the project-card component reference (status pill + colored tags logic).
- `assets/tech-sand-hero.png` — hero background image.

Both `.dc.html` files are HTML-with-a-custom-runtime references; read them for exact markup,
copy, and inline style values, but implement the UI natively in your stack.
