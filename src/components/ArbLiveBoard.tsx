/**
 * Live arbitrage board.
 *
 * Reads the snapshot published by the sportschecker service on the droplet (a
 * full sweep of every bookmaker, rebuilt every 15 minutes) and renders it
 * opportunity-first, mirroring the engine's own report order: confirmed
 * arbitrage, then per-market stats, then the whole cross-book price board.
 *
 * The feed is deliberately behind. The service holds each sweep for
 * `delay_minutes` before serving it, so everything here (the price board as
 * much as the arbs computed from it) describes the market as it stood half an
 * hour ago. That is the point rather than a limitation, so the board labels
 * itself DELAYED rather than dressing an old snapshot up as a live one.
 *
 * The feed is best-effort by design. If the service is down, still warming up,
 * or a bookmaker did not answer, the section says so plainly instead of
 * breaking the page around it: stale odds presented as live would be worse than
 * no odds at all.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  ButtonBase,
  CircularProgress,
  Collapse,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { MONO } from "../styles/tokens";
import { SAND } from "./sand";
import { formatWait, readRateLimit } from "../middleware/rateLimit";

const API_BASE = process.env.REACT_APP_ARB_API_BASE ?? "https://arb.moates.com.au";

/** Matches ARB_INTERVAL_MINUTES on the service; only used to estimate the next sweep. */
const INTERVAL_MIN = 15;

/**
 * Fallback for ARB_PUBLISH_DELAY_MINUTES. The payload carries the real figure,
 * so this only covers a service old enough not to send one.
 */
const DELAY_MIN = 30;

/** Arb cards shown before the "show all" toggle appears. */
const ARB_PREVIEW = 6;

/** Bankroll used per arb until the reader types their own. */
const DEFAULT_STAKE = 100;

/** One-tap bankrolls beside the stake box. */
const STAKE_PRESETS = [50, 100, 250, 500, 1000];

const STAKE_KEY = "arb.stake";

const BOOK_LABELS: Record<string, string> = {
  sportsbet: "Sportsbet",
  ladbrokes: "Ladbrokes",
  pointsbet: "PointsBet",
  palmerbet: "Palmerbet",
  unibet: "Unibet",
  betr: "betr",
  tab: "TAB",
};

/** Racing codes read gold, the ball sports cyan, so the two groups separate at a glance. */
const RACING_CODES = new Set(["R", "H", "G"]);
const codeColour = (code: string) => (RACING_CODES.has(code) ? SAND.gold : SAND.cool);

/* ------------------------------------------------------------------ */
/* Payload shape (see the service's /latest)                           */
/* ------------------------------------------------------------------ */

interface Leg {
  number: number | null;
  name: string;
  book: string;
  odds: number;
}

interface Candidate {
  venue: string;
  race_number: number;
  race_name: string;
  scheduled_time: string;
  overround_pct: number;
  profit_pct: number;
  books: string[];
  legs: Leg[];
}

interface Runner {
  canonical_name: string;
  number: number | null;
  odds: Record<string, number>;
  match_confidence: number;
}

interface Race {
  race_number: number;
  canonical_name: string;
  scheduled_time: string;
  runners: Runner[];
  field_size: number;
  start_iso: string | null;
}

interface BoardVenue {
  venue: string;
  date: string;
  races: Race[];
}

interface Discipline {
  code: string;
  label: string;
  generated_at: string;
  books_fetched: string[];
  books_failed: string[];
  venues: number;
  races: number;
  arbitrage: {
    found: boolean;
    candidates: Candidate[];
    unverified: Candidate[];
    tightest: { venue: string; race_number: number; overround_pct: number } | null;
  };
  board: BoardVenue[];
}

interface Snapshot {
  generated_at: string;
  /** How long the service held this sweep before serving it. */
  delay_minutes?: number;
  /** When it became readable, i.e. generated_at + the delay. */
  published_at?: string | null;
  duration_seconds: number;
  sweeps: { name: string; ok: boolean; seconds: number }[];
  totals: { disciplines: number; races: number; venues: number; arbitrage: number };
  disciplines: Discipline[];
}

type Tagged = Candidate & { code: string; label: string };

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

function relativeAge(ms: number): string {
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins === 1) return "1 min ago";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
}

/**
 * The feed's `scheduled_time` is a bare UTC "HH:MM", so it needs a date to
 * become a real instant. `start_iso` supplies one when the bookmaker gave one;
 * otherwise anchor on the venue's date, falling back to the sweep time and
 * rolling forward a day for a start that would otherwise sit in the past.
 */
function localStart(hhmm: string, anchorIso: string, startIso?: string | null): string {
  const fmt = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (startIso) {
    const exact = new Date(startIso);
    if (!Number.isNaN(exact.getTime())) return fmt(exact);
  }
  const anchor = new Date(anchorIso);
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(anchor.getTime()) || Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const guess = new Date(
    Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth(), anchor.getUTCDate(), h, m)
  );
  if (guess.getTime() < anchor.getTime() - 6 * 3600_000) guess.setUTCDate(guess.getUTCDate() + 1);
  return fmt(guess);
}

