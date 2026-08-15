/**
 * Public traffic dashboard for the site.
 *
 * GitHub Pages has no access logs, so every figure here comes from the site's
 * own collector (`src/middleware/analytics.ts` beacons to stats.moates.com.au,
 * which stores it in Postgres). This page reads that service's `/summary`
 * endpoint, which returns aggregates only.
 *
 * The page is public, so it shows nothing that could point at a person: no
 * addresses, no hashes, no user agents, no per-visitor rows. What it can show
 * is counts, and it says so plainly rather than leaving a reader to wonder.
 *
 * Like the arbitrage board, the feed is best-effort: if the service is down or
 * rate limits the read, the page says which, keeps whatever it already had on
 * screen, and never breaks around the failure.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, ButtonBase, CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  PageHeader,
  GradientText,
  Reveal,
  SectionHeading,
  Panel,
  Callout,
  PageNav,
} from "../components/design";
import { SectionNavLayout, Section } from "../components/SectionNav";
import {
  BarList,
  BarItem,
  Bucket,
  CYAN,
  Donut,
  GOLD,
  HourChart,
  SeriesPoint,
  TrafficChart,
  compact,
} from "../components/StatsCharts";
import { MONO } from "../styles/tokens";
import { SAND } from "../components/sand";
import { formatWait, readRateLimit } from "../middleware/rateLimit";

const API_BASE = process.env.REACT_APP_STATS_API_BASE ?? "https://stats.moates.com.au";

const ACCENT = GOLD;

const SECTIONS: Section[] = [
  { id: "traffic", label: "Traffic" },
  { id: "content", label: "What gets read" },
  { id: "audience", label: "Audience" },
  { id: "sources", label: "Where from" },
  { id: "timing", label: "When" },
  { id: "privacy", label: "What is stored" },
];

/** Windows offered by the service, in the order the filter shows them. */
const RANGES: { key: string; label: string }[] = [
  { key: "1d", label: "Day" },
  { key: "3d", label: "3 days" },
  { key: "7d", label: "Week" },
  { key: "30d", label: "Month" },
  { key: "all", label: "All time" },
];

/* ------------------------------------------------------------------ */
/* Payload (see moates_stats/summary.py)                               */
/* ------------------------------------------------------------------ */

interface Ranked {
  label: string;
  country?: string;
  views?: number;
  clicks?: number;
  sessions?: number;
  bounced?: number;
  avg_events?: number;
  visitors?: number;
}

interface Summary {
  generated_at: string;
  range: { key: string; label: string; since: string; days: number | null };
  collecting_since: string | null;
  last_event: string | null;
  bucket: Bucket;
  totals: {
    sessions: number;
    visitors: number;
    events: number;
    pageviews: number;
    clicks: number;
    outbound: number;
    avg_events: number;
    median_seconds: number;
    bounce_pct: number;
    bot_sessions: number;
  };
  series: SeriesPoint[];
  pages: Ranked[];
  clicks: Ranked[];
  outbound: Ranked[];
  referrers: Ranked[];
  countries: Ranked[];
  cities: Ranked[];
  devices: Ranked[];
  screens: Ranked[];
  languages: Ranked[];
  landing: Ranked[];
  hours: { hour: number; views: number }[];
  crawlers: { name: string; sessions: number }[];
}

/**
 * An error worth repeating to the reader verbatim (a rate limit, a status the
 * service chose to return). Anything else, a dropped connection or a body that
 * will not parse, is shown as one plain sentence instead of a stack of jargon.
 */
class FeedError extends Error {}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

/** "2 min 5 sec" style duration, kept short enough to sit in a stat tile. */
function duration(seconds: number): string {
  if (seconds <= 0) return "n/a";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest ? `${mins}m ${rest}s` : `${mins}m`;
}

function relativeAge(ms: number): string {
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins === 1) return "1 min ago";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
}

function shortDate(iso: string | null): string {
  if (!iso) return "not yet";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "not yet"
    : d.toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" });
}

/** Whole days between a timestamp and now, for the "collecting for N days" note. */
function daysSince(iso: string | null): number {
  if (!iso) return 0;
  const then = Date.parse(iso);
  return Number.isNaN(then) ? 0 : Math.max(1, Math.round((Date.now() - then) / 86_400_000));
}

