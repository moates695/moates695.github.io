/**
 * Before/after screenshot comparison for redesign write-ups.
 *
 * `BeforeAfter` shows one screen at a time (picked from a small tab strip) with
 * the original on the left and the redesign on the right, stacking on mobile.
 * Both panes, and any standalone `ImageFigure`, open full-size in a lightbox so
 * dense dashboard screenshots stay readable at page width.
 */
import { useState } from "react";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import { MONO } from "../styles/tokens";
import { DEFAULT_ACCENT } from "./design";

export interface ComparisonPair {
  /** Stable key, also used as the tab id. */
  id: string;
  /** Tab label, e.g. "Ride screen". */
  label: string;
  /** Public path of the original screenshot. */
  before: string;
  /** Public path of the redesigned screenshot. */
  after: string;
  /** One-line summary of what changed on this screen. */
  note?: string;
}

interface Zoomed {
  src: string;
  alt: string;
}

/** Full-bleed overlay for a single screenshot. Click anywhere or press Esc to close. */
function Lightbox({ shot, onClose }: { shot: Zoomed | null; onClose: () => void }) {
  return (
    <Modal
      open={!!shot}
      onClose={onClose}
      aria-label={shot?.alt}
      slotProps={{ backdrop: { sx: { bgcolor: "rgba(6,5,4,.93)" } } }}
      sx={{ overflow: "auto" }}
    >
      {/* Fills the viewport so a tap anywhere closes. On phones the shot is
          rendered wider than the screen and the overlay pans, since these are
          dense desktop screenshots that are unreadable scaled to 390px. */}
      <Box
        onClick={onClose}
        sx={{
          outline: "none",
          cursor: "zoom-out",
          display: "flex",
          minWidth: "100%",
          minHeight: "100%",
          p: { xs: 0, sm: 3 },
        }}
      >
        <IconButton
          onClick={onClose}
          aria-label="Close"
          sx={{ position: "fixed", top: 8, right: 8, color: "text.primary", bgcolor: "rgba(11,9,8,.7)" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Box
          component="img"
          src={shot?.src}
          alt={shot?.alt ?? ""}
          sx={{
            // `margin: auto` rather than flex centring: a centred flex child
            // that overflows clips its left edge out of scroll reach.
            m: "auto",
            width: { xs: "240vw", sm: "auto" },
            height: "auto",
            maxWidth: { xs: "none", sm: "96vw" },
            maxHeight: { xs: "none", sm: "92vh" },
            borderRadius: { xs: 0, sm: 2 },
            border: { xs: 0, sm: "1px solid" },
            borderColor: "divider",
            boxShadow: "0 30px 80px rgba(0,0,0,.7)",
          }}
        />
      </Box>
    </Modal>
  );
}

/**
 * Title strip above a screenshot: mono label on the left, zoom affordance on the
 * right. Sits outside the image so it never covers the interface being shown.
 */
function PaneBar({ label, accent }: { label: string; accent?: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        px: 1.5,
        py: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "rgba(255,255,255,.02)",
      }}
    >
      <Typography
        component="span"
        sx={{
          fontFamily: MONO,
          fontSize: 10.5,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: accent ?? "text.secondary",
        }}
      >
        {label}
      </Typography>
      <ZoomOutMapIcon className="zoom-hint" sx={{ fontSize: 14, color: "text.disabled" }} />
    </Box>
  );
}

/** A single click-to-zoom screenshot pane. */
function Pane({
  src,
  alt,
  tag,
  accent,
  onZoom,
}: {
  src: string;
  alt: string;
  tag?: string;
  accent?: string;
  onZoom: (shot: Zoomed) => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={() => onZoom({ src, alt })}
      aria-label={`Enlarge ${alt}`}
      sx={{
        all: "unset",
        boxSizing: "border-box",
        position: "relative",
        display: "block",
        width: "100%",
        cursor: "zoom-in",
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "#0b0908",
        transition: "border-color .25s ease, box-shadow .25s ease",
        "&:hover, &:focus-visible": {
          borderColor: `${accent ?? DEFAULT_ACCENT}66`,
          boxShadow: `0 14px 34px ${accent ?? DEFAULT_ACCENT}22`,
        },
        "&:hover .zoom-hint, &:focus-visible .zoom-hint": { color: accent ?? DEFAULT_ACCENT },
      }}
    >
      {tag && <PaneBar label={tag} accent={accent} />}
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="lazy"
        sx={{ display: "block", width: "100%", height: "auto" }}
      />
    </Box>
  );
}

/**
 * Tabbed old-versus-new screenshot comparison. Pass one entry per screen; the
 * first is selected on mount.
 */
export function BeforeAfter({
  pairs,
  accent = DEFAULT_ACCENT,
  beforeLabel = "before / upstream",
  afterLabel = "after / redesign",
}: {
  pairs: ComparisonPair[];
  accent?: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [activeId, setActiveId] = useState(pairs[0]?.id);
  const [zoom, setZoom] = useState<Zoomed | null>(null);
  const active = pairs.find((p) => p.id === activeId) ?? pairs[0];

  if (!active) return null;

  return (
    <Box>
      {pairs.length > 1 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {pairs.map((pair) => {
            const on = pair.id === active.id;
            return (
              <Box
                key={pair.id}
                component="button"
                type="button"
                onClick={() => setActiveId(pair.id)}
                aria-pressed={on}
                sx={{
                  all: "unset",
                  cursor: "pointer",
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 999,
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: on ? accent : "text.secondary",
                  border: "1px solid",
                  borderColor: on ? `${accent}66` : "divider",
                  bgcolor: on ? `${accent}14` : "transparent",
                  transition: "all .2s ease",
                  "&:hover, &:focus-visible": { borderColor: `${accent}66`, color: accent },
                }}
              >
                {pair.label}
              </Box>
            );
          })}
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          alignItems: "start",
          gap: { xs: 2, md: 2.5 },
        }}
      >
        <Pane
          src={active.before}
          alt={`${active.label}, original interface`}
          tag={beforeLabel}
          onZoom={setZoom}
        />
        <Pane
          src={active.after}
          alt={`${active.label}, redesigned interface`}
          tag={afterLabel}
          accent={accent}
          onZoom={setZoom}
        />
      </Box>

      {active.note && (
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1.75 }}>
          {active.note}
        </Typography>
      )}

      <Lightbox shot={zoom} onClose={() => setZoom(null)} />
    </Box>
  );
}

/** A standalone click-to-zoom screenshot with an optional caption. */
export function ImageFigure({
  src,
  alt,
  caption,
  tag,
  accent = DEFAULT_ACCENT,
}: {
  src: string;
  alt: string;
  caption?: string;
  tag?: string;
  accent?: string;
}) {
  const [zoom, setZoom] = useState<Zoomed | null>(null);
  return (
    <Box>
      <Pane src={src} alt={alt} tag={tag} accent={accent} onZoom={setZoom} />
      {caption && (
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1.5 }}>
          {caption}
        </Typography>
      )}
      <Lightbox shot={zoom} onClose={() => setZoom(null)} />
    </Box>
  );
}
