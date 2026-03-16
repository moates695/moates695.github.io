# Plan: Make Portfolio Website Mobile-Friendly

## Context
The portfolio site at moates.com.au has foundational responsive support (viewport meta tag, MUI, hamburger nav drawer) but many pages have hardcoded pixel values, fixed layouts, and no responsive typography. The goal is to make every page work well from 320px (iPhone SE) up to desktop, without changing the desktop experience.

Branch: `feature/mobile-responsive`

---

## Phase 1: Responsive Typography (Foundation)
**File:** `src/styles/theme.ts`

Add responsive font sizes to `sharedTypography` using media query keys. Since `sharedTypography` is defined before `createTheme`, use raw media query strings:

```ts
const SM_DOWN = '@media (max-width:599.95px)';
```

Scale down h1–h6 and subtitle1 on mobile (e.g. h4: 1.75rem → 1.35rem, h5: 1.5rem → 1.2rem, h6: 1.25rem → 1.1rem). This automatically applies to every page's Typography components.

---

## Phase 2: Fix App Layout Container
**File:** `src/App.tsx`

1. **Remove dead `isMobile` code** — the state (line 27), useEffect resize handler (lines 29-33), and console.log (line 35) are unused by any child component and use inconsistent thresholds (800px vs 768px vs MUI's 600px)
2. **Remove unused imports** — `useEffect`, `useState`, `logo`
3. **Make padding responsive** — change fixed `paddingLeft/Right: '20px'` to `{ xs: '12px', sm: '20px' }`

---

## Phase 3: Home Page Carousel Cards
**File:** `src/pages/Home.tsx`

1. **Fix `isMobile` ordering bug** — `isMobile` is declared on line 203 but `useMemo` on line 102 references `hovered`/`handleHover` but not `isMobile`. Move `isMobile` above the `useMemo` and add it to the dependency array
2. **Make carousel cards stack on mobile** — change card `flexDirection` to `column` on mobile, set `height: 'auto'` instead of fixed `200`
3. **Hide highlight images on mobile** — they compress to ~35% of a tiny card; hiding frees all space for text and chips
4. **Replace hardcoded `rgba(255,255,255,...)` colours** with theme-aware `text.secondary` / `text.disabled` / `divider` tokens (lines 168, 227, 251, 261) — not strictly mobile but fixes light mode which may be re-enabled
5. **Reduce changelog maxHeight on mobile** — pass smaller value to `buildAllChange`

---

## Phase 4: Embla Carousel CSS
**File:** `src/css/embla.css`

In the existing `@media (max-width: 600px)` block:
- Add `--slide-height: auto` so mobile cards aren't constrained by the fixed 19rem
- Reduce button size slightly (1.6rem)

---

## Phase 5: Project Pages — Screenshots & Button Groups
**Files:**
- `src/pages/gym_junkie/Overview.tsx` — add `flexWrap: 'wrap'` to button group (line 85-91), responsive gap
- `src/pages/gym_junkie/Functionality.tsx` — responsive gap: `{ xs: 2, sm: 4 }` on screenshot containers
- `src/pages/finska/Overview.tsx` — responsive gap on screenshot containers
- `src/pages/other/CellularTracking.tsx` — responsive video width: `{ xs: '90%', sm: '50%' }`

For all screenshot images, adjust sizing: `width: { xs: 160, sm: 200 }` so two fit side-by-side on small screens with the responsive gap.

---

## Phase 6: Contact Page
**File:** `src/pages/Contact.tsx`

1. **Add `flexWrap: 'wrap'` to `contactButtons`** (line 21-30) — 6 icons at 48px + 10px gap = 348px overflows a 320px screen
2. **Reduce Paper flex-basis** from `280px` to `250px` — ensures a single card fits on 320px (296px usable after 12px padding)

---

## Phase 7: BottomNavigation — Mobile Safety
**File:** `src/components/BottomNavigation.tsx`

Add `flexWrap: 'wrap'` and `gap: 1` to the container Box so long button labels don't overflow on narrow screens. Optionally reduce font size on mobile.

---

## Phase 8: Code Block Overflow
**File:** `src/pages/other/PostgresDeploy.tsx`

Change SyntaxHighlighter `overflow: 'visible'` to `overflowX: 'auto'` so long code lines scroll horizontally instead of breaking the page layout on mobile.

---

## Files to Modify (ordered)
1. `src/styles/theme.ts` — responsive typography
2. `src/App.tsx` — remove dead code, responsive padding
3. `src/pages/Home.tsx` — carousel cards, isMobile fix, theme colours
4. `src/css/embla.css` — mobile slide height
5. `src/pages/gym_junkie/Overview.tsx` — flexWrap on buttons, responsive gap
6. `src/pages/gym_junkie/Functionality.tsx` — responsive gaps
7. `src/pages/finska/Overview.tsx` — responsive gaps
8. `src/pages/Contact.tsx` — flexWrap on icons, reduced flex-basis
9. `src/components/BottomNavigation.tsx` — wrap safety
10. `src/pages/other/CellularTracking.tsx` — video width
11. `src/pages/other/PostgresDeploy.tsx` — code block overflow

---

## Verification
1. Run `npm start` and test in Chrome DevTools responsive mode at:
   - **320px** (iPhone SE) — smallest target
   - **375px** (iPhone 12/13/14) — most common
   - **430px** (iPhone 14 Pro Max)
   - **599px / 601px** — MUI `sm` breakpoint boundary
   - **768px** — tablet
   - **1200px+** — desktop regression check
2. Confirm no horizontal scrollbar at any width
3. Verify carousel cards are readable and usable on mobile
4. Verify screenshot grids wrap to 2-per-row on small screens
5. Verify button groups don't overflow
6. Verify desktop experience is unchanged