/**
 * Split a bankroll across the legs in proportion to each leg's implied
 * probability, which is the split the engine's own report prints. Because the
 * stakes are proportional, every leg pays the same `payout`, so the profit is
 * locked in whichever runner wins.
 */
function splitStakes(legs: Leg[], bankroll: number) {
  const implied = legs.map((l) => 1 / l.odds);
  const total = implied.reduce((a, b) => a + b, 0);
  const stakes = implied.map((p) => (bankroll * p) / total);
  const payout = total > 0 ? bankroll / total : 0;
  return { stakes, payout, profit: payout - bankroll };
}

/** Dollars with cents and thousands separators, sign left to the caller. */
const money = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * Keep the stake box to a plain positive amount: digits, a single decimal
 * point, at most two cents, and short enough that the totals still read as
 * money rather than scientific notation.
 */
function sanitiseStake(raw: string): string {
  const [head, ...rest] = raw.replace(/[^0-9.]/g, "").split(".");
  const dollars = head.slice(0, 9);
  return rest.length ? `${dollars}.${rest.join("").slice(0, 2)}` : dollars;
}

const bookName = (key: string) => BOOK_LABELS[key] ?? key;

/* ------------------------------------------------------------------ */
/* Atoms                                                               */
/* ------------------------------------------------------------------ */

function Pill({
  children,
  colour = SAND.faint,
  filled = false,
}: {
  children: React.ReactNode;
  colour?: string;
  filled?: boolean;
}) {
  return (
    <Box
      component="span"
      sx={{
        fontFamily: MONO,
        fontSize: 10.5,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        px: 0.85,
        py: 0.3,
        borderRadius: 1,
        whiteSpace: "nowrap",
        color: colour,
        border: "1px solid",
        borderColor: filled ? "transparent" : `${colour}44`,
        bgcolor: filled ? `${colour}1f` : "transparent",
      }}
    >
      {children}
    </Box>
  );
}

function MiniStat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <Box>
      <Typography sx={{ fontFamily: MONO, fontWeight: 700, fontSize: { xs: 20, sm: 24 }, lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: "text.secondary", letterSpacing: "0.04em", fontSize: { xs: 11, sm: 12 } }}
      >
        {label}
      </Typography>
    </Box>
  );
}

/** Wraps a wide table so it scrolls inside the card, never the page. */
function Scroller({ children }: { children: React.ReactNode }) {
  return <Box sx={{ overflowX: "auto", mx: -0.5, px: 0.5 }}>{children}</Box>;
}

const cellSx = {
  fontFamily: MONO,
  fontSize: { xs: 11.5, sm: 12.5 },
  py: 0.6,
  // Tight on phones: it buys about 40px, which is the difference between the
  // stake column fitting and the table needing a sideways drag.
  px: { xs: 0.6, sm: 1 },
  borderBottom: "1px solid",
  borderColor: SAND.hairline,
  whiteSpace: "nowrap" as const,
};

const headSx = {
  ...cellSx,
  fontSize: { xs: 10, sm: 10.5 },
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: SAND.faintest,
  fontWeight: 600,
};

/* ------------------------------------------------------------------ */
/* Stake calculator                                                    */
/* ------------------------------------------------------------------ */

/**
 * Bankroll box driving every dollar figure on the board. The headline is what
 * the stake makes on the single best arb, not the sum across all of them: one
 * bankroll goes on one opportunity, and the arbs are alternatives rather than a
 * portfolio. Each card below still prices the same stake on its own legs, for
 * the case where the money is spread.
 */
