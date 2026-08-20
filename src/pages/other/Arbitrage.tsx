import { Box } from "@mui/material";
import MarkdownBlock from "../../components/MarkdownBlock";
import ArbLiveBoard from "../../components/ArbLiveBoard";
import {
  PageHeader,
  GradientText,
  Reveal,
  SectionHeading,
  Panel,
  Callout,
  CheckList,
  StatRow,
  PageNav,
} from "../../components/design";
import { SectionNavLayout, Section } from "../../components/SectionNav";

const ACCENT = "#d8aa78";

const SECTIONS: Section[] = [
  { id: "live", label: "Delayed board" },
  { id: "idea", label: "The idea" },
  { id: "coverage", label: "Books & sports" },
  { id: "pipeline", label: "The pipeline" },
  { id: "maths", label: "The maths" },
  { id: "output", label: "The output" },
  { id: "safeguards", label: "Guardrails" },
];

const ideaPoints = [
  "Every bookmaker prices the same event a little differently, and each builds in a margin (the overround) so the book tilts in its favour.",
  "Take just the single best price on each outcome across every book, and that combined margin can, occasionally, tip the other way.",
  "When it does, a stake split across the outcomes returns more than it cost, whatever the result. That gap is the arbitrage.",
  "These windows are small and short-lived, so the whole point is to spot them fast, automatically, before the prices move.",
];

const coveragePoints = [
  "Seven Australian bookmakers: TAB, Sportsbet, Ladbrokes, PointsBet, Palmerbet, Unibet and betr.",
  "Racing across all three codes in a single run: thoroughbred, harness and greyhound, each aligned and stored on its own.",
  "Head-to-head sport as well: tennis, soccer, rugby league, Aussie rules, basketball and baseball, matched on the two teams rather than a venue and field, reusing the same align to detect to output spine unchanged.",
  "Each bookmaker's endpoints are captured as a documented per-book recipe, so wiring up the next book stays a contained job.",
];

const pipelinePoints = [
  "Fetching: each bookmaker's own JSON API is read directly with an HTTP client, no screenshots and no OCR. Six of the seven books answer cold; only TAB needs a real browser driven over the debugging protocol, and the engine falls back to the other six if it is unavailable.",
  "Alignment: runners are matched across books deterministically, on venue, race number and saddlecloth for racing or on the unordered player pair for tennis, so the same runner lands in one row with a price column per book despite naming differences.",
  "Detection: pure Python picks the best price per runner, tests the arbitrage condition against the full live field, and only confirms an edge when at least two books price every runner.",
  "Output: every run is written to a timestamped folder as machine-readable JSON and a human-first markdown report, alongside a rolling latest digest and a colour-coded terminal verdict.",
];

const outputPoints = [
  "summary.json: the verdict, counts and the legs of any confirmed arbitrage, ready for another script to read.",
  "aligned.json: the full cross-book table, every runner with a price column per bookmaker.",
  "odds.md: an opportunity-first report that leads with confirmed arbitrage and names which book to back each leg with, then unverified candidates, then the tightest remaining markets.",
  "A combined digest that overwrites a stable latest file and keeps a timestamped history, scoped per sport so racing and tennis never collide, with old runs pruned automatically.",
];

const safeguards = [
  "It never places a bet. The output is a set of instructions: which runner, which bookmaker, what stake, and the expected return.",
  "It only ever reads public endpoints, with no vision model, no LLM and no API keys anywhere in the loop.",
  "A confirmed arbitrage needs at least two books pricing the full live field; a single-book runner or a missing price files the market as an unverified candidate rather than a trade.",
  "Odds are timestamped, since an opportunity is only real for as long as the prices behind it hold.",
  "Nothing is published as it is found. Every sweep is held for 30 minutes before the feed will serve it, prices and arbitrage together, so the public board is a record of a market that has already moved rather than a live edge.",
];

const pipelineDiagram = `\`\`\`text
bookmaker JSON APIs
     |  direct HTTP fetch (TAB via a real browser)
     v
raw odds, per bookmaker
     |  align runners across books
     v
best price per runner
     |  arbitrage maths + coverage gate
     v
ranked opportunities + per-runner stake split
     |  write JSON + markdown + digest
     v
timestamped run folder
\`\`\``;

const mathsBlock = `\`\`\`text
implied_prob(runner) = 1 / best_odds(runner)
overround            = sum of implied_prob over all runners

arbitrage exists when  overround < 1.0
profit margin          = (1 - overround) / overround
stake(runner)          = bankroll * implied_prob(runner) / overround
\`\`\``;

