/**
 * Chart primitives for the site stats page.
 *
 * Hand-rolled SVG rather than a charting library: four shapes are needed (a
 * time series, a donut, a ranked bar list and an hour histogram), the site
 * ships no charting dependency today, and adding one would cost more bundle
 * than the whole page.
 *
 * Colour follows the Tech Sand palette, with one deliberate change. The two
 * series in the traffic chart use the site gold against a **more saturated
 * cyan** than the theme's `secondary`: at the theme's own cyan the two are only
 * 14.6 apart in OKLab against this background, which is under the readable
 * floor, and the pair is what the whole chart rests on. Everything else that
 * encodes magnitude alone uses a single-hue gold ramp, so no other chart
 * depends on telling two hues apart at all.
 *
 * Every mark carries an SVG `<title>`, so a value is reachable by hover and by
 * a screen reader without relying on the tooltip layer.
 */
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { MONO } from "../styles/tokens";
import { SAND } from "./sand";

/** Series hues. Gold is the site accent; the cyan is a saturated Tech Sand cyan. */
export const GOLD = "#d8aa78";
export const CYAN = "#4fbdd4";

/** Single-hue ramp, light to dark, for charts that encode magnitude only. */
export const GOLD_RAMP = ["#f2d3a8", "#d8aa78", "#b0854f", "#7d5f38", "#5d472a"];

const GRID = "rgba(255,255,255,.06)";
const AXIS_TEXT = SAND.faintest;

export interface SeriesPoint {
  t: string;
  sessions: number;
  visitors: number;
  pageviews: number;
}

export type Bucket = "hour" | "day" | "week";

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

/**
 * Container width, tracked so the SVG can be drawn at real pixel size.
 *
 * A callback ref rather than an effect over `ref.current`: these charts render
 * before their data arrives, so the measured element can attach on a later
 * render than the one the hook first ran on. An effect with no dependencies
 * would measure nothing and never look again, leaving a chart drawn at zero
 * width. A callback ref fires whenever the node actually attaches.
 */
function useWidth<T extends HTMLElement>() {
  const [width, setWidth] = useState(0);
  const node = useRef<T | null>(null);
  const observer = useRef<ResizeObserver | null>(null);

  const ref = useCallback((el: T | null) => {
    observer.current?.disconnect();
    observer.current = null;
    node.current = el;
    if (!el) return;
    setWidth(el.clientWidth);
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => setWidth(el.clientWidth));
      ro.observe(el);
      observer.current = ro;
    }
  }, []);

  // Fallback for environments without ResizeObserver (jsdom, older Safari).
  useEffect(() => {
    const onResize = () => setWidth(node.current?.clientWidth ?? 0);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { ref, width };
}

/**
 * Round an axis maximum up to something a reader can divide in their head.
 * Small counts are left alone: on a portfolio's traffic, "4" is a real
 * maximum and rounding it to 10 would flatten the whole chart.
 */
function niceMax(value: number): number {
  if (value <= 5) return Math.max(1, Math.ceil(value));
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const scaled = value / pow;
  const step = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10;
  return step * pow;
}

/** Short axis label for a bucket start. */
export function bucketLabel(iso: string, bucket: Bucket): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  if (bucket === "hour") return d.toLocaleTimeString([], { hour: "numeric" }).toLowerCase();
  const day = d.toLocaleDateString([], { day: "numeric", month: "short" });
  return bucket === "week" ? `w/c ${day}` : day;
}

/** Full label used in tooltips, where there is room for the date as well. */
export function bucketFull(iso: string, bucket: Bucket): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const day = d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
  if (bucket === "hour") {
    return `${day}, ${d.toLocaleTimeString([], { hour: "numeric" }).toLowerCase()}`;
  }
  return bucket === "week" ? `Week of ${day}` : day;
}

