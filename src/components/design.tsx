/**
 * Shared design-language kit for the restyled portfolio.
 *
 * These primitives encode the homepage look (mono eyebrows, teal→amber accent,
 * gradient headings, `.reveal` entrance, accent-glow hover cards) so every page
 * reads as one product. Prefer composing these over hand-rolling styles.
 */
import { ReactNode, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  BoxProps,
  Button,
  Card,
  CardActionArea,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { MONO, ACCENT_GRADIENT } from "../styles/tokens";
import PageLinks, { lastCrumbLabel } from "./PageLinks";

/** Signature accent used when a page/section doesn't specify its own. */
export const DEFAULT_ACCENT = "#4dd0e1";

/* ------------------------------------------------------------------ */
/* Entrance animation                                                  */
/* ------------------------------------------------------------------ */

interface RevealProps extends BoxProps {
  /** Stagger, in seconds. Use 0, 0.06, 0.12, ... down the page. */
  delay?: number;
}

/** Wraps children in the GPU-friendly `.reveal` entrance, with an optional stagger. */
export function Reveal({ delay = 0, sx, children, ...rest }: RevealProps) {
  return (
    <Box className="reveal" sx={{ animationDelay: `${delay}s`, ...sx }} {...rest}>
      {children}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Typographic atoms                                                   */
/* ------------------------------------------------------------------ */

/** Monospace uppercase label, e.g. <Eyebrow>{'// overview'}</Eyebrow>. */
export function Eyebrow({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Typography
      component="span"
      sx={{
        fontFamily: MONO,
        fontSize: 12,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "text.disabled",
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}

/**
 * Bright RGB/pink wave used for the accent word's flowing outline. First and
 * last stops match so the colour loops seamlessly as it travels.
 */
const FLOW_COLORS = ["#ff3db4", "#c04bff", "#4d7bff", "#22d3ee", "#ff3db4"];

/** Pull hex colours out of a legacy `linear-gradient(...)` prop, if given. */
function stopsFrom(gradient?: string): string[] {
  const found = gradient?.match(/#[0-9a-fA-F]{3,8}\b/g);
  if (found && found.length >= 2) return [...found, found[0]]; // close the loop
  return FLOW_COLORS;
}

type Box = { x: number; y: number; w: number; h: number };

/**
 * The accent word in a heading. Instead of filling the word with a static
 * gradient, it renders the glyphs as an outline whose colour flows along the
 * edges (a looping pink→violet→blue→cyan wave). The SVG measures the inherited
 * text metrics so it sizes and sits on the baseline like normal inline text.
 * Honours `prefers-reduced-motion` by holding the wave still.
 *
 * `gradient` (a `linear-gradient(...)` string) is still accepted for callers
 * that want a bespoke palette; its hex stops drive the flow.
 */
export function GradientText({
  children,
  gradient,
}: {
  children: ReactNode;
  gradient?: string;
}) {
  const rawId = useId();
  const id = `gt-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const stops = stopsFrom(gradient);
  const textRef = useRef<SVGTextElement>(null);
  const [box, setBox] = useState<Box | null>(null);
  const [reduce, setReduce] = useState(false);

  useLayoutEffect(() => {
    if (typeof children !== "string") return;
    const measure = () => {
      const el = textRef.current;
      if (!el) return;
      try {
        const bb = el.getBBox();
        if (bb.width) setBox({ x: bb.x, y: bb.y, w: bb.width, h: bb.height });
      } catch {
        /* not laid out yet */
      }
    };
    measure();
    let cancelled = false;
    const fonts = (document as unknown as { fonts?: { ready?: Promise<unknown> } }).fonts;
    fonts?.ready?.then(() => !cancelled && measure());
    window.addEventListener("resize", measure);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", measure);
    };
  }, [children]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  // Non-string content can't be measured as SVG text; keep the filled gradient.
  if (typeof children !== "string") {
    return (
      <Box
        component="span"
        sx={{
          background: gradient ?? ACCENT_GRADIENT,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {children}
      </Box>
    );
  }

  const stroke = box ? Math.max(0.75, box.h * 0.02) : 1;
  const pad = stroke * 2;
  const period = 160; // wavelength of the travelling colour, in px

  return (
    <svg
      role="img"
      aria-label={children}
      viewBox={
        box ? `${box.x - pad} ${box.y - pad} ${box.w + pad * 2} ${box.h + pad * 2}` : "0 0 0 0"
      }
      style={{
        overflow: "visible",
        display: "inline-block",
        width: box ? box.w + pad * 2 : 0,
        height: box ? box.h + pad * 2 : "1em",
        verticalAlign: box ? `${-(box.h + pad + box.y)}px` : "baseline",
      }}
    >
      <defs>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2={period}
          y2="0"
          spreadMethod="repeat"
        >
          {stops.map((c, i) => (
            <stop key={i} offset={`${(i / (stops.length - 1)) * 100}%`} stopColor={c} />
          ))}
          {!reduce && (
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="0 0"
              to={`${period} 0`}
              dur="4s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>
      </defs>
      <text
        ref={textRef}
        x="0"
        y="0"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={stroke}
        strokeLinejoin="round"
        style={{
          fontFamily: "inherit",
          fontSize: "inherit",
          fontWeight: "inherit",
          fontStyle: "inherit",
          letterSpacing: "inherit",
        }}
      >
        {children}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Page + section headers                                              */
/* ------------------------------------------------------------------ */

interface PageHeaderProps {
  /** Mono eyebrow text WITHOUT the slashes; they're added for you. */
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-aligned / trailing actions (buttons). */
  actions?: ReactNode;
  subtitleMaxWidth?: number;
}

/**
 * Standard page top: the `//` breadcrumb, a mono eyebrow, a bold title
 * (wrap a word in <GradientText> for the accent), and an optional subtitle
 * and action row. Already wrapped in <Reveal>.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  subtitleMaxWidth = 720,
}: PageHeaderProps) {
  const { pathname } = useLocation();
  // Avoid repeating the page name: if the eyebrow matches the last breadcrumb
  // crumb (e.g. "Changes" / "// changes"), the breadcrumb already carries it.
  const showEyebrow =
    !!eyebrow && eyebrow.trim().toLowerCase() !== lastCrumbLabel(pathname).trim().toLowerCase();
  return (
    <Reveal>
      <PageLinks />
      {showEyebrow && (
        <Box sx={{ mt: 1.5 }}>
          <Eyebrow>{`// ${eyebrow}`}</Eyebrow>
        </Box>
      )}
      <Typography
        variant="h3"
        sx={{ fontWeight: 800, letterSpacing: "-0.02em", mt: showEyebrow ? 0.5 : 1.5 }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="subtitle1"
          sx={{ color: "text.secondary", mt: 1.25, fontWeight: 400, maxWidth: subtitleMaxWidth }}
        >
          {subtitle}
        </Typography>
      )}
      {actions && <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25, mt: 2.5 }}>{actions}</Box>}
    </Reveal>
  );
}

/** Sub-section heading with an optional mono eyebrow above it. */
export function SectionHeading({
  eyebrow,
  children,
  sx,
}: {
  eyebrow?: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box sx={{ mb: 2, ...sx }}>
      {eyebrow && <Eyebrow>{`// ${eyebrow}`}</Eyebrow>}
      <Typography variant="h5" sx={{ fontWeight: 700, mt: eyebrow ? 0.5 : 0 }}>
        {children}
      </Typography>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

interface PanelProps extends BoxProps {
  accent?: string;
  /** Adds a faint accent wash in the top-right corner. */
  wash?: boolean;
}

/** A plain outlined surface (no hover). Use for grouping content. */
export function Panel({ accent = DEFAULT_ACCENT, wash = false, sx, children, ...rest }: PanelProps) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
        p: { xs: 2, sm: 2.5 },
        ...(wash && {
          backgroundImage: `radial-gradient(120% 120% at 100% 0%, ${accent}14 0%, transparent 55%)`,
        }),
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}

interface FeatureCardProps {
  icon?: ReactNode;
  title: ReactNode;
  blurb?: ReactNode;
  /** Internal route (SPA nav). */
  to?: string;
  /** External URL (opens in new tab). Ignored if `to` is set. */
  href?: string;
  accent?: string;
  /** Extra content (chips, meta) rendered under the blurb. */
  children?: ReactNode;
}

/**
 * Accent-glow hover card. If `to`/`href` given, the whole card is one
 * keyboard-focusable link that lifts and lights its border on hover.
 */
export function FeatureCard({
  icon,
  title,
  blurb,
  to,
  href,
  accent = DEFAULT_ACCENT,
  children,
}: FeatureCardProps) {
  const navigate = useNavigate();
  const clickable = Boolean(to || href);

  const body = (
    <>
      <Box
        sx={{
          height: 3,
          width: "100%",
          background: `linear-gradient(90deg, ${accent}, transparent)`,
        }}
      />
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          height: clickable ? "calc(100% - 3px)" : "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          {icon && (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: `${accent}1f`,
                color: accent,
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          )}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, flexGrow: 1, minWidth: 0 }}>
            {title}
          </Typography>
          {clickable && (
            <ArrowOutwardIcon sx={{ fontSize: 18, color: "text.disabled", flexShrink: 0 }} />
          )}
        </Box>
        {blurb && (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {blurb}
          </Typography>
        )}
        {children}
      </Box>
    </>
  );

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
        overflow: "hidden",
        transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: clickable ? "translateY(-4px)" : "none",
          borderColor: `${accent}aa`,
          boxShadow: `0 10px 30px -12px ${accent}80`,
        },
        "&:focus-within": { borderColor: accent },
      }}
    >
      {clickable ? (
        <CardActionArea
          onClick={() => (to ? navigate(to) : window.open(href, "_blank", "noopener"))}
          sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
        >
          {body}
        </CardActionArea>
      ) : (
        body
      )}
    </Card>
  );
}

