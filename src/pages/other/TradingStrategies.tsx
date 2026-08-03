import { Box } from "@mui/material";
import MarkdownBlock from "../../components/MarkdownBlock";
import {
  PageHeader,
  GradientText,
  Reveal,
  SectionHeading,
  Panel,
  Callout,
  CheckList,
  StatRow,
  FeatureCard,
  CardGrid,
  PageNav,
} from "../../components/design";
import { SectionNavLayout, Section } from "../../components/SectionNav";

const ACCENT = "#d8aa78";

const SECTIONS: Section[] = [
  { id: "phases", label: "Three phases" },
  { id: "universe", label: "The universe" },
  { id: "bars", label: "Minute bars" },
  { id: "disk", label: "On disk" },
  { id: "next", label: "What is next" },
];

/**
 * The three phases, each with its own dataset. Rendered as a card row rather
 * than a list because the ordering matters: the first two phases can be
 * repeated freely, and the third deliberately cannot.
 */
const phases = [
  {
    n: "01",
    title: "Test",
    blurb:
      "Build and tune a candidate against the test set alone. Every knob is allowed to move here, refitting is free, and the same data can be run over as many times as it takes to get to something worth checking.",
  },
  {
    n: "02",
    title: "Validate",
    blurb:
      "Run the candidate against a second dataset the tuning never touched. This phase is repeatable too, as many attempts as it takes, with one rule: it only ever happens after the test phase, never as a substitute for it.",
  },
  {
    n: "03",
    title: "Run",
    blurb:
      "One pass, once. The run set is held back to the very end, and whatever it returns is the estimate of how effective the strategy would actually have been. There is no second attempt to average away a bad result, which is the whole point.",
  },
];

// The order of the phases and, more importantly, which of them can be
// repeated. Drawn without dates because the cut points between the three
// datasets are part of the design still being settled.
const splitDiagram = `\`\`\`text
  01 test  ----------->  02 validate  ----------->  03 run
  repeatable             repeatable, but only       single shot
  tune, refit and        ever after the test        one pass, held
  iterate as often       phase, on a dataset        back to the end:
  as you like            the tuning never saw       the honest number
\`\`\``;

const overfitting = [
  "With 633 million minute bars, a rule that looks profitable on the data it was fitted to is the default outcome, not a discovery. Enough parameter sweeps will always surface one.",
  "Keeping the three datasets physically separate is what gives overfitting somewhere to be caught. A strategy that survives the test set and dies on validation has told you something useful.",
  "The run set is the one that only gets used once. A held-back dataset you can go back to is just another tuning set, so the single pass is what keeps its result meaningful rather than shopped for.",
  "Costs decide whether an intraday edge exists at all: spread, commission and slippage are modelled from the start rather than bolted on after a result looks good.",
  "Split adjustment is essential at this resolution, since an unadjusted split puts a fake fifty percent gap in the series. Dividend adjustment matters far less intraday, so the store is split-adjusted only.",
];

const universe = [
  "Backtesting the past against today's index members is survivorship bias: the companies that fell out of the index are invisible, and what remains is a list selected for having survived.",
  "Wikipedia publishes both the current constituents and a table of additions and removals, so membership is reconstructed over the window and the union of everyone who was ever a member gets ingested.",
  "That recovers 720 tickers from 503 current members across 241 index changes since 2016, so 217 symbols that today's list would quietly hide are in the store.",
  "The reconstruction is written out alongside the data as JSON and CSV, so a later backtest can ask which tickers were members on a given date rather than assuming the union.",
];

const ingest = [
  "The SIP consolidated tape, not IEX. Alpaca's free plan serves full SIP for historical requests, while the IEX feed carries roughly two percent of consolidated volume, which makes any volume-derived signal built on it meaningless.",
  "One Parquet file per symbol-year, so a job measured in hours is resumable: completed files are skipped on a rerun, and the run only ever has one file in flight per worker.",
  "Writes go to a temp file and are atomically replaced, so an interrupted run leaves no truncated Parquet behind to be silently read later as a short year.",
  "A shared sliding-window rate limiter keeps the whole thread pool under the plan's 200 requests per minute, because a single stream only reaches about two thirds of the request budget.",
  "The half-open interval is enforced client side: Alpaca treats the end of a window as inclusive, so a boundary bar can be returned twice across adjacent years.",
  "One bad symbol never kills the run. Failures are captured per symbol-year and summarised in a manifest with the status counts, so a multi-hour job reports rather than aborts.",
];

const runResult = [
  "7,920 symbol-years attempted, 7,033 written, 868 empty and 19 skipped, with zero failures.",
  "The 868 empty results are expected, not errors: delisted tickers in the years before they listed or after they were acquired.",
  "633,307,223 bars in 375 minutes, about 17 GB of zstd-compressed Parquet.",
];

const nextUp = [
  "The strategy engine and backtester: a bar-replay loop with costs, position sizing and a metrics summary, running against the Parquet store rather than in memory.",
  "The harness itself, which enforces the phase boundaries in code, so the order holds and the run set cannot be read a second time by accident.",
  "A processed layer, currently an empty directory, for the resampled and feature-augmented views that a strategy actually reads.",
  "Reserved directories for a Dukascopy FX feed and a second historical vendor, so the same three phase process can be pointed at another asset class without reshaping the store.",
];

