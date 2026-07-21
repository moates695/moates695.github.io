/**
 * "Tech Sand" design kit — scoped to the redesigned home page.
 *
 * These primitives encode the warm near-black / gold / cool-cyan look from the
 * Tech Sand handoff (see design_handoff_portfolio_tech_sand). They are kept
 * separate from the site-wide MUI theme and the teal/amber `design.tsx` kit so
 * the rest of the site is untouched; only the landing page opts in.
 */
import { ReactNode, useEffect, useRef, useState } from "react";
import { Box, SxProps, Theme, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Fonts + colour tokens                                               */
/* ------------------------------------------------------------------ */

export const SPACE = "'Space Grotesk', system-ui, sans-serif";
export const PLEX = "'IBM Plex Sans', system-ui, sans-serif";
export const SAND_MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

export const SAND = {
  bg: "#0b0908",
  surface: "#100d08",
  featuredFrom: "#131009",
  featuredTo: "#0d0b07",
  // text
  primary: "#ece5d9",
  body: "#97907f",
  heroBody: "#b3ab9c",
  faint: "#8f8776",
  faintest: "#5f584d",
  // gold accent
  gold: "#d8aa78",
  goldLight: "#ecc79a",
  goldHover: "#f4d9b4",
  tagGold: "#c7b191",
  // cool accent
  cool: "#8fd0d4",
  coolDot: "#77c7cc",
  // hairlines
  hairline: "rgba(255,255,255,.05)",
  hairlineSoft: "rgba(255,255,255,.06)",
  goldBorder: "rgba(216,170,120,.14)",
} as const;

/** Default hero typewriter roles (comma list, mirrors the handoff default). */
export const DEFAULT_ROLES = [
  "AI specialist",
  "solutions architect",
  "ML wizard",
  "automation engineer",
  "backend nerd",
];

/* ------------------------------------------------------------------ */
/* Tech tag colours                                                    */
/* ------------------------------------------------------------------ */

/** Tag name → hue. Border is the hue at 24% alpha (`hue + '3d'`). */
const TAG_HUES: Record<string, string> = {
  Python: "#d8aa78",
  TypeScript: "#7aa2e3",
  "React TS": "#7aa2e3",
  "React Native": "#63b8e0",
  Expo: "#9aa6b8",
  FastAPI: "#63c7b0",
  PostgreSQL: "#8fa0e8",
  Postgres: "#8fa0e8",
  WebSocket: "#b18cf0",
  Redis: "#e0897a",
  Docker: "#79b8e0",
  AWS: "#e0a86a",
  PyTorch: "#e0846a",
  OpenCV: "#6fcf97",
  YOLOv8: "#8bcf8f",
  Azure: "#79b8e0",
  PyPI: "#d8aa78",
  CLI: "#9aa6b8",
  Package: "#d8aa78",
  "Full Stack": "#d8aa78",
  "Client Side": "#9aa6b8",
};

/** Resolve a tag hue, falling back to the neutral gold for unmapped names. */
export const tagHue = (name: string): string => TAG_HUES[name] ?? "#c7b191";

/* ------------------------------------------------------------------ */
/* Status pills                                                        */
/* ------------------------------------------------------------------ */

export type SandStatus = "PROD" | "TEST" | "POC" | string;

interface PillMeta {
  color: string;
  dot: string;
  border: string;
}

const PILLS: Record<string, PillMeta> = {
  PROD: { color: "#6fcf97", dot: "#6fcf97", border: "rgba(111,207,151,.32)" },
  TEST: { color: "#e0b24d", dot: "#e0b24d", border: "rgba(224,178,77,.32)" },
  POC: { color: "#b18cf0", dot: "#b18cf0", border: "rgba(177,140,240,.32)" },
};

const FALLBACK_PILL: PillMeta = {
  color: "#8fd0d4",
  dot: "#77c7cc",
  border: "rgba(119,199,204,.28)",
};

/** Monospace status pill (PROD / TEST / POC) with a glowing status dot. */
export function StatusPill({ status }: { status: SandStatus }) {
  const key = String(status).toUpperCase();
  const meta = PILLS[key] ?? FALLBACK_PILL;
  return (
    <Box
      component="span"
      sx={{
        flex: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        font: `500 9.5px/1 ${SAND_MONO}`,
        letterSpacing: ".14em",
        color: meta.color,
        border: `1px solid ${meta.border}`,
        borderRadius: "20px",
        padding: "5px 9px 4px",
        whiteSpace: "nowrap",
      }}
    >
      <Box
        component="span"
        sx={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: meta.dot,
          boxShadow: `0 0 6px ${meta.dot}`,
        }}
      />
      {key}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Tech tag                                                            */
/* ------------------------------------------------------------------ */

/** Coloured, mono tech tag. `size` matches the card (small) vs featured tags. */
export function TechTag({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const hue = tagHue(name);
  return (
    <Box
      component="span"
      sx={{
        font: `500 ${size === "md" ? 11 : 11}px/1 ${SAND_MONO}`,
        letterSpacing: ".02em",
        color: hue,
        border: `1px solid ${hue}3d`,
        borderRadius: "6px",
        padding: "6px 9px",
        whiteSpace: "nowrap",
      }}
    >
      {name}
    </Box>
  );
}

/** Larger pill-style chip used in the Tech Stack section. */
export function TechChip({ name }: { name: string }) {
  const hue = tagHue(name);
  return (
    <Box
      component="span"
      sx={{
        font: `500 13px/1 ${SAND_MONO}`,
        color: hue,
        border: `1px solid ${hue}3d`,
        borderRadius: "9px",
        padding: "11px 16px",
        background: SAND.surface,
        whiteSpace: "nowrap",
      }}
    >
      {name}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Project card                                                        */
/* ------------------------------------------------------------------ */

export interface SandProject {
  title: string;
  status: SandStatus;
  blurb: string;
  tags: string[];
  /** Path to the project icon/logo (falls back to initials if it fails). */
  icon?: string;
  /** Fallback shown when the icon image is missing. */
  initials?: string;
  /** Internal route the whole card links to. */
  link?: string;
}

/**
 * Square project icon on the sand surface. Renders the logo image, falling
 * back to monospace initials if the asset is missing or fails to load.
 */
export function ProjectIcon({
  icon,
  initials,
  size = 40,
}: {
  icon?: string;
  initials?: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(icon) && !failed;
  return (
    <Box
      sx={{
        flex: "none",
        width: size,
        height: size,
        borderRadius: "10px",
        border: `1px solid ${SAND.goldBorder}`,
        background: SAND.surface,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {showImg ? (
        <Box
          component="img"
          src={icon}
          alt=""
          aria-hidden
          loading="lazy"
          onError={() => setFailed(true)}
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <Box component="span" sx={{ font: `600 13px ${SAND_MONO}`, color: SAND.gold }}>
          {initials}
        </Box>
      )}
    </Box>
  );
}

/** Project card (from SandCard.dc.html). The whole card links to its route. */
export function SandCard({ project }: { project: SandProject }) {
  const navigate = useNavigate();
  const clickable = Boolean(project.link);
  return (
    <Box
      onClick={clickable ? () => navigate(project.link!) : undefined}
      role={clickable ? "link" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(project.link!);
              }
            }
          : undefined
      }
      sx={{
        width: { xs: "100%", sm: 340 },
        maxWidth: "100%",
        background: SAND.surface,
        border: `1px solid ${SAND.goldBorder}`,
        borderRadius: "11px",
        padding: "22px 22px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        cursor: clickable ? "pointer" : "default",
        transition: "border-color .2s ease, transform .2s ease",
        outline: "none",
        "&:hover, &:focus-visible": clickable
          ? { borderColor: "rgba(216,170,120,.5)", transform: "translateY(-3px)" }
          : undefined,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
          <ProjectIcon icon={project.icon} initials={project.initials} size={38} />
          <Typography
            component="h3"
            sx={{
              margin: 0,
              font: `600 19px/1.15 ${SPACE}`,
              color: SAND.primary,
              letterSpacing: "-.01em",
            }}
          >
            {project.title}
          </Typography>
        </Box>
        <StatusPill status={project.status} />
      </Box>
      <Typography
        component="p"
        sx={{ margin: 0, font: `400 13.5px/1.55 ${PLEX}`, color: SAND.faint }}
      >
        {project.blurb}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "7px", mt: "4px" }}>
        {project.tags.map((t) => (
          <TechTag key={t} name={t} />
        ))}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Section header ( // LABEL  +  optional trailing link )              */
/* ------------------------------------------------------------------ */

export function SandLabel({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Box
      component="span"
      sx={{
        font: `500 12px ${SAND_MONO}`,
        letterSpacing: ".18em",
        color: SAND.faint,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Typewriter                                                          */
/* ------------------------------------------------------------------ */

interface TyperState {
  text: string;
}

/**
 * Cycling typewriter word used in the hero eyebrow. Types forward at ~85ms/char,
 * holds a completed word 1500ms, deletes at ~45ms/char, pauses 380ms between
 * words. Honours `prefers-reduced-motion` by holding the first word still.
 */
export function Typewriter({ words = DEFAULT_ROLES }: { words?: string[] }) {
  const [state, setState] = useState<TyperState>({ text: "" });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || words.length === 0) {
      setState({ text: words[0] ?? "" });
      return;
    }

    let ri = 0;
    let ci = 0;
    let deleting = false;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const word = words[ri];
      ci += deleting ? -1 : 1;
      setState({ text: word.slice(0, ci) });
      let delay = deleting ? 45 : 85;
      if (!deleting && ci === word.length) {
        delay = 1500;
        deleting = true;
      } else if (deleting && ci === 0) {
        deleting = false;
        ri = (ri + 1) % words.length;
        delay = 380;
      }
      timer.current = setTimeout(tick, delay);
    };
    tick();

    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [words]);

  return (
    <>
      <Box component="span">{state.text}</Box>
      <Box
        component="span"
        aria-hidden
        sx={{
          display: "inline-block",
          width: "8px",
          height: "1em",
          background: SAND.gold,
          marginLeft: "2px",
          verticalAlign: "-2px",
          animation: "sandcaret 1s steps(1) infinite",
        }}
      />
    </>
  );
}
