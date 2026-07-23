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
  PageNav,
} from "../../components/design";
import { SectionNavLayout, Section } from "../../components/SectionNav";

const ACCENT = "#d8aa78";

const SECTIONS: Section[] = [
  { id: "idea", label: "The idea" },
  { id: "pipeline", label: "The pipeline" },
  { id: "maths", label: "The maths" },
  { id: "safeguards", label: "Guardrails" },
];

const ideaPoints = [
  "Every bookmaker prices the same race a little differently, and each builds in a margin (the overround) so the book tilts in its favour.",
  "Take just the single best price on each runner across every book, and that combined margin can, occasionally, tip the other way.",
  "When it does, a stake split across the runners returns more than it cost, whatever the result. That gap is the arbitrage.",
  "These windows are small and short-lived, so the whole point is to spot them fast, automatically, before the prices move.",
];

const pipelinePoints = [
  "Discovery and scraping: a browser agent navigates each bookmaker to the right meeting and races, driven by on-page vision rather than brittle hard-coded selectors.",
  "Extraction: each race page is read by a local vision model into structured odds, runner by runner, so nothing leaves the machine and there is no per-call cost.",
  "Reconciliation: runners are matched across books despite naming differences (case, country suffixes like (NZ), barrier numbers in names), with a confidence score on each match.",
  "Arbitrage maths: pure Python finds the best price per runner, tests the arbitrage condition, and outputs ranked opportunities with a stake split for a given bankroll.",
];

const safeguards = [
  "It never places a bet. The output is a set of instructions: which runner, which bookmaker, what stake, and the expected return.",
  "Everything runs locally. The vision model is on-device, so odds and results never go to a third-party API.",
  "Low-confidence runner matches are surfaced as warnings, not silently traded on, because a wrong match is a wrong bet.",
  "Odds are timestamped, since an opportunity is only real for as long as the prices behind it hold.",
];

const pipelineDiagram = `\`\`\`text
bookmaker sites
     |  browser agent navigates each book
     v
page screenshots
     |  local vision model reads the odds
     v
raw odds, per bookmaker
     |  reconcile runners across books
     v
best price per runner
     |  arbitrage maths
     v
ranked opportunities + per-runner stake split
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
          subtitle="A read-only engine that scans horse racing odds across multiple Australian bookmakers and flags arbitrage: the rare moments when backing every runner at the best price on offer locks in a profit no matter which horse wins. It works out exactly what to stake where, and never places a bet itself."
        />

        <Reveal delay={0.06}>
          <Panel accent={ACCENT} wash>
            <StatRow
              items={[
                { value: "Multi", label: "bookmakers" },
                { value: "Vision", label: "odds extraction" },
                { value: "Sum < 1", label: "arb condition" },
                { value: "Read-only", label: "never bets" },
              ]}
            />
          </Panel>
          <Box sx={{ mt: 2 }}>
            <Callout accent={ACCENT} title="status">
              In proof-of-concept, running against live markets. Real numbers will land here once
              testing wraps up, and the source is kept private for now.
            </Callout>
          </Box>
        </Reveal>

        <Reveal delay={0.12} id="idea">
          <SectionHeading eyebrow="the idea">What arbitrage is</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            Bookmakers compete, and they do not all agree on what a horse is worth. Now and then the
            best price on each runner, taken across the whole market, is generous enough to guarantee a
            profit:
          </Box>
          <CheckList items={ideaPoints} accent={ACCENT} />
        </Reveal>

        <Reveal delay={0.18} id="pipeline">
          <SectionHeading eyebrow="how it works">The pipeline</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            Four stages take it from a bookmaker's website to a ranked list of opportunities, with the
            odds never leaving the machine:
          </Box>
          <CheckList items={pipelinePoints} accent={ACCENT} />
          <Box sx={{ mt: 2.5 }}>
            <Panel accent={ACCENT}>
              <MarkdownBlock>{pipelineDiagram}</MarkdownBlock>
            </Panel>
          </Box>
        </Reveal>

        <Reveal delay={0.24} id="maths">
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

        <Reveal delay={0.3} id="safeguards">
          <SectionHeading eyebrow="guardrails">Read-only by design</SectionHeading>
          <CheckList items={safeguards} accent={ACCENT} />
        </Reveal>

        <PageNav
          left={{ text: "Smart Trainer", link: "/other/smart-trainer" }}
          right={{ text: "IMAX Watch Agent", link: "/other/imax-bot" }}
        />
      </Box>
    </SectionNavLayout>
  );
}
