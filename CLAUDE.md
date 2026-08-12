# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website deployed to GitHub Pages at https://moates.com.au. Built with React 19 + TypeScript, using Material-UI (MUI) for styling and HashRouter for GitHub Pages compatibility.

## Commands

- `npm start` — Start dev server
- `npm run build` — Production build (outputs to `/build`)
- `npm test` — Run Jest tests (React Testing Library)
- `npm run deploy` — Deploy to GitHub Pages via gh-pages

## Architecture

**Routing**: HashRouter in `src/App.tsx` defines all routes. Each project (Finska, Gym Junkie, etc.) has its own directory under `src/pages/` with subpages for design, changes, and privacy policy.

**Theming**: Light/dark themes defined in `src/styles/theme.ts`, applied via MUI's `ThemeProvider`.

**Shared constants**: External links centralised in `src/middleware/links.ts`. Technology badge colours/icons mapped in `src/middleware/chipMap.tsx`. UI helper functions in `src/middleware/helpers.tsx`.

**Components**: `AppToolbar` handles navigation with dropdown menus. `EmblaCarousel` powers the project showcase on the home page. `Changes` renders changelog entries for each project. `PageLinks` provides breadcrumb navigation.

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) triggers on push to `main`: installs deps, builds, and deploys to GitHub Pages using Node 20.

## Conventions

- Never use em-dashes (—) in site text/copy. Use commas, colons, "to" for ranges, or hyphens instead. This applies to all user-facing strings; it does not restrict code comments.
- Do not use accented characters like "é" in site text; use the plain letter (e.g. "resume", not "résumé").
- HashRouter is required for GitHub Pages SPA routing — do not switch to BrowserRouter
- Homepage field in `package.json` must stay as `https://moates.com.au`
- Static assets (icons, screenshots, APKs) go in `public/`; source assets (images used in components) go in `src/assets/`
- Analytics: add a `data-track="<area>:<id>"` attribute to new interactive elements worth measuring (nav items, CTAs, cards). Links to other hosts are recorded automatically and need no attribute. Never `await` or branch on anything in `src/middleware/analytics.ts` — it must stay fire-and-forget.
- New site changes must work in both desktop and mobile modes. Use MUI responsive props (`{ xs: ..., sm: ... }`) or `useMediaQuery(theme.breakpoints.down('sm'))` rather than hardcoded pixel values. Verify the mobile breakpoint (≤599px) has no horizontal scroll, readable typography, and tappable controls before considering a change complete.