const layout = `\`\`\`text
DATA_ROOT/                       (a data drive, deliberately outside the repo)
  meta/
    sp500_universe.json          ever-members, with the source and window
    sp500_current.csv            today's constituents
    sp500_changes.csv            additions and removals since 2016
    alpaca_ingest_manifest.json  status counts, bar total, failures
  raw/
    alpaca/1min_split/<TICKER>/<TICKER>_<YEAR>_1min.parquet
    dukascopy/                   reserved, FX
    hfdatalibrary/               reserved, second vendor
  processed/                     resampled and feature views, not built yet
  logs/
\`\`\``;

export default function OtherTradingStrategies() {
  return (
    <SectionNavLayout sections={SECTIONS}>
      <Box
        component="section"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: { xs: 3, sm: 4 },
          pb: 4,
        }}
      >
        <PageHeader
          eyebrow="research"
          title={<>Trading <GradientText>Strategies</GradientText></>}
          subtitle="A harness for learning how trading strategies are actually tested, built around a three phase process where each phase gets its own dataset. The point is method, not returns: a strategy has to survive data it was never fitted to before it is worth believing."
        />

        <Reveal delay={0.06}>
          <Panel accent={ACCENT} wash>
            <StatRow
              items={[
                { value: "633M", label: "1-minute bars" },
                { value: "720", label: "symbols, ever-members" },
                { value: "11", label: "years, 2016 to 2026" },
                { value: "17 GB", label: "compressed Parquet" },
              ]}
            />
          </Panel>
          <Callout accent={ACCENT} title="status">
            Early proof of concept. The data foundation is built and has run end to end: the
            point-in-time universe and the full minute-bar ingest. The three phase harness and the
            strategy engine are design, not code, so nothing has been backtested yet and there are
            no results to report.
          </Callout>
        </Reveal>

        <Reveal delay={0.12}>
          <MarkdownBlock>
            {`This is a learning project. The interesting problem in retail backtesting is not writing the strategy, it is not fooling yourself once it looks like it works: with enough data and enough parameters, something will always fit. So the structure came first, before any strategy, and it is the part worth describing.`}
          </MarkdownBlock>
        </Reveal>

        <Reveal delay={0.18} id="phases">
          <SectionHeading eyebrow="process">Three phases, three datasets</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            Every idea moves through the same three phases in order, and each phase reads its own
            slice of history. The first two are repeatable as often as you like, and the third
            deliberately is not: the run set is held back for a single pass at the end, so the
            number it gives back has not been shopped for.
          </Box>
          <CardGrid>
            {phases.map((p) => (
              <FeatureCard
                key={p.n}
                accent={ACCENT}
                title={
                  <Box component="span">
                    <Box component="span" sx={{ color: ACCENT, mr: 1 }}>{p.n}</Box>
                    {p.title}
                  </Box>
                }
                blurb={p.blurb}
              />
            ))}
          </CardGrid>
          <Box sx={{ mt: 2.5 }}>
            <Panel accent={ACCENT}>
              <MarkdownBlock>{splitDiagram}</MarkdownBlock>
            </Panel>
          </Box>
          <Box sx={{ mt: 2.5 }}>
            <SectionHeading eyebrow="why">What the split is defending against</SectionHeading>
            <CheckList items={overfitting} accent={ACCENT} />
          </Box>
        </Reveal>

        <Reveal delay={0.24} id="universe">
          <SectionHeading eyebrow="data">Which symbols even count</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            Before any bars are fetched, the universe has to be decided, and the obvious choice is
            the wrong one:
          </Box>
          <CheckList items={universe} accent={ACCENT} />
        </Reveal>

        <Reveal delay={0.3} id="bars">
          <SectionHeading eyebrow="ingest">Getting 633 million bars down</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            One-minute bars for every ever-member, 2016 to date, pulled from Alpaca. At this size
            the interesting decisions are all about the run surviving itself:
          </Box>
          <CheckList items={ingest} accent={ACCENT} />
          <Box sx={{ mt: 2.5 }}>
            <Panel accent={ACCENT} wash>
              <CheckList items={runResult} accent={ACCENT} />
            </Panel>
          </Box>
        </Reveal>

        <Reveal delay={0.36} id="disk">
          <SectionHeading eyebrow="storage">On disk</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            The bulk data lives on a separate drive pointed at by an environment variable, never
            inside the repository, so the repo stays a few hundred kilobytes of code while the store
            grows into the tens of gigabytes.
          </Box>
          <Panel accent={ACCENT}>
            <MarkdownBlock>{layout}</MarkdownBlock>
          </Panel>
        </Reveal>

        <Reveal delay={0.42} id="next">
          <SectionHeading eyebrow="roadmap">What is next</SectionHeading>
          <CheckList items={nextUp} accent={ACCENT} />
        </Reveal>

        <PageNav
          left={{ text: "Date Picker", link: "/other/date-picker" }}
          right={{ text: "Projects", link: "/projects" }}
        />
      </Box>
    </SectionNavLayout>
  );
}