function StakePanel({
  text,
  onText,
  stake,
  arbs,
  hasNearMisses,
}: {
  text: string;
  onText: (v: string) => void;
  stake: number;
  arbs: Tagged[];
  hasNearMisses: boolean;
}) {
  // Arbs arrive sorted, but pick explicitly so the headline cannot drift from
  // the best card if that ordering ever changes.
  const best = arbs.reduce<Tagged | null>(
    (acc, a) => (acc == null || a.profit_pct > acc.profit_pct ? a : acc),
    null
  );
  // Priced off the legs, not profit_pct, so it matches that arb's card exactly.
  const profit = best ? splitStakes(best.legs, stake).profit : 0;

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: SAND.goldBorder,
        borderRadius: 2,
        bgcolor: "rgba(216,170,120,.035)",
        p: { xs: 1.5, sm: 2 },
        mb: 1.5,
        display: "grid",
        gap: { xs: 1.5, sm: 2 },
        gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
        alignItems: "center",
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: 10.5,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: SAND.faintest,
            mb: 0.85,
          }}
        >
          your stake
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              border: "1px solid",
              borderColor: SAND.goldBorder,
              borderRadius: 1.5,
              bgcolor: "rgba(0,0,0,.25)",
              px: 1.1,
              py: 0.5,
              transition: "border-color .2s",
              "&:focus-within": { borderColor: `${SAND.gold}66` },
            }}
          >
            <Typography sx={{ fontFamily: MONO, fontSize: 16, color: SAND.gold, lineHeight: 1 }}>$</Typography>
            <InputBase
              value={text}
              onChange={(e) => onText(sanitiseStake(e.target.value))}
              placeholder={String(DEFAULT_STAKE)}
              inputProps={{
                inputMode: "decimal",
                "aria-label": "Stake, in dollars",
              }}
              sx={{
                width: { xs: 86, sm: 100 },
                fontFamily: MONO,
                fontSize: 16,
                color: SAND.primary,
                "& input": { p: 0 },
                "& input::placeholder": { color: SAND.faintest, opacity: 1 },
              }}
            />
          </Box>
          {STAKE_PRESETS.map((p) => {
            const active = stake === p;
            return (
              <ButtonBase
                key={p}
                onClick={() => onText(String(p))}
                sx={{
                  fontFamily: MONO,
                  fontSize: 11.5,
                  px: 1,
                  py: 0.6,
                  borderRadius: 1.5,
                  border: "1px solid",
                  borderColor: active ? `${SAND.gold}66` : SAND.hairlineSoft,
                  bgcolor: active ? `${SAND.gold}14` : "transparent",
                  color: active ? SAND.gold : SAND.faint,
                  transition: "border-color .2s, color .2s",
                  "&:hover": { borderColor: `${SAND.gold}44`, color: SAND.gold },
                }}
              >
                {p >= 1000 ? `${p / 1000}k` : p}
              </ButtonBase>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
        {best ? (
          <>
            <Typography
              sx={{
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: { xs: 26, sm: 30 },
                lineHeight: 1,
                color: SAND.gold,
                textShadow: "0 0 24px rgba(216,170,120,.3)",
              }}
            >
              +{money(profit)}
            </Typography>
            <Typography sx={{ fontFamily: MONO, fontSize: 10.5, color: SAND.faintest, mt: 0.5 }}>
              {money(stake)} on {best.venue} R{best.race_number},{" "}
              {arbs.length === 1
                ? "the only arb this sweep"
                : `the best of ${arbs.length} this sweep`}
            </Typography>
            {arbs.length > 1 && (
              <Typography sx={{ fontFamily: MONO, fontSize: 10.5, color: SAND.faintest, mt: 0.25 }}>
                every card below prices the same stake on its own legs
              </Typography>
            )}
          </>
        ) : (
          <Typography sx={{ fontFamily: MONO, fontSize: 11.5, color: SAND.faintest, maxWidth: 260 }}>
            {hasNearMisses
              ? "Nothing confirmed to price this sweep. The stake still splits the near misses below."
              : "Nothing confirmed to price this sweep."}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Arbitrage card                                                      */
/* ------------------------------------------------------------------ */

function ArbCard({
  arb,
  anchorIso,
  stake,
  muted = false,
}: {
  arb: Tagged;
  anchorIso: string;
  stake: number;
  muted?: boolean;
}) {
  const accent = muted ? SAND.faint : SAND.gold;
  const { stakes, payout, profit } = splitStakes(arb.legs, stake);

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: muted ? SAND.hairlineSoft : SAND.goldBorder,
        borderRadius: 2,
        bgcolor: muted ? "transparent" : "rgba(216,170,120,.045)",
        p: { xs: 1.5, sm: 2 },
        ...(muted
          ? {}
          : { boxShadow: "0 0 0 1px rgba(216,170,120,.06), 0 8px 30px -18px rgba(216,170,120,.55)" }),
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1.5,
          flexWrap: "wrap",
          mb: 1.25,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap", mb: 0.4 }}>
            <Pill colour={codeColour(arb.code)} filled>
              {arb.label}
            </Pill>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: 14.5, sm: 16 } }}>
              {arb.venue} R{arb.race_number}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
            {arb.race_name} · scheduled {localStart(arb.scheduled_time, anchorIso)} · {arb.books.length} books
          </Typography>
        </Box>
        <Box sx={{ textAlign: { xs: "left", sm: "right" }, flexShrink: 0 }}>
          <Typography
            sx={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: { xs: 22, sm: 26 },
              lineHeight: 1,
              color: accent,
            }}
          >
            +{money(profit)}
          </Typography>
          <Typography variant="caption" sx={{ color: SAND.faintest, fontFamily: MONO, fontSize: 10.5 }}>
            +{arb.profit_pct.toFixed(2)}% · margin {arb.overround_pct.toFixed(2)}%
          </Typography>
        </Box>
      </Box>

      <Scroller>
        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: 300 }}>
          {/* Fixed percentages: without them the browser spreads five short
              columns evenly and the runner name floats away from its book. */}
          <Box component="thead">
            <Box component="tr">
              <Box component="th" sx={{ ...headSx, textAlign: "right", width: "6%" }}>
                #
              </Box>
              <Box component="th" sx={{ ...headSx, textAlign: "left", width: "40%" }}>
                back
              </Box>
              <Box component="th" sx={{ ...headSx, textAlign: "left", width: "22%" }}>
                with
              </Box>
              <Box component="th" sx={{ ...headSx, textAlign: "right", width: "16%" }}>
                odds
              </Box>
              <Box component="th" sx={{ ...headSx, textAlign: "right", width: "16%" }}>
                stake
              </Box>
            </Box>
          </Box>
          <Box component="tbody">
            {arb.legs.map((leg, i) => (
              <Box component="tr" key={`${leg.number}-${leg.name}`}>
                <Box component="td" sx={{ ...cellSx, textAlign: "right", color: SAND.faintest }}>
                  {leg.number ?? ""}
                </Box>
                <Box
                  component="td"
                  sx={{ ...cellSx, color: SAND.primary, whiteSpace: "normal", minWidth: 96 }}
                >
                  {leg.name}
                </Box>
                <Box component="td" sx={{ ...cellSx, color: SAND.body }}>
                  {bookName(leg.book)}
                </Box>
                <Box component="td" sx={{ ...cellSx, textAlign: "right", color: accent, fontWeight: 700 }}>
                  {leg.odds.toFixed(2)}
                </Box>
                <Box component="td" sx={{ ...cellSx, textAlign: "right", color: SAND.body }}>
                  {money(stakes[i])}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Scroller>

      {/* The point of the split: whichever runner wins, the same amount comes
          back, so the profit is known before the race is run. */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          columnGap: { xs: 0.75, sm: 1.25 },
          rowGap: 0.25,
          mt: 1.1,
          fontFamily: MONO,
          fontSize: { xs: 10.5, sm: 11.5 },
          color: SAND.faintest,
        }}
      >
        <Box component="span">{money(stake)} staked</Box>
        <Box component="span">·</Box>
        <Box component="span">any winner returns {money(payout)}</Box>
        <Box component="span">·</Box>
        <Box component="span" sx={{ color: accent, fontWeight: 700 }}>
          +{money(profit)} locked in
        </Box>
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Price board                                                         */
/* ------------------------------------------------------------------ */

function RaceTable({ race, books, anchorIso }: { race: Race; books: string[]; anchorIso: string }) {
  // Only show columns a book actually priced, so a market covered by two books
  // does not render four empty columns.
  const live = books.filter((b) => race.runners.some((r) => r.odds[b] != null));
  const cols = live.length ? live : books;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        sx={{
          fontFamily: MONO,
          fontSize: { xs: 11.5, sm: 12 },
          color: SAND.tagGold,
          mb: 0.5,
        }}
      >
        R{race.race_number} · {race.canonical_name}
        <Box component="span" sx={{ color: SAND.faintest }}>
          {" "}
          · {localStart(race.scheduled_time, anchorIso, race.start_iso)} · {race.field_size} runners
        </Box>
      </Typography>
      <Scroller>
        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: 260 }}>
          <Box component="thead">
            <Box component="tr">
              <Box component="th" sx={{ ...headSx, textAlign: "left" }}>
                runner
              </Box>
              {cols.map((b) => (
                <Box key={b} component="th" sx={{ ...headSx, textAlign: "right" }}>
                  {bookName(b)}
                </Box>
              ))}
            </Box>
          </Box>
          <Box component="tbody">
            {race.runners.map((r) => {
              const priced = cols.map((b) => r.odds[b]).filter((o): o is number => o != null);
              const best = priced.length ? Math.max(...priced) : null;
              return (
                <Box component="tr" key={`${r.number}-${r.canonical_name}`}>
                  <Box
                    component="td"
                    sx={{ ...cellSx, color: SAND.primary, whiteSpace: "normal", minWidth: 110 }}
                  >
                    {r.number != null && (
                      <Box component="span" sx={{ color: SAND.faintest, mr: 0.75 }}>
                        {r.number}
                      </Box>
                    )}
                    {r.canonical_name}
                  </Box>
                  {cols.map((b) => {
                    const odds = r.odds[b];
                    const isBest = odds != null && best != null && odds === best && priced.length > 1;
                    return (
                      <Box
                        key={b}
                        component="td"
                        sx={{
                          ...cellSx,
                          textAlign: "right",
                          color: odds == null ? SAND.faintest : isBest ? SAND.gold : SAND.body,
                          fontWeight: isBest ? 700 : 400,
                        }}
                      >
                        {odds == null ? "-" : odds.toFixed(2)}
                      </Box>
                    );
                  })}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Scroller>
    </Box>
  );
}

function VenueRow({
  venue,
  books,
  anchorIso,
  open,
  onToggle,
}: {
  venue: BoardVenue;
  books: string[];
  anchorIso: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Box sx={{ borderBottom: "1px solid", borderColor: SAND.hairline }}>
      <ButtonBase
        onClick={onToggle}
        sx={{
          width: "100%",
          justifyContent: "space-between",
          textAlign: "left",
          px: { xs: 1, sm: 1.5 },
          py: 1.1,
          borderRadius: 1,
          "&:hover": { bgcolor: "rgba(255,255,255,.02)" },
        }}
      >
        <Box sx={{ minWidth: 0, pr: 1 }}>
          <Typography sx={{ fontSize: { xs: 13.5, sm: 14.5 }, fontWeight: 600 }}>{venue.venue}</Typography>
          <Typography variant="caption" sx={{ color: SAND.faintest, fontFamily: MONO, fontSize: 10.5 }}>
            {venue.races.length} {venue.races.length === 1 ? "market" : "markets"}
          </Typography>
        </Box>
        <ExpandMoreIcon
          sx={{
            color: SAND.faint,
            fontSize: 20,
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform .2s ease",
          }}
        />
      </ButtonBase>
      {/* unmountOnExit keeps ~1500 runner rows out of the DOM until asked for. */}
      <Collapse in={open} unmountOnExit>
        <Box sx={{ px: { xs: 1, sm: 1.5 }, pb: 1.5, pt: 0.5 }}>
          {venue.races.map((race) => (
            <RaceTable key={race.race_number} race={race} books={books} anchorIso={anchorIso} />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Shell states                                                        */
/* ------------------------------------------------------------------ */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: SAND.goldBorder,
        borderRadius: 3,
        bgcolor: "background.paper",
        backgroundImage: `radial-gradient(120% 120% at 100% 0%, ${SAND.gold}14 0%, transparent 55%)`,
        p: { xs: 2, sm: 2.5 },
      }}
    >
      {children}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Board                                                               */
/* ------------------------------------------------------------------ */

export default function ArbLiveBoard() {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  // A 503 because nothing has cleared the delay yet is not an outage, and must
  // not be dressed as one: the engine is working, the first board is just still
  // serving out its wait.
  const [warming, setWarming] = useState(false);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const [pick, setPick] = useState<string | null>(null);
  const [openVenue, setOpenVenue] = useState<string | null>(null);
  const [showAllArbs, setShowAllArbs] = useState(false);
  const [showUnverified, setShowUnverified] = useState(false);
  // Kept as text so the box can be cleared while typing; an empty or zero
  // amount just falls back to the $100 basis the engine's report uses.
  const [stakeText, setStakeText] = useState(() => {
    try {
      return window.localStorage.getItem(STAKE_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const inFlight = useRef(false);
  const openedFor = useRef<string | null>(null);

  const load = useCallback(async (fresh: boolean) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setWarming(false);
    try {
      const resp = await fetch(`${API_BASE}/latest`, fresh ? { cache: "no-store" } : undefined);
      if (!resp.ok) {
        if (resp.status === 503) {
          // The service reports both the delay it is enforcing and how long
          // until the first sweep clears it, so say that rather than "soon".
          const info = await resp.json().catch(() => null);
          const delay = info?.delay_minutes ?? DELAY_MIN;
          const mins = info?.next_publish_in ? Math.ceil(info.next_publish_in / 60) : null;
          setWarming(true);
          throw new Error(
            `Sweeps are published on a ${delay} minute delay, and nothing has cleared it yet` +
              (mins ? `. The first board is about ${mins} min away.` : "."),
          );
        }
        // The feed is rate limited, so say so plainly rather than showing a
        // bare status code. It rebuilds every 15 minutes; a wait costs nothing.
        if (resp.status === 429) {
          const { message, until } = await readRateLimit(resp);
          const wait = until ? formatWait(Math.ceil((until - Date.now()) / 1000)) : null;
          throw new Error(wait ? `${message} Try again in ${wait}.` : message);
        }
        throw new Error(`The feed returned ${resp.status}.`);
      }
      setSnap((await resp.json()) as Snapshot);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reach the feed.");
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(Date.now());
      // A snapshot is served once it has aged past the delay and is replaced one
      // sweep interval later, so the copy on screen is due when it passes both.
      // Only while the tab is actually being looked at.
      if (document.visibilityState !== "visible" || !snap) return;
      const age = Date.now() - Date.parse(snap.generated_at);
      const due = (snap.delay_minutes ?? DELAY_MIN) + INTERVAL_MIN + 0.5;
      if (age > due * 60_000) load(true);
    }, 30_000);
    return () => window.clearInterval(id);
  }, [snap, load]);

  useEffect(() => {
    if (!snap || pick) return;
    const withArbs = snap.disciplines.find((d) => d.arbitrage.candidates.length > 0);
    setPick((withArbs ?? snap.disciplines[0])?.code ?? null);
  }, [snap, pick]);

  // Open one meeting of whichever market is selected, so the board shows actual
  // prices rather than a wall of collapsed rows. Pick the best-covered meeting
  // rather than the first alphabetically: plenty of meetings are priced by a
  // single book, and one lonely column does not show what the board is for.
  // Keyed on the market so a 15-minute refresh does not slam shut whatever the
  // reader had open.
  useEffect(() => {
    if (!snap || !pick || openedFor.current === pick) return;
    openedFor.current = pick;
    const board = snap.disciplines.find((d) => d.code === pick)?.board ?? [];
    const coverage = (v: BoardVenue) => {
      const books = new Set<string>();
      v.races.forEach((r) => r.runners.forEach((run) => Object.keys(run.odds).forEach((b) => books.add(b))));
      return books.size;
    };
    const best = board.reduce<BoardVenue | null>(
      (acc, v) => (acc == null || coverage(v) > coverage(acc) ? v : acc),
      null
    );
    setOpenVenue(best ? `${pick}:${best.venue}` : null);
  }, [snap, pick]);

  const arbs = useMemo<Tagged[]>(
    () =>
      (snap?.disciplines ?? [])
        .flatMap((d) => d.arbitrage.candidates.map((c) => ({ ...c, code: d.code, label: d.label })))
        .sort((a, b) => b.profit_pct - a.profit_pct),
    [snap]
  );

  const unverified = useMemo<Tagged[]>(
    () =>
      (snap?.disciplines ?? [])
        .flatMap((d) => d.arbitrage.unverified.map((c) => ({ ...c, code: d.code, label: d.label })))
        .sort((a, b) => b.profit_pct - a.profit_pct),
    [snap]
  );

  const stake = useMemo(() => {
    const parsed = Number.parseFloat(stakeText);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_STAKE;
  }, [stakeText]);

  const setStake = useCallback((v: string) => {
    setStakeText(v);
    try {
      window.localStorage.setItem(STAKE_KEY, v);
    } catch {
      /* private browsing, or storage full: the stake just resets on reload */
    }
  }, []);

  const missing = useMemo(() => {
    const books = new Set<string>();
    (snap?.disciplines ?? []).forEach((d) => d.books_failed.forEach((b) => books.add(b)));
    return Array.from(books);
  }, [snap]);

  if (loading && !snap) {
    return (
      <Shell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
          <CircularProgress size={16} sx={{ color: SAND.gold }} />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Loading the latest sweep...
          </Typography>
        </Box>
      </Shell>
    );
  }

  if (!snap) {
    return (
      <Shell>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: "0.1em",
                color: warming ? SAND.tagGold : SAND.faint,
              }}
            >
              {warming ? "WAITING OUT THE DELAY" : "FEED UNAVAILABLE"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              {error ?? "Could not reach the feed."}{" "}
              {warming
                ? "Nothing here is published as it is found, so the engine sweeps for a while before the first board can appear. The rest of this page explains how it works."
                : "The engine itself runs on a schedule, so this is usually a short outage. The rest of this page explains how it works."}
            </Typography>
          </Box>
          <IconButton onClick={() => load(true)} sx={{ color: SAND.gold }} aria-label="Retry">
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>
      </Shell>
    );
  }

  // Age is measured from the sweep, so a healthy board always reads at least
  // `delayMin` old: staleness only starts once it has also missed a sweep.
  const delayMin = snap.delay_minutes ?? DELAY_MIN;
  const age = now - Date.parse(snap.generated_at);
  const stale = age > (delayMin + INTERVAL_MIN + 2) * 60_000;
  const nextIn = Math.max(0, Math.round(((delayMin + INTERVAL_MIN) * 60_000 - age) / 60_000));
  const sweptAt = new Date(snap.generated_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const selected = snap.disciplines.find((d) => d.code === pick) ?? null;
  const shownArbs = showAllArbs ? arbs : arbs.slice(0, ARB_PREVIEW);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5 } }}>
      {/* ---- status + headline numbers ---- */}
      <Shell>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            // Deliberately not wrapping: a flex row wraps before it shrinks, so
            // letting this one wrap would drop the refresh button onto its own
            // line at 390px. The status block below wraps internally instead.
            flexWrap: "nowrap",
            mb: 2,
          }}
        >
          {/* Grows and wraps internally so the longer DELAYED pill folds the
              caption onto a second line at 390px instead of pushing the refresh
              button onto one of its own. */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
              flex: "1 1 auto",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                flexShrink: 0,
                bgcolor: stale ? SAND.faint : "#7ddba0",
                boxShadow: stale ? "none" : "0 0 0 4px rgba(125,219,160,.14)",
                animation: stale ? "none" : "arbPulse 2.4s ease-in-out infinite",
                "@keyframes arbPulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.35 },
                },
              }}
            />
            <Typography
              sx={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: "0.12em", color: stale ? SAND.faint : "#7ddba0" }}
            >
              {stale ? "STALE" : `DELAYED ${delayMin} MIN`}
            </Typography>
            <Typography variant="caption" sx={{ color: SAND.faintest }}>
              swept {relativeAge(age)}
              {!stale && nextIn > 0 ? `, next in ~${nextIn} min` : ""}
            </Typography>
          </Box>
          <Tooltip title="Fetch the newest published sweep">
            <span>
              <IconButton
                onClick={() => load(true)}
                disabled={loading}
                size="small"
                sx={{ color: SAND.gold }}
                aria-label="Refresh the board"
              >
                {loading ? <CircularProgress size={15} sx={{ color: SAND.gold }} /> : <RefreshIcon fontSize="small" />}
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* The delay is the single most important thing to know about this
            board, so it gets a standing banner and not just the pill above.
            Reads the figure off the payload rather than a constant: the service
            owns the delay, and the page should not be able to claim a different
            one from the one it is actually being served under. */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.25,
            p: { xs: 1.25, sm: 1.5 },
            mb: { xs: 2, sm: 2.5 },
            borderRadius: 1,
            border: `1px solid ${SAND.goldBorder}`,
            borderLeft: `3px solid ${SAND.gold}`,
            bgcolor: "rgba(216,170,120,.05)",
          }}
        >
          <ScheduleIcon sx={{ fontSize: 17, color: SAND.gold, mt: "2px", flexShrink: 0 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.12em", color: SAND.tagGold }}
            >
              DELAYED BY {delayMin} MINUTES
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Every sweep is held for {delayMin} minutes before this page will serve it, prices and
              arbitrage together. What follows is the market as it stood at {sweptAt}, not as it is
              now: those odds have moved, and any edge in them is long gone.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: { xs: 2, sm: 3 },
            gridTemplateColumns: { xs: "1fr", sm: "minmax(140px, 0.7fr) 1fr" },
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: { xs: 44, sm: 56 },
                lineHeight: 1,
                color: snap.totals.arbitrage > 0 ? SAND.gold : SAND.faint,
                textShadow: snap.totals.arbitrage > 0 ? "0 0 28px rgba(216,170,120,.35)" : "none",
              }}
            >
              {snap.totals.arbitrage}
            </Typography>
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: 11.5,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: snap.totals.arbitrage > 0 ? SAND.tagGold : SAND.faintest,
                mt: 0.5,
              }}
            >
              arbitrage found
            </Typography>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            <MiniStat value={snap.totals.disciplines} label="markets" />
            <MiniStat value={snap.totals.venues} label="meetings" />
            <MiniStat value={snap.totals.races} label="events priced" />
          </Box>
        </Box>

        <Typography
          variant="caption"
          sx={{ color: SAND.faintest, fontFamily: MONO, fontSize: 10.5, display: "block", mt: 2 }}
        >
          {snap.sweeps.map((s) => `${s.name.replace("_", " ")} ${s.seconds.toFixed(1)}s`).join("  ·  ")}
          {"  ·  total "}
          {snap.duration_seconds.toFixed(1)}s
        </Typography>
        {missing.length > 0 && (
          <Typography variant="caption" sx={{ color: SAND.faint, display: "block", mt: 0.75 }}>
            {missing.map(bookName).join(", ")} did not answer on every market this sweep, so some boards
            below run on fewer books.
          </Typography>
        )}
      </Shell>

      {/* ---- arbitrage, first ---- */}
      <Box>
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: 11.5,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: SAND.gold,
            mb: 1.25,
          }}
        >
          {"// confirmed arbitrage"}
        </Typography>
        {(arbs.length > 0 || unverified.length > 0) && (
          <StakePanel
            text={stakeText}
            onText={setStake}
            stake={stake}
            arbs={arbs}
            hasNearMisses={unverified.length > 0}
          />
        )}
        {arbs.length === 0 ? (
          <Box
            sx={{
              border: "1px dashed",
              borderColor: SAND.hairlineSoft,
              borderRadius: 2,
              p: { xs: 2, sm: 2.5 },
            }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Nothing above the margin threshold in this sweep. That is the normal state: the books agree
              most of the time, and the gaps that do open close within minutes. The full price board is
              below.
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {shownArbs.map((arb) => (
                <ArbCard
                  key={`${arb.code}-${arb.venue}-${arb.race_number}`}
                  arb={arb}
                  anchorIso={snap.generated_at}
                  stake={stake}
                />
              ))}
            </Box>
            {arbs.length > ARB_PREVIEW && (
              <ButtonBase
                onClick={() => setShowAllArbs((v) => !v)}
                sx={{
                  mt: 1.5,
                  fontFamily: MONO,
                  fontSize: 12,
                  color: SAND.gold,
                  px: 1,
                  py: 0.75,
                  borderRadius: 1,
                }}
              >
                {showAllArbs ? "show fewer" : `show all ${arbs.length}`}
              </ButtonBase>
            )}
          </>
        )}
      </Box>

      {/* ---- near misses ---- */}
      {unverified.length > 0 && (
        <Box>
          <ButtonBase
            onClick={() => setShowUnverified((v) => !v)}
            sx={{
              fontFamily: MONO,
              fontSize: 11.5,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: SAND.faint,
              px: 0,
              gap: 0.5,
            }}
          >
            {`// ${unverified.length} unverified candidate${unverified.length === 1 ? "" : "s"}`}
            <ExpandMoreIcon
              sx={{ fontSize: 18, transform: showUnverified ? "rotate(180deg)" : "none", transition: "transform .2s" }}
            />
          </ButtonBase>
          <Collapse in={showUnverified} unmountOnExit>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 1, mb: 1.5 }}>
              These clear the maths but not the coverage gate: fewer than two books priced the full live
              field, so a runner is missing rather than cheap. They are shown for completeness, not as
              trades.
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {unverified.map((arb) => (
                <ArbCard
                  key={`${arb.code}-${arb.venue}-${arb.race_number}`}
                  arb={arb}
                  anchorIso={snap.generated_at}
                  stake={stake}
                  muted
                />
              ))}
            </Box>
          </Collapse>
        </Box>
      )}

      {/* ---- per-market stats, doubling as the board selector ---- */}
      <Box>
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: 11.5,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: SAND.cool,
            mb: 1.25,
          }}
        >
          {"// everything else it pulled"}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 1,
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(5, 1fr)" },
          }}
        >
          {snap.disciplines.map((d) => {
            const active = d.code === pick;
            const colour = codeColour(d.code);
            return (
              <ButtonBase
                key={d.code}
                onClick={() => setPick(d.code)}
                sx={{
                  display: "block",
                  textAlign: "left",
                  p: 1.25,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: active ? `${colour}66` : SAND.hairlineSoft,
                  bgcolor: active ? `${colour}12` : "transparent",
                  transition: "border-color .2s, background-color .2s",
                  "&:hover": { borderColor: `${colour}44` },
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: active ? colour : SAND.primary }}>
                  {d.label}
                </Typography>
                <Typography sx={{ fontFamily: MONO, fontSize: 10.5, color: SAND.faintest, mt: 0.35 }}>
                  {d.races} events · {d.venues} meets
                </Typography>
                <Typography sx={{ fontFamily: MONO, fontSize: 10.5, color: SAND.faintest }}>
                  {d.books_fetched.length} books
                  {d.arbitrage.candidates.length > 0 && (
                    <Box component="span" sx={{ color: SAND.gold }}>
                      {" "}
                      · {d.arbitrage.candidates.length} arb
                      {d.arbitrage.candidates.length === 1 ? "" : "s"}
                    </Box>
                  )}
                </Typography>
              </ButtonBase>
            );
          })}
        </Box>
      </Box>

      {/* ---- the full cross-book price board ---- */}
      {selected && (
        <Shell>
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 1,
              flexWrap: "wrap",
              mb: 1,
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: { xs: 15, sm: 17 } }}>
              {selected.label} price board
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {selected.books_fetched.map((b) => (
                <Pill key={b} colour={SAND.tagGold}>
                  {bookName(b)}
                </Pill>
              ))}
              {selected.books_failed.map((b) => (
                <Pill key={b} colour={SAND.faintest}>
                  {bookName(b)} down
                </Pill>
              ))}
            </Box>
          </Box>
          <Typography variant="caption" sx={{ color: SAND.faintest, display: "block", mb: 1 }}>
            Every runner the engine matched across books, best price in gold. Open a meeting to see its
            markets.
          </Typography>
          <Box sx={{ borderTop: "1px solid", borderColor: SAND.hairline }}>
            {selected.board.map((venue) => {
              const key = `${selected.code}:${venue.venue}`;
              return (
                <VenueRow
                  key={key}
                  venue={venue}
                  books={selected.books_fetched}
                  anchorIso={selected.generated_at}
                  open={openVenue === key}
                  onToggle={() => setOpenVenue((cur) => (cur === key ? null : key))}
                />
              );
            })}
            {selected.board.length === 0 && (
              <Typography variant="body2" sx={{ color: "text.secondary", py: 2 }}>
                No meetings inside the lookahead window for this market right now.
              </Typography>
            )}
          </Box>
        </Shell>
      )}

      <Typography variant="caption" sx={{ color: SAND.faintest }}>
        Odds as read at {sweptAt}, straight from each bookmaker's public feed, and published {delayMin}{" "}
        minutes later. Treat everything here as a record rather than a quote: the stake figures assume you
        get on at every leg at the price shown, which real bet limits and price changes will not always
        allow, and on a {delayMin} minute delay they will not still be on offer. Nothing on this page places
        a bet.
      </Typography>
    </Box>
  );
}