/**
 * Country and language codes read as names where the browser can supply one.
 * `Intl.DisplayNames` is not everywhere, and an unknown code is not an error,
 * so both fall back to the raw code.
 */
function displayName(code: string, type: "region" | "language"): string {
  if (!code || code === "??" || code === "unknown") return "Unknown";
  try {
    const names = new Intl.DisplayNames(undefined, { type });
    return names.of(code) ?? code;
  } catch {
    return code;
  }
}

/** A route, with the home page named rather than shown as a bare slash. */
const pathLabel = (path: string) => (path === "/" ? "/ (home)" : path);

/** Outbound links show their host, with the path underneath if there is one. */
function outboundParts(url: string): { label: string; sub?: string } {
  try {
    const parsed = new URL(url);
    const rest = `${parsed.pathname}${parsed.search}`.replace(/^\/$/, "");
    return { label: parsed.hostname.replace(/^www\./, ""), sub: rest || undefined };
  } catch {
    return { label: url };
  }
}

const bars = (rows: Ranked[], value: (r: Ranked) => number, label: (r: Ranked) => string, note?: (r: Ranked) => string): BarItem[] =>
  rows.map((r) => ({ label: label(r), value: value(r), note: note ? note(r) : undefined }));

/* ------------------------------------------------------------------ */
/* Atoms                                                               */
/* ------------------------------------------------------------------ */

function Tile({ value, label, hint }: { value: string; label: string; hint?: string }) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: SAND.goldBorder,
        borderRadius: 2,
        bgcolor: "rgba(216,170,120,.035)",
        px: { xs: 1.5, sm: 2 },
        py: { xs: 1.25, sm: 1.5 },
        minWidth: 0,
      }}
    >
      <Typography
        sx={{ fontFamily: MONO, fontWeight: 700, fontSize: { xs: 22, sm: 26 }, lineHeight: 1.1, color: SAND.primary }}
      >
        {value}
      </Typography>
      <Typography sx={{ fontSize: { xs: 11, sm: 11.5 }, color: SAND.faint, letterSpacing: "0.03em", mt: 0.25 }}>
        {label}
      </Typography>
      {hint ? (
        <Typography sx={{ fontSize: 10, color: SAND.faintest, mt: 0.25 }}>{hint}</Typography>
      ) : null}
    </Box>
  );
}

/** Titled card wrapping one chart or list. */
function Card({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <Panel accent={ACCENT} sx={{ display: "flex", flexDirection: "column", gap: 1.25, minWidth: 0 }}>
      <Box>
        <Typography sx={{ font: `600 15px ${MONO}`, color: SAND.primary }}>{title}</Typography>
        {note ? (
          <Typography sx={{ fontSize: 11.5, color: SAND.faintest, mt: 0.25 }}>{note}</Typography>
        ) : null}
      </Box>
      {children}
    </Panel>
  );
}