/** Responsive grid for FeatureCards (or anything). Defaults to 1/2/3 columns. */
export function CardGrid({
  children,
  min,
  sx,
}: {
  children: ReactNode;
  /** Force a column template; otherwise 1 → 2 → 3 across breakpoints. */
  min?: string;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: min
          ? `repeat(auto-fill, minmax(${min}, 1fr))`
          : { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Lists, stats, callouts                                              */
/* ------------------------------------------------------------------ */

/** Accent-ticked feature list. Replaces plain bullet points. */
export function CheckList({
  items,
  accent = DEFAULT_ACCENT,
  columns = 1,
}: {
  items: ReactNode[];
  accent?: string;
  columns?: 1 | 2;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 1,
        gridTemplateColumns: columns === 2 ? { xs: "1fr", sm: "1fr 1fr" } : "1fr",
      }}
    >
      {items.map((item, i) => (
        <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
          <Box
            component="span"
            sx={{
              mt: "7px",
              width: 6,
              height: 6,
              borderRadius: "50%",
              flexShrink: 0,
              bgcolor: accent,
              boxShadow: `0 0 6px ${accent}`,
            }}
          />
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {item}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

/** A row of big mono stat numbers with small labels. */
export function StatRow({ items }: { items: { value: string; label: string }[] }) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: `repeat(${Math.min(items.length, 4)}, 1fr)` },
      }}
    >
      {items.map((s) => (
        <Box key={s.label}>
          <Typography sx={{ fontFamily: MONO, fontWeight: 700, fontSize: { xs: 24, sm: 30 }, lineHeight: 1 }}>
            <GradientText>{s.value}</GradientText>
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", letterSpacing: "0.04em" }}>
            {s.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

/** Left-accent-bar callout for asides, notes and warnings. */
export function Callout({
  children,
  accent = DEFAULT_ACCENT,
  title,
}: {
  children: ReactNode;
  accent?: string;
  title?: ReactNode;
}) {
  return (
    <Box
      sx={{
        borderLeft: "3px solid",
        borderColor: accent,
        bgcolor: `${accent}12`,
        borderRadius: 1,
        px: 2,
        py: 1.5,
      }}
    >
      {title && (
        <Typography sx={{ fontFamily: MONO, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: accent, mb: 0.5 }}>
          {title}
        </Typography>
      )}
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {children}
      </Typography>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Screenshots                                                         */
/* ------------------------------------------------------------------ */

export interface Shot {
  src: string;
  label?: string;
}

/**
 * App screenshot gallery. Phone-shaped frames that lift + zoom on hover with an
 * accent glow. Centres and wraps; good for 1–4 shots per row.
 */
export function ScreenshotGallery({
  shots,
  accent = DEFAULT_ACCENT,
  width = 200,
}: {
  shots: Shot[];
  accent?: string;
  width?: number;
}) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2, sm: 3.5 }, justifyContent: "center" }}>
      {shots.map((shot) => (
        <Box
          key={shot.src}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            "&:hover img": {
              transform: "translateY(-6px) scale(1.03)",
              filter: `drop-shadow(0 18px 34px ${accent}66)`,
              borderColor: `${accent}aa`,
            },
          }}
        >
          <Box
            component="img"
            src={shot.src}
            alt={shot.label ?? ""}
            loading="lazy"
            sx={{
              width: { xs: 140, sm: width },
              maxWidth: "42vw",
              height: "auto",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              transition: "transform 0.3s ease, filter 0.3s ease, border-color 0.3s ease",
            }}
          />
          {shot.label && (
            <Typography variant="caption" sx={{ color: "text.secondary", textAlign: "center" }}>
              {shot.label}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

/** Primary CTA that navigates within the app. */
export function CtaButton({
  to,
  children,
  color = "secondary",
}: {
  to: string;
  children: ReactNode;
  color?: "primary" | "secondary";
}) {
  const navigate = useNavigate();
  return (
    <Button
      variant="contained"
      color={color}
      endIcon={<ArrowForwardIcon />}
      onClick={() => navigate(to)}
      sx={{ fontWeight: 700 }}
    >
      {children}
    </Button>
  );
}

/** Outlined external link button (store, PyPI, GitHub, ...). */
export function ExternalButton({
  href,
  children,
  icon,
}: {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <Button
      variant="outlined"
      color="inherit"
      href={href}
      target="_blank"
      rel="noopener"
      startIcon={icon}
      endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
      sx={{ borderColor: "divider", color: "text.secondary" }}
    >
      {children}
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/* Prev / next page navigation                                         */
/* ------------------------------------------------------------------ */

export interface NavTarget {
  text: string;
  link: string;
}

/** Restyled prev/next footer: two tiles that slide toward their arrow on hover. */
export function PageNav({ left, right }: { left?: NavTarget; right?: NavTarget }) {
  if (!left && !right) return null;
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        pb: 3,
        mt: 1,
        justifyContent: left && right ? "space-between" : right ? "flex-end" : "flex-start",
      }}
    >
      {left && <NavTile target={left} dir="back" />}
      {right && <NavTile target={right} dir="forward" />}
    </Box>
  );
}

function NavTile({ target, dir }: { target: NavTarget; dir: "back" | "forward" }) {
  const back = dir === "back";
  return (
    <Box
      component={RouterLink}
      to={target.link}
      sx={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1.25,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        color: "text.secondary",
        transition: "border-color 0.2s ease, color 0.2s ease, transform 0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          color: "text.primary",
          transform: back ? "translateX(-3px)" : "translateX(3px)",
        },
      }}
    >
      {back && <ArrowBackIcon sx={{ fontSize: 18 }} />}
      <Box sx={{ textAlign: back ? "left" : "right" }}>
        <Typography sx={{ fontFamily: MONO, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "text.disabled" }}>
          {back ? "prev" : "next"}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {target.text}
        </Typography>
      </Box>
      {!back && <ArrowForwardIcon sx={{ fontSize: 18 }} />}
    </Box>
  );
}