/** Compact count: 1200 reads as 1.2k, which keeps a bar label to one line. */
export function compact(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${Math.round(n / 1000)}k`;
}

/** Floating tooltip shared by the charts. Clamped so it never leaves the card. */
function Tooltip({ x, width, children }: { x: number; width: number; children: ReactNode }) {
  const TIP = 150;
  const left = Math.min(Math.max(x - TIP / 2, 0), Math.max(0, width - TIP));
  return (
    <Box
      sx={{
        position: "absolute",
        top: 4,
        left,
        width: TIP,
        pointerEvents: "none",
        bgcolor: "rgba(16,13,8,.96)",
        border: `1px solid ${SAND.goldBorder}`,
        borderRadius: 1,
        px: 1,
        py: 0.75,
        zIndex: 2,
      }}
    >
      {children}
    </Box>
  );
}

function TipRow({ colour, label, value }: { colour?: string; label: string; value: ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }}>
        {colour ? (
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: colour, flex: "none" }} />
        ) : null}
        <Typography sx={{ fontSize: 11, color: SAND.faint }}>{label}</Typography>
      </Box>
      <Typography sx={{ fontFamily: MONO, fontSize: 11.5, color: SAND.primary }}>{value}</Typography>
    </Box>
  );
}

/** Legend swatch plus name, so identity is never carried by colour alone. */
export function LegendKey({ colour, label }: { colour: string; label: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      <Box sx={{ width: 10, height: 2.5, borderRadius: 2, bgcolor: colour }} />
      <Typography sx={{ fontSize: 11.5, color: SAND.faint }}>{label}</Typography>
    </Box>
  );
}

function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <Typography
      sx={{ fontSize: 12.5, color: SAND.faintest, textAlign: "center", py: 3 }}
    >
      {children}
    </Typography>
  );
}

/* ------------------------------------------------------------------ */
/* Traffic over time                                                   */
/* ------------------------------------------------------------------ */

/**
 * Page views and sessions per bucket, on one shared axis.
 *
 * Both series are counts of the same kind of thing, so they belong on the same
 * scale; a second y-axis would let any pair of lines be drawn to cross
 * wherever it flattered them. Visitors ride along in the tooltip rather than
 * as a third line, since on this site it tracks sessions almost exactly.
 */
export function TrafficChart({ points, bucket }: { points: SeriesPoint[]; bucket: Bucket }) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const height = 230;
  const pad = { top: 16, right: 14, bottom: 24, left: 34 };
  const plotW = Math.max(0, width - pad.left - pad.right);
  const plotH = height - pad.top - pad.bottom;

  const max = niceMax(Math.max(1, ...points.flatMap((p) => [p.pageviews, p.sessions])));
  const stepX = points.length > 1 ? plotW / (points.length - 1) : 0;
  const x = (i: number) => pad.left + (points.length > 1 ? i * stepX : plotW / 2);
  const y = (v: number) => pad.top + plotH - (v / max) * plotH;

  const line = (key: "pageviews" | "sessions") =>
    points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");
  const area = () =>
    points.length === 0
      ? ""
      : `${line("pageviews")} L${x(points.length - 1).toFixed(1)},${(pad.top + plotH).toFixed(1)} L${x(0).toFixed(1)},${(pad.top + plotH).toFixed(1)} Z`;

  // Enough ticks to orient, few enough that they never collide on a phone.
  const tickEvery = Math.max(1, Math.ceil(points.length / (width < 420 ? 4 : 7)));
  const active = hover !== null ? points[hover] : null;
  const busiest = points.reduce((a, b) => (b.pageviews > a.pageviews ? b : a), points[0]);

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    if (points.length === 0 || plotW <= 0) return;
    const box = e.currentTarget.getBoundingClientRect();
    const rel = e.clientX - box.left;
    const i = stepX > 0 ? Math.round(rel / stepX) : 0;
    setHover(Math.min(points.length - 1, Math.max(0, i)));
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
        <LegendKey colour={GOLD} label="Page views" />
        <LegendKey colour={CYAN} label="Sessions" />
      </Box>

      <Box ref={ref} sx={{ position: "relative", width: "100%" }}>
        {points.length === 0 ? (
          <EmptyNote>Nothing recorded in this window yet.</EmptyNote>
        ) : (
          <>
            {active ? (
              <Tooltip x={x(hover as number)} width={width}>
                <Typography sx={{ fontFamily: MONO, fontSize: 10.5, color: SAND.faintest, mb: 0.5 }}>
                  {bucketFull(active.t, bucket)}
                </Typography>
                <TipRow colour={GOLD} label="Page views" value={active.pageviews} />
                <TipRow colour={CYAN} label="Sessions" value={active.sessions} />
                <TipRow label="Visitors" value={active.visitors} />
              </Tooltip>
            ) : null}

            <svg
              width={width || 1}
              height={height}
              role="img"
              aria-label={`Traffic per ${bucket}. Busiest ${bucket}: ${bucketFull(busiest.t, bucket)} with ${busiest.pageviews} page views.`}
              style={{ display: "block", touchAction: "pan-y" }}
            >
              {/* grid + y labels */}
              {[0, 0.5, 1].map((f) => {
                const gy = pad.top + plotH - f * plotH;
                return (
                  <g key={f}>
                    <line x1={pad.left} x2={width - pad.right} y1={gy} y2={gy} stroke={GRID} strokeWidth={1} />
                    <text
                      x={pad.left - 6}
                      y={gy + 3.5}
                      textAnchor="end"
                      fill={AXIS_TEXT}
                      style={{ font: `10px ${MONO}` }}
                    >
                      {compact(Math.round(max * f))}
                    </text>
                  </g>
                );
              })}

              {/* x labels; the end ones anchor inward so they cannot be clipped */}
              {points.map((p, i) =>
                i % tickEvery === 0 ? (
                  <text
                    key={p.t}
                    x={x(i)}
                    y={height - 7}
                    textAnchor={i === 0 ? "start" : x(i) > width - pad.right - 24 ? "end" : "middle"}
                    fill={AXIS_TEXT}
                    style={{ font: `10px ${MONO}` }}
                  >
                    {bucketLabel(p.t, bucket)}
                  </text>
                ) : null
              )}

              <defs>
                <linearGradient id="statsArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>

              <path d={area()} fill="url(#statsArea)" />
              <path d={line("pageviews")} fill="none" stroke={GOLD} strokeWidth={2} strokeLinejoin="round" />
              <path d={line("sessions")} fill="none" stroke={CYAN} strokeWidth={2} strokeLinejoin="round" />

              {/* crosshair + markers, ringed in the surface colour so they read over the lines */}
              {active ? (
                <g>
                  <line
                    x1={x(hover as number)}
                    x2={x(hover as number)}
                    y1={pad.top}
                    y2={pad.top + plotH}
                    stroke="rgba(255,255,255,.16)"
                    strokeWidth={1}
                  />
                  {([["pageviews", GOLD], ["sessions", CYAN]] as const).map(([key, colour]) => (
                    <circle
                      key={key}
                      cx={x(hover as number)}
                      cy={y(active[key])}
                      r={4.5}
                      fill={colour}
                      stroke={SAND.surface}
                      strokeWidth={2}
                    />
                  ))}
                </g>
              ) : null}

              <rect
                x={pad.left}
                y={pad.top}
                width={Math.max(0, plotW)}
                height={plotH}
                fill="transparent"
                onPointerMove={onMove}
                onPointerLeave={() => setHover(null)}
              />
            </svg>
          </>
        )}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Ranked bar list                                                     */
/* ------------------------------------------------------------------ */

export interface BarItem {
  label: string;
  value: number;
  /** Optional right-hand note, e.g. "5 sessions". */
  note?: string;
  /** Optional smaller line under the label, e.g. the full URL. */
  sub?: string;
}

/**
 * Ranked list with a proportional bar behind each row.
 *
 * Bars are scaled to the largest row rather than to the total: the question a
 * list like this answers is "which of these is biggest", and scaling to the
 * total leaves every bar a sliver as soon as the tail is long.
 */
export function BarList({
  items,
  empty = "Nothing recorded yet.",
  unit,
}: {
  items: BarItem[];
  empty?: string;
  unit?: string;
}) {
  if (items.length === 0) return <EmptyNote>{empty}</EmptyNote>;
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
      {items.map((item) => (
        <Box
          key={`${item.label}-${item.sub ?? ""}`}
          title={unit ? `${item.label}: ${item.value} ${unit}` : `${item.label}: ${item.value}`}
          sx={{ position: "relative", borderRadius: 1, overflow: "hidden", px: 1, py: 0.6 }}
        >
          {/*
            The label sits over its own bar, so the bar's end is drawn as a
            soft edge rather than a hard gold rule: at full strength it reads
            as a line struck through whichever label it happens to cross.
          */}
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              width: `${Math.max(2, (item.value / max) * 100)}%`,
              background: "linear-gradient(90deg, rgba(216,170,120,.16), rgba(216,170,120,.09))",
              borderRight: "2px solid rgba(216,170,120,.45)",
              borderRadius: "4px",
            }}
          />
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 1.5,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: { xs: 11.5, sm: 12.5 },
                  color: SAND.primary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </Typography>
              {item.sub ? (
                <Typography
                  sx={{
                    fontSize: 10.5,
                    color: SAND.faintest,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.sub}
                </Typography>
              ) : null}
            </Box>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, flex: "none" }}>
              {item.note ? (
                <Typography sx={{ fontSize: 10.5, color: SAND.faintest }}>{item.note}</Typography>
              ) : null}
              <Typography sx={{ fontFamily: MONO, fontSize: 12.5, color: SAND.primary }}>
                {compact(item.value)}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Donut                                                               */
/* ------------------------------------------------------------------ */

export interface Slice {
  label: string;
  value: number;
}

/**
 * Share of a whole, in a single-hue ramp ordered largest to smallest.
 *
 * One hue rather than a categorical set because the slices are ranked shares
 * of one dimension, not unrelated entities: the ramp says "biggest to
 * smallest" on its own, and no reader has to separate two hues to use it. Each
 * slice is labelled in the legend beside it, so colour carries nothing alone.
 */
export function Donut({ slices, size = 132 }: { slices: Slice[]; size?: number }) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return <EmptyNote>Nothing recorded yet.</EmptyNote>;

  const ranked = [...slices].sort((a, b) => b.value - a.value);
  const r = size / 2;
  const stroke = size * 0.17;
  const radius = r - stroke / 2;
  const circumference = 2 * Math.PI * radius;
  // A 2px gap between segments, so neighbouring arcs never blur into one.
  const gap = 2;

  let offset = 0;
  const arcs = ranked.map((slice, i) => {
    const fraction = slice.value / total;
    const length = Math.max(0, fraction * circumference - gap);
    const arc = {
      ...slice,
      colour: GOLD_RAMP[Math.min(i, GOLD_RAMP.length - 1)],
      pct: fraction * 100,
      dash: `${length} ${circumference - length}`,
      offset: -offset,
    };
    offset += fraction * circumference;
    return arc;
  });

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 2, sm: 3 }, flexWrap: "wrap" }}>
      <svg width={size} height={size} role="img" aria-label={ranked.map((s) => `${s.label}: ${s.value}`).join(", ")}>
        <g transform={`translate(${r},${r}) rotate(-90)`}>
          {arcs.map((arc) => (
            <circle
              key={arc.label}
              r={radius}
              fill="none"
              stroke={arc.colour}
              strokeWidth={stroke}
              strokeDasharray={arc.dash}
              strokeDashoffset={arc.offset}
            >
              <title>{`${arc.label}: ${arc.value} (${arc.pct.toFixed(0)}%)`}</title>
            </circle>
          ))}
        </g>
        <text
          x={r}
          y={r - 2}
          textAnchor="middle"
          fill={SAND.primary}
          style={{ font: `600 18px ${MONO}` }}
        >
          {compact(total)}
        </text>
        <text x={r} y={r + 13} textAnchor="middle" fill={AXIS_TEXT} style={{ font: `9.5px ${MONO}` }}>
          SESSIONS
        </text>
      </svg>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6, minWidth: 120 }}>
        {arcs.map((arc) => (
          <Box key={arc.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 9, height: 9, borderRadius: "2px", bgcolor: arc.colour, flex: "none" }} />
            <Typography sx={{ fontSize: 12.5, color: SAND.faint, textTransform: "capitalize", flex: 1 }}>
              {arc.label}
            </Typography>
            <Typography sx={{ fontFamily: MONO, fontSize: 12, color: SAND.primary }}>
              {arc.pct.toFixed(0)}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Hour of day                                                         */
/* ------------------------------------------------------------------ */

/**
 * Page views by hour of day, shifted from UTC into the reader's own zone.
 *
 * The service aggregates in UTC because it has no idea where the page is being
 * read; the shift happens here, where the browser does know. Zones offset by a
 * fraction of an hour land in the nearest hour, which is close enough for a
 * shape that only answers "morning or evening".
 */
export function HourChart({ hours }: { hours: { hour: number; views: number }[] }) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const shift = -Math.round(new Date().getTimezoneOffset() / 60);
  const local = Array.from({ length: 24 }, (_, h) => {
    const source = hours.find((x) => (x.hour + shift + 24) % 24 === h);
    return { hour: h, views: source ? source.views : 0 };
  });

  const total = local.reduce((sum, h) => sum + h.views, 0);
  const height = 120;
  const pad = { top: 10, bottom: 18 };
  const plotH = height - pad.top - pad.bottom;
  const max = Math.max(1, ...local.map((h) => h.views));
  const slot = width / 24;
  const barW = Math.max(3, slot - 3);

  const label = (h: number) => (h === 0 ? "12a" : h === 12 ? "12p" : h > 12 ? `${h - 12}p` : `${h}a`);

  return (
    <Box ref={ref} sx={{ position: "relative", width: "100%" }}>
      {total === 0 ? <EmptyNote>Nothing recorded in this window yet.</EmptyNote> : null}
      {total > 0 && hover !== null ? (
        <Tooltip x={hover * slot + slot / 2} width={width}>
          <TipRow
            colour={GOLD}
            label={`${label(local[hover].hour)} local`}
            value={`${local[hover].views} views`}
          />
        </Tooltip>
      ) : null}

      <svg
        width={width || 1}
        height={total === 0 ? 0 : height}
        role="img"
        aria-label="Page views by hour of day, in your local time"
        style={{ display: total === 0 ? "none" : "block" }}
      >
        {local.map((h, i) => {
          const barH = (h.views / max) * plotH;
          return (
            <g key={h.hour} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
              <rect x={i * slot} y={pad.top} width={slot} height={plotH} fill="transparent" />
              <rect
                x={i * slot + (slot - barW) / 2}
                y={pad.top + plotH - barH}
                width={barW}
                height={Math.max(h.views > 0 ? 2 : 0, barH)}
                rx={2}
                fill={hover === i ? SAND.goldLight : GOLD}
                opacity={h.views === 0 ? 0.18 : 1}
              >
                <title>{`${label(h.hour)}: ${h.views} page views`}</title>
              </rect>
              {i % 4 === 0 ? (
                <text
                  x={i * slot + slot / 2}
                  y={height - 5}
                  textAnchor="middle"
                  fill={AXIS_TEXT}
                  style={{ font: `9.5px ${MONO}` }}
                >
                  {label(h.hour)}
                </text>
              ) : null}
            </g>
          );
        })}
        <line x1={0} x2={width} y1={pad.top + plotH} y2={pad.top + plotH} stroke={GRID} strokeWidth={1} />
      </svg>
    </Box>
  );
}
