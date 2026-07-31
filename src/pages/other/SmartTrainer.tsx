import { Avatar, Box } from "@mui/material";
import { smartTrainerGithubLink, smartTrainerLiveLink, auukiLink } from "../../middleware/links";
import githubLogo from "../../assets/github-logo.png";
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
  ExternalButton,
  PageNav,
} from "../../components/design";
import { SectionNavLayout, Section } from "../../components/SectionNav";
import { BeforeAfter, ImageFigure, ComparisonPair } from "../../components/BeforeAfter";

const ACCENT = "#d8aa78";

const comparisons: ComparisonPair[] = [
  {
    id: "ride",
    label: "Ride screen",
    before: "/watts/old_main_screen.png",
    after: "/watts/main_screen.png",
    note: "Before: ten equal-weight readouts strung across the top, most of them dashes, with the workout profile stranded at the bottom. After: power leads at the size you can read mid-effort, tagged with its training zone and watts per kilo, next to target adherence, a rolling power-history trace and an FTP gauge. The profile becomes a zoomable chart with recorded power, heart rate and cadence drawn over the planned blocks.",
  },
  {
    id: "workouts",
    label: "Workouts",
    before: "/watts/old_workouts.png",
    after: "/watts/workouts.png",
    note: "Before: a flat list of names, with the profile of the selected workout drawn loose on the page. After: each row carries its own thumbnail profile, description, zone tag and duration, expanding in place to a full chart with a start button. Tabs split your own sessions from the read-only built-ins, completed rides and the editor.",
  },
  {
    id: "settings",
    label: "Settings",
    before: "/watts/old_settings.png",
    after: "/watts/settings_trainer.png",
    note: "Before: FTP and weight as tap-to-edit dials above four rows of unlabelled Bluetooth toggles. After: a rider profile that derives FTP per kilo as you type, app options grouped beside it, and every device role as a card showing its connection state and live values.",
  },
];

const SECTIONS: Section[] = [
  { id: "fork", label: "The fork" },
  { id: "redesign", label: "The redesign" },
  { id: "designer", label: "Workout designer" },
  { id: "app", label: "The app" },
  { id: "how", label: "How it's wired" },
  { id: "pwa", label: "Browser-based" },
];

const forkAdds = [
  "A ground-up visual redesign: a dark, data-first interface built around cycling power zones.",
  "A graphical workout designer, so you build a session by dragging blocks instead of hand-writing Zwift XML.",
  "Richer live metrics on the ride screen and a completed-rides view with per-ride analysis.",
];

const redesignPoints = [
  "A dark, data-first look: near-black surfaces, a single volt-lime accent, and condensed type with tabular numerals so the live numbers stay legible mid-effort.",
  "Power is colour-coded by Coggan training zone throughout, from the hero readout to the workout profile, so where you are is readable at a glance.",
  "Three screens behind a bottom nav bar: a live Home ride view, a Workouts library with a built-in editor, and Settings for the trainer and account.",
  "The home screen surfaces numbers the app never showed before: live watts per kilo, a rolling power-history trace, an FTP-percentage gauge, and how closely you are holding the current target.",
];

const designerPoints = [
  "The conversion between draggable blocks and Zwift .ZWO is a pure, DOM-free module, so it is unit-tested in isolation with no browser needed.",
  "It emits standard ZWO the app already understands: <SteadyState> for flat blocks and <Warmup> / <Cooldown> for rising and falling ramps.",
  "Because the output is plain ZWO, the existing parser runs the generated workout unchanged, no special-casing for designed sessions.",
];

const appFeatures = [
  "Connects over Web Bluetooth to smart trainers (FTMS and Tacx FE-C over BLE), power meters, heart-rate straps and more, with no dongle or install.",
  "Runs workouts in ERG, resistance and slope modes, holding your target power while the trainer supplies the resistance.",
  "Plays standard Zwift .ZWO workouts and ships with a built-in library alongside the sessions you build yourself.",
  "A workout library that keeps read-only built-ins apart from your own sessions, with duplicate, edit and delete on the ones you made.",
  "Finished rides land in a completed list with expandable analysis, overlaying the recorded power, heart rate and cadence.",
  "A zoomable workout profile with zone-coloured blocks and a live position marker, plus a lock that guards the controls mid-effort.",
  "Records rides as cross-industry .FIT activities and syncs them to Intervals.icu and Strava.",
];

const architecture = [
  "State lives in one reactive store: assigning a field automatically fires a DOM event and subscribed views re-render off it. Roughly 60 lines stand in for a whole framework.",
  "Every screen is a native Web Component that subscribes to the fields it cares about and tears those subscriptions down when it disconnects.",
  "The Bluetooth layer wraps each device role (trainer, power, heart rate) and pushes live measurements into the same store, so the UI reacts to hardware the same way it reacts to clicks.",
];

const zwoSnippet = `\`\`\`xml
<workout>
  <Warmup     Duration="600" PowerLow="0.50" PowerHigh="0.75"/>
  <SteadyState Duration="300" Power="1.05"/>
  <SteadyState Duration="300" Power="0.55"/>
  <SteadyState Duration="300" Power="1.05"/>
  <SteadyState Duration="300" Power="0.55"/>
  <Cooldown   Duration="600" PowerLow="0.75" PowerHigh="0.50"/>
</workout>
\`\`\``;

