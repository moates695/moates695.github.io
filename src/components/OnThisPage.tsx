/**
 * Sticky bar of links to each section of a hub page, shown at every width.
 *
 * Same scroll-spy and smooth scroll as `SectionNav`'s right-hand rail, but a
 * wrapping row of named pills: the rail's numbered nodes only name a section on
 * hover, and on a hub page (Small Projects, Kaggle) the section names are the
 * point, so the two are kept side by side.
 */
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Section } from "./SectionNav";
import { MONO } from "../styles/tokens";
import { DEFAULT_ACCENT } from "./design";

// Where a clicked link lands: below the sticky app bar plus this sticky bar.
const SCROLL_OFFSET = 128;

export default function OnThisPage({
  items,
  accent = DEFAULT_ACCENT,
}: {
  items: Section[];
  accent?: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight * 0.4;
      let cur = 0;
      items.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= mid) cur = i;
      });
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

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
        position: "sticky",
        top: { xs: 56, sm: 64 },
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: { xs: 1, sm: 1.25 },
        py: 1.25,
        // Let the content scroll under the bar without bleeding through.
        bgcolor: "rgba(11,9,8,0.72)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        component="span"
        sx={{
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "text.disabled",
          mr: 0.5,
        }}
      >
        On this page
      </Box>
      {items.map((s, i) => {
        const on = i === active;
        return (
          <Box
            key={s.id}
            component="button"
            onClick={() => go(s.id)}
            sx={{
              all: "unset",
              cursor: "pointer",
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: "0.02em",
              lineHeight: 1,
              px: 1.25,
              py: 0.75,
              borderRadius: 999,
              border: "1px solid",
              borderColor: on ? `${accent}80` : "divider",
              color: on ? accent : "text.secondary",
              bgcolor: on ? `${accent}14` : "transparent",
              transition: "color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease",
              "&:hover": { color: accent, borderColor: `${accent}80` },
              "&:focus-visible": { outline: `1px solid ${accent}` },
            }}
          >
            {s.label}
          </Box>
        );
      })}
    </Box>
  );
}