export default function OtherArbitrage() {
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
          eyebrow="engine"
          title={<>Arbitrage <GradientText>Engine</GradientText></>}
          subtitle="A read-only engine that scans betting odds across seven Australian bookmakers, over racing and five other sports, and flags arbitrage: the rare moments when backing every outcome at the best price on offer locks in a profit no matter the result. It works out exactly what to stake where, and never places a bet itself. The board below is its actual output, swept every 15 minutes and published half an hour after the fact."
        />

        <Reveal delay={0.06} id="live">
          <SectionHeading eyebrow="delayed 30 min">Half an hour ago</SectionHeading>
          <ArbLiveBoard />
        </Reveal>

        <Reveal delay={0.12}>
          <Panel accent={ACCENT} wash>
            <StatRow
              items={[
                { value: "6", label: "books live" },
                { value: "15 min", label: "sweep cadence" },
                { value: "30 min", label: "publish delay" },
                { value: "Read-only", label: "never bets" },
              ]}
            />
          </Panel>
          <Box sx={{ mt: 2 }}>
            <Callout accent={ACCENT} title="status">
              Running against live markets from a small Sydney server, rebuilding the board on a fixed
              15 minute cycle. Every sweep is then held for 30 minutes before it is served, board and
              arbitrage alike, so what is published here is a record of a market that has already moved
              rather than a tradeable price. Six of the seven bookmakers answer a plain HTTP client and
              are in the hosted feed; TAB needs a real browser, so it stays on the local runs for now.
              The source is kept private.
            </Callout>
          </Box>
        </Reveal>

        <Reveal delay={0.18} id="idea">
          <SectionHeading eyebrow="the idea">What arbitrage is</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            Bookmakers compete, and they do not all agree on what an outcome is worth. Now and then the
            best price on each outcome, taken across the whole market, is generous enough to guarantee a
            profit:
          </Box>
          <CheckList items={ideaPoints} accent={ACCENT} />
        </Reveal>

        <Reveal delay={0.24} id="coverage">
          <SectionHeading eyebrow="what it scans">Books and sports</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            The more books and markets it watches, the more often the prices line up into an edge. It
            started on three racing books and has grown from there:
          </Box>
          <CheckList items={coveragePoints} accent={ACCENT} />
        </Reveal>

        <Reveal delay={0.3} id="pipeline">
          <SectionHeading eyebrow="how it works">The pipeline</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            Four stages take it from a bookmaker's API to a ranked list of opportunities, with the odds
            never leaving the machine:
          </Box>
          <CheckList items={pipelinePoints} accent={ACCENT} />
          <Box sx={{ mt: 2.5 }}>
            <Panel accent={ACCENT}>
              <MarkdownBlock>{pipelineDiagram}</MarkdownBlock>
            </Panel>
          </Box>
        </Reveal>

        <Reveal delay={0.36} id="maths">
          <SectionHeading eyebrow="the maths">Finding the edge</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            The detection itself is textbook and needs no model. Turn each best price into an implied
            probability, add them up, and if the total comes in under one, an arbitrage exists and the
            same numbers give the stake split:
          </Box>
          <Panel accent={ACCENT}>
            <MarkdownBlock>{mathsBlock}</MarkdownBlock>
          </Panel>
          <Box sx={{ mt: 2 }}>
            <Callout accent={ACCENT} title="only real edges">
              Only opportunities above a minimum margin are reported. Anything thinner is noise once
              you allow for prices drifting between reading them and placing the bet.
            </Callout>
          </Box>
        </Reveal>

        <Reveal delay={0.42} id="output">
          <SectionHeading eyebrow="the output">What it hands back</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            Each run drops a timestamped folder with both machine-readable data and a report you can
            actually read, so an opportunity is easy to act on and easy to diff against the last run:
          </Box>
          <CheckList items={outputPoints} accent={ACCENT} />
        </Reveal>

        <Reveal delay={0.48} id="safeguards">
          <SectionHeading eyebrow="guardrails">Read-only by design</SectionHeading>
          <CheckList items={safeguards} accent={ACCENT} />
        </Reveal>

        <PageNav
          left={{ text: "Watts", link: "/other/smart-trainer" }}
          right={{ text: "IMAX Watch Agent", link: "/other/imax-bot" }}
        />
      </Box>
    </SectionNavLayout>
  );
}