export default function OtherSmartTrainer() {
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
          eyebrow="cycling"
          title={<>Wa<GradientText>tts</GradientText></>}
          subtitle="A browser-based app for running structured cycling workouts on a smart trainer. It connects straight to the hardware over Web Bluetooth, drives ERG, resistance and slope modes, and records standard .FIT activities. I forked it and rebuilt the interface from the ground up: a dark, data-first redesign, a graphical workout designer, and richer live metrics and ride analysis."
          actions={
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              <ExternalButton href={smartTrainerLiveLink}>Live site</ExternalButton>
              <ExternalButton
                href={smartTrainerGithubLink}
                icon={<Avatar alt="github icon" src={githubLogo} sx={{ width: 24, height: 24 }} />}
              >
                Source
              </ExternalButton>
            </Box>
          }
        />

        <Reveal delay={0.06}>
          <Panel accent={ACCENT} wash>
            <StatRow
              items={[
                { value: "Web BLE", label: "trainer link" },
                { value: ".ZWO", label: "workout format" },
                { value: ".FIT", label: "activity export" },
                { value: "PWA", label: "no install" },
              ]}
            />
          </Panel>
          <Box sx={{ mt: 2 }}>
            <Callout accent={ACCENT} title="status">
              A personal fork in proof-of-concept, live to try at watts.moates.com.au. The upstream app
              is mature and running in production; the ground-up redesign, the workout designer and the
              richer ride views are the parts I built.
            </Callout>
          </Box>
        </Reveal>

        <Reveal delay={0.12} id="fork">
          <SectionHeading eyebrow="credit">Where it started</SectionHeading>
          <MarkdownBlock>
            {`This builds on [Auuki](${auukiLink}), an open-source, browser-based training app. Auuki already does the hard part: it speaks the Bluetooth Fitness Machine Service and Tacx FE-C, controls the trainer, and records rides. I forked it and made it my own on three fronts:`}
          </MarkdownBlock>
          <Box sx={{ mt: 2 }}>
            <CheckList items={forkAdds} accent={ACCENT} />
          </Box>
        </Reveal>

        <Reveal delay={0.18} id="redesign">
          <SectionHeading eyebrow="the overhaul">A data-first redesign</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            The interface is being rebuilt from scratch around one idea: while you are pinned at
            threshold, the screen should read like an instrument panel, not a settings page.
          </Box>
          <CheckList items={redesignPoints} accent={ACCENT} />
          <Box sx={{ mt: 3 }}>
            <BeforeAfter pairs={comparisons} accent={ACCENT} />
          </Box>
        </Reveal>

        <Reveal delay={0.24} id="designer">
          <SectionHeading eyebrow="my contribution">The workout designer</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            A workout is a list of segments, each a duration and a power target as a fraction of your
            FTP. The designer lets you build that list by hand on a canvas, then compiles it to a
            Zwift .ZWO file the app can run:
          </Box>
          <CheckList items={designerPoints} accent={ACCENT} />
          <Box sx={{ mt: 3 }}>
            <ImageFigure
              src="/watts/workout_editor.png"
              alt="The Watts workout editor: draggable power blocks above an editable block table"
              tag="new / workout editor"
              accent={ACCENT}
              caption="Blocks are dragged on the canvas or typed into the table, each one showing the watts it works out to at your FTP. The session saves to your library or downloads as a .ZWO like this:"
            />
          </Box>
          <Box sx={{ mt: 2.5 }}>
            <Panel accent={ACCENT}>
              <MarkdownBlock>{zwoSnippet}</MarkdownBlock>
            </Panel>
          </Box>
        </Reveal>

        <Reveal delay={0.3} id="app">
          <SectionHeading eyebrow="the app">What it does</SectionHeading>
          <CheckList items={appFeatures} accent={ACCENT} />
        </Reveal>

        <Reveal delay={0.36} id="how">
          <SectionHeading eyebrow="architecture">How it's wired</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            There is no framework. The whole app hangs off a tiny reactive core, which is what made
            slotting a new tab in tractable in the first place:
          </Box>
          <CheckList items={architecture} accent={ACCENT} />
        </Reveal>

        <Reveal delay={0.42} id="pwa">
          <SectionHeading eyebrow="delivery">Just a browser tab</SectionHeading>
          <MarkdownBlock>
            {`It is a progressive web app built with Parcel: no install, no app store, no backend. It leans on modern browser APIs (Web Bluetooth, Web Serial, Web Components), so everything, including the ride you just recorded, stays on your device.`}
          </MarkdownBlock>
          <Box sx={{ mt: 2 }}>
            <Callout accent={ACCENT} title="one catch">
              Web Bluetooth means a Chromium browser (Chrome, Edge, Brave). Safari and Firefox do not
              expose the API, so they are not supported.
            </Callout>
          </Box>
        </Reveal>

        <PageNav
          left={{ text: "Other Projects", link: "/other" }}
          right={{ text: "Arbitrage Engine", link: "/other/arbitrage" }}
        />
      </Box>
    </SectionNavLayout>
  );
}
