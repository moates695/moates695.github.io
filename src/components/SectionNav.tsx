/**
 * On-page section navigation for long, multi-section pages, styled like the
 * homepage side rail: numbered nodes (01..0N) with glowing dots.
 *
 * `SectionNavLayout` wraps a page's content in a two-column row: the content on
 * the left (unchanged, so its left edge still lines up with the breadcrumb and
 * with pages that have no rail) and a sticky numbered rail on the right. The
 * rail is hidden below the `md` breakpoint, so mobile and small tablets are
 * untouched.
 *
 * Each entry in `sections` points at an element `id` on the page. A section
 * wrapper only needs an `id`; the scroll-spy and smooth-scroll are handled here.
 * Anchors are scrolled programmatically (not via `#` hrefs) so they never fight
 * the app's HashRouter.
 */
import { ReactNode, useEffect, useState } from "react";
import { Box, Tooltip } from "@mui/material";
import { SAND, SAND_MONO } from "./sand";

export interface Section {
  /** The `id` of the section wrapper element on the page. */
  id: string;
  /** Label shown in the node tooltip. */
  label: string;
}

// Where a clicked section lands: below the sticky app bar with breathing room.
const SCROLL_OFFSET = 96;

function SectionNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      // A section is "active" once its top passes a probe line 40% down the
      // viewport, so the highlight shifts as the section fills the screen
      // rather than only when its title reaches the very top.
      const mid = window.scrollY + window.innerHeight * 0.4;
      let cur = 0;
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= mid) cur = i;
      });
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // Snap to the last section once scrolled to the bottom (the final
      // section + footer can be shorter than the probe offset).
      if (max > 0 && window.scrollY >= max - 4) cur = sections.length - 1;
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const y = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <Box
      component="nav"
      aria-label="On this page"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "26px",
      }}
    >
      {sections.map((s, i) => {
        const on = i === active;
        const passed = i <= active;
        return (
          <Tooltip key={s.id} title={s.label} placement="left">
            <Box
              component="button"
              onClick={() => go(s.id)}
              aria-label={s.label}
              sx={{
                all: "unset",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <Box
                sx={{
                  width: on ? "9px" : "6px",
                  height: on ? "9px" : "6px",
                  borderRadius: "50%",
                  background: passed ? SAND.gold : "transparent",
                  border: `1px solid ${passed ? SAND.gold : SAND.faint}`,
                  boxShadow: on ? `0 0 10px ${SAND.gold}` : "none",
                  transition: "all .2s",
                }}
              />
              <Box
                sx={{
                  font: `500 9px ${SAND_MONO}`,
                  letterSpacing: ".1em",
                  color: on ? SAND.gold : SAND.faint,
                  transition: "color .2s",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </Box>
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
}

/**
 * Wrap a page's content to add a sticky right-hand numbered rail on `md`+
 * screens. Pass a module-level `sections` constant (a stable reference) so the
 * scroll-spy listener isn't re-registered on every render.
 */
export function SectionNavLayout({
  sections,
  children,
}: {
  sections: Section[];
  children: ReactNode;
}) {
  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "flex-start", gap: { md: 3, lg: 5 } }}>
      <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>{children}</Box>
      <Box
        component="aside"
        sx={{
          display: { xs: "none", md: "block" },
          position: "sticky",
          top: 120,
          flexShrink: 0,
          width: 48,
          alignSelf: "flex-start",
        }}
      >
        <SectionNav sections={sections} />
      </Box>
    </Box>
  );
}