/** Two cards side by side on desktop, stacked on a phone. */
function Pair({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: { xs: 2, sm: 2.5 },
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        alignItems: "start",
      }}
    >
      {children}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Stats() {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const inFlight = useRef(false);

  const load = useCallback(async (key: string, fresh: boolean) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    try {
      const resp = await fetch(
        `${API_BASE}/summary?range=${encodeURIComponent(key)}`,
        fresh ? { cache: "no-store" } : undefined
      );
      if (!resp.ok) {
        if (resp.status === 429) {
          const { message, until } = await readRateLimit(resp);
          const wait = until ? formatWait(Math.ceil((until - Date.now()) / 1000)) : null;
          throw new FeedError(wait ? `${message} Try again in ${wait}.` : message);
        }
        if (resp.status === 503) throw new FeedError("The stats service is up but has no data to serve.");
        throw new FeedError(`The stats service returned ${resp.status}.`);
      }
      setData((await resp.json()) as Summary);
      setError(null);
    } catch (e) {
      setError(e instanceof FeedError ? e.message : "Could not reach the stats service.");
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    load(range, false);
  }, [range, load]);

  // Only drives the "updated N min ago" line; the summary itself is cached for
  // a minute at the service, so there is nothing to gain from polling it.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const totals = data?.totals;
  const collectedDays = daysSince(data?.collecting_since ?? null);

  const pageBars = useMemo(
    () => bars(data?.pages ?? [], (r) => r.views ?? 0, (r) => pathLabel(r.label), (r) => `${r.sessions} sessions`),
    [data]
  );
  const clickBars = useMemo(
    () => bars(data?.clicks ?? [], (r) => r.clicks ?? 0, (r) => r.label),
    [data]
  );
  const outboundBars = useMemo<BarItem[]>(
    () =>
      (data?.outbound ?? []).map((r) => {
        const parts = outboundParts(r.label);
        return { label: parts.label, sub: parts.sub, value: r.clicks ?? 0 };
      }),
    [data]
  );
  const referrerBars = useMemo(
    () => bars(data?.referrers ?? [], (r) => r.sessions ?? 0, (r) => r.label),
    [data]
  );
  const countryBars = useMemo(
    () => bars(data?.countries ?? [], (r) => r.sessions ?? 0, (r) => displayName(r.label, "region")),
    [data]
  );
  const cityBars = useMemo(
    () =>
      (data?.cities ?? []).map((r) => ({
        label: r.label,
        sub: displayName(r.country ?? "", "region"),
        value: r.sessions ?? 0,
      })),
    [data]
  );
  const languageBars = useMemo(
    () =>
      (data?.languages ?? []).map((r) => ({
        label: displayName(r.label, "language"),
        sub: r.label !== "unknown" ? r.label : undefined,
        value: r.sessions ?? 0,
      })),
    [data]
  );
  const screenBars = useMemo(
    () =>
      bars(
        data?.screens ?? [],
        (r) => r.sessions ?? 0,
        (r) => (r.label === "unknown" ? "Unknown" : `${r.label} px`)
      ),
    [data]
  );
  const landingBars = useMemo(
    () =>
      (data?.landing ?? []).map((r) => ({
        label: pathLabel(r.label),
        value: r.sessions ?? 0,
        note: `${r.avg_events ?? 0} events avg`,
      })),
    [data]
  );
  const crawlerBars = useMemo<BarItem[]>(
    () => (data?.crawlers ?? []).map((c) => ({ label: c.name, value: c.sessions })),
    [data]
  );
  const deviceSlices = useMemo(
    () => (data?.devices ?? []).map((d) => ({ label: d.label, value: d.sessions ?? 0 })),
    [data]
  );

  const age = data ? now - Date.parse(data.generated_at) : 0;
  const rangeLabel = data?.range.label ?? "";

  return (
    <SectionNavLayout sections={SECTIONS}>
      <Box
        component="section"
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: { xs: 3, sm: 4 }, pb: 4 }}
      >
        <PageHeader
          eyebrow="analytics"
          title={<>Site <GradientText>Stats</GradientText></>}
          subtitle="What visitors actually do here, measured by the site's own collector rather than a third party tracker. GitHub Pages keeps no logs, so each page records its own views and clicks and beacons them to a small service I run. No addresses are ever stored, and nothing on this page describes an individual: it is counts, all the way down."
        />

        {/* ---- filter + status ---- */}
        <Reveal delay={0.06} id="traffic">
          <Panel accent={ACCENT} wash>
            {/* The window a reader is choosing between only means something once
                they know how far back the record goes, so it leads the panel. */}
            <Typography
              sx={{
                font: `500 11px ${MONO}`,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: SAND.faintest,
                mb: 1.5,
              }}
            >
              {data
                ? `Collecting since ${shortDate(data.collecting_since)}` +
                  (collectedDays ? `, ${collectedDays} ${collectedDays === 1 ? "day" : "days"} of data` : "")
                : "Collecting since ..."}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                flexWrap: "wrap",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                {RANGES.map((r) => {
                  const active = r.key === range;
                  return (
                    <ButtonBase
                      key={r.key}
                      onClick={() => setRange(r.key)}
                      data-track={`stats:range-${r.key}`}
                      aria-pressed={active}
                      sx={{
                        font: `500 12px ${MONO}`,
                        letterSpacing: "0.04em",
                        px: { xs: 1.1, sm: 1.4 },
                        py: 0.7,
                        borderRadius: 1.5,
                        border: "1px solid",
                        borderColor: active ? "rgba(216,170,120,.5)" : SAND.hairline,
                        color: active ? SAND.gold : SAND.faint,
                        bgcolor: active ? "rgba(216,170,120,.1)" : "transparent",
                        "&:hover": { borderColor: "rgba(216,170,120,.4)", color: SAND.primary },
                      }}
                    >
                      {r.label}
                    </ButtonBase>
                  );
                })}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: 11, color: SAND.faintest }}>
                  {data ? `updated ${relativeAge(age)}` : loading ? "loading" : "unavailable"}
                </Typography>
                <Tooltip title="Fetch the latest figures">
                  <span>
                    <IconButton
                      onClick={() => load(range, true)}
                      disabled={loading}
                      size="small"
                      aria-label="Refresh the stats"
                      data-track="stats:refresh"
                      sx={{ color: SAND.gold }}
                    >
                      {loading ? (
                        <CircularProgress size={15} sx={{ color: SAND.gold }} />
                      ) : (
                        <RefreshIcon fontSize="small" />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Box>

            {error ? (
              // One text node, not an interpolated pair: a message split across
              // nodes is harder to read out and harder to assert on.
              <Typography sx={{ fontSize: 12.5, color: SAND.faint, mb: 2 }}>
                {data ? `${error} Showing the last figures that loaded.` : error}
              </Typography>
            ) : null}

            {totals ? (
              <>
                <Box
                  sx={{
                    display: "grid",
                    gap: { xs: 1, sm: 1.5 },
                    gridTemplateColumns: {
                      xs: "repeat(2, minmax(0, 1fr))",
                      sm: "repeat(3, minmax(0, 1fr))",
                      md: "repeat(4, minmax(0, 1fr))",
                    },
                  }}
                >
                  <Tile value={compact(totals.pageviews)} label="Page views" hint={`last ${rangeLabel}`} />
                  <Tile value={compact(totals.sessions)} label="Sessions" hint="one visit each" />
                  <Tile value={compact(totals.visitors)} label="Visitors" hint="unique per day" />
                  <Tile value={compact(totals.clicks + totals.outbound)} label="Clicks" hint="tracked elements" />
                  <Tile value={totals.avg_events.toFixed(1)} label="Events per session" />
                  <Tile value={duration(totals.median_seconds)} label="Median time on site" />
                  <Tile value={`${totals.bounce_pct}%`} label="Single page visits" />
                  <Tile value={compact(totals.bot_sessions)} label="Crawler visits" hint="excluded elsewhere" />
                </Box>

                <Typography sx={{ fontSize: 11.5, color: SAND.faintest, mt: 1.5 }}>
                  Crawlers are counted separately and left out of every other figure on this page.
                </Typography>
              </>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 2 }}>
                {loading ? <CircularProgress size={16} sx={{ color: SAND.gold }} /> : null}
                <Typography sx={{ fontSize: 12.5, color: SAND.faint }}>
                  {loading ? "Loading the numbers..." : "No figures to show yet."}
                </Typography>
              </Box>
            )}
          </Panel>

          <Box sx={{ mt: 2.5 }}>
            <Card
              title="Traffic"
              note={`Page views and sessions per ${data?.bucket ?? "day"}, over the last ${rangeLabel || "week"}.`}
            >
              <TrafficChart points={data?.series ?? []} bucket={data?.bucket ?? "day"} />
            </Card>
          </Box>
        </Reveal>

        {/* ---- content ---- */}
        <Reveal delay={0.12} id="content">
          <SectionHeading eyebrow="what gets read">Pages and clicks</SectionHeading>
          <Pair>
            <Card title="Most viewed pages" note="Every route, including the ones nobody links to.">
              <BarList items={pageBars} unit="views" empty="No page views in this window." />
            </Card>
            <Card title="What gets clicked" note="Elements tagged for measurement: nav items, buttons, cards.">
              <BarList items={clickBars} unit="clicks" empty="No tracked clicks in this window." />
            </Card>
          </Pair>
          <Box sx={{ mt: { xs: 2, sm: 2.5 } }}>
            <Pair>
              <Card title="Links off the site" note="Outbound clicks are recorded automatically.">
                <BarList items={outboundBars} unit="clicks" empty="Nobody has left through a link yet." />
              </Card>
              <Card title="Where visits start" note="The first page of a session, and how much happened after it.">
                <BarList items={landingBars} unit="sessions" empty="No sessions in this window." />
              </Card>
            </Pair>
          </Box>
        </Reveal>

        {/* ---- audience ---- */}
        <Reveal delay={0.18} id="audience">
          <SectionHeading eyebrow="audience">Who is reading</SectionHeading>
          <Pair>
            <Card title="Devices" note="Worked out from the user agent, which is not stored beyond this.">
              <Donut slices={deviceSlices} />
            </Card>
            <Card title="Screen widths" note="In CSS pixels, bucketed. This is what the mobile layout is built for.">
              <BarList items={screenBars} unit="sessions" empty="No sessions in this window." />
            </Card>
          </Pair>
          <Box sx={{ mt: { xs: 2, sm: 2.5 } }}>
            <Pair>
              <Card title="Countries" note="From Cloudflare's edge, which knows the country without me storing an address.">
                <BarList items={countryBars} unit="sessions" empty="No sessions in this window." />
              </Card>
              <Card title="Cities" note="Also from the edge, and only ever as a count per city.">
                <BarList items={cityBars} unit="sessions" empty="No city recorded in this window." />
              </Card>
            </Pair>
          </Box>
        </Reveal>

        {/* ---- sources ---- */}
        <Reveal delay={0.24} id="sources">
          <SectionHeading eyebrow="where from">Referrers and languages</SectionHeading>
          <Pair>
            <Card title="Referrers" note="The site that linked here. Typed and bookmarked visits count as direct.">
              <BarList items={referrerBars} unit="sessions" empty="No sessions in this window." />
            </Card>
            <Card title="Browser languages" note="The language the browser asks for, which is a decent proxy for where a reader is.">
              <BarList items={languageBars} unit="sessions" empty="No sessions in this window." />
            </Card>
          </Pair>
        </Reveal>

        {/* ---- timing ---- */}
        <Reveal delay={0.3} id="timing">
          <SectionHeading eyebrow="when">Time of day, and the crawlers</SectionHeading>
          <Pair>
            <Card title="Page views by hour" note="Shifted into your local time, not mine.">
              <HourChart hours={data?.hours ?? []} />
            </Card>
            <Card title="Crawlers" note="Search engines and AI bots, the only figures here that include them.">
              <BarList items={crawlerBars} unit="visits" empty="No crawlers in this window." />
            </Card>
          </Pair>
        </Reveal>

        {/* ---- privacy ---- */}
        <Reveal delay={0.36} id="privacy">
          <SectionHeading eyebrow="what is stored">Measured, not tracked</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            The collector is mine, it runs on one small server in Sydney, and it holds as little as it can
            while still answering the question it exists for. There is no advertising network involved, no
            cookie, and no profile of anybody.
          </Box>
          <Pair>
            <Card title="Not stored">
              <BulletList
                items={[
                  "No IP address. The address is used at the moment a beacon arrives to derive a salted hash, then discarded.",
                  "No cookie. The session id lives in sessionStorage and is gone when the tab closes.",
                  "No name, email, or account of any kind. There is nothing to log in to.",
                  "No cross-site tracking. The collector only ever hears from this site.",
                ]}
                colour={CYAN}
              />
            </Card>
            <Card title="Stored, in aggregate">
              <BulletList
                items={[
                  "The page viewed, and which tagged elements were clicked.",
                  "Country and city from Cloudflare's edge, device class, browser language, screen size.",
                  "The referring site, so I can tell where a visit came from.",
                  "A daily hash that says two visits today were the same browser, and rotates at midnight UTC so it cannot say that tomorrow.",
                ]}
                colour={GOLD}
              />
            </Card>
          </Pair>
          <Box sx={{ mt: 2 }}>
            <Callout accent={ACCENT} title="reading these numbers">
              Visitors counts unique browsers per day, so over a week it is closer to the sum of each day's
              uniques than to a true unique count. That is a deliberate consequence of the hash rotating
              daily. Do Not Track is honoured, ad blockers stop the beacon outright, and neither is counted,
              so treat everything here as a floor rather than a full picture.
            </Callout>
          </Box>
        </Reveal>

        <PageNav left={{ text: "Resume", link: "/about" }} right={{ text: "Contact", link: "/contact" }} />
      </Box>
    </SectionNavLayout>
  );
}

/** Small dotted list used by the privacy cards. */
function BulletList({ items, colour }: { items: string[]; colour: string }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {items.map((text) => (
        <Box key={text} sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: colour,
              mt: "7px",
              flex: "none",
            }}
          />
          <Typography sx={{ fontSize: 13, color: SAND.faint, lineHeight: 1.6 }}>{text}</Typography>
        </Box>
      ))}
    </Box>
  );
}
