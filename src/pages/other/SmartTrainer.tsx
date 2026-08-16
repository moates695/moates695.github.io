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
  { id: "editor", label: "Workout editor" },
  { id: "accounts", label: "Accounts and sync" },
  { id: "options", label: "Options" },
  { id: "app", label: "The app" },
  { id: "how", label: "How it's wired" },
  { id: "pwa", label: "Browser-based" },
];

const forkAdds = [
  "A ground-up visual redesign: a dark, data-first interface built around cycling power zones.",
  "A graphical workout editor, so you build a session by dragging blocks on a chart instead of hand-writing Zwift XML.",
  "Native accounts with background sync, so your workouts, ride history and rider profile outlive a cleared browser and follow you to a second device.",
  "A settings screen pared back to the options that actually do something, with the dead integrations taken out.",
  "Richer live metrics on the ride screen and a completed-rides view with per-ride analysis.",
];

const redesignPoints = [
  "A dark, data-first look: near-black surfaces, a single volt-lime accent, and condensed type with tabular numerals so the live numbers stay legible mid-effort.",
  "Power is colour-coded by Coggan training zone throughout, from the hero readout to the workout profile, so where you are is readable at a glance.",
  "Three screens behind a bottom nav bar: a live Home ride view, a Workouts library with a built-in editor, and Settings for the trainer and account.",
  "The home screen surfaces numbers the app never showed before: live watts per kilo, a rolling power-history trace, an FTP-percentage gauge, and how closely you are holding the current target.",
];

const editorCanvas = [
  "Drag the top edge of a block to move its whole power level, or a top corner to lift just that end and turn the block into a ramp.",
  "Drag the right edge to stretch a block's duration, or the left edge to move the boundary it shares with its neighbour.",
  "Blocks are coloured by Coggan training zone, and the gridlines are labelled in both %FTP and the watts that works out to at your FTP.",
  "Zoom in, zoom out or zoom to fit; the time axis picks a sensible tick spacing for whatever zoom you land on.",
  "Undo and redo cover every edit, on the toolbar and on Ctrl+Z / Ctrl+Shift+Z.",
];

const editorTable = [
  "The same session as an ordered table under the chart: duration, start and end power, plus optional cadence and slope per block.",
  "Type into any field instead of dragging, and reorder, duplicate or delete a block from its row.",
  "Name, category and description sit above the chart and are written into the file; the category list is the built-in set plus anything found in your own library.",
  "Save into your library or download a .ZWO. After the first save it updates that entry in place rather than piling up copies, and a name clash becomes Threshold (2) on its own.",
  "Load a saved workout back in to keep editing it, or duplicate any workout, built-in ones included, as a fresh unsaved copy.",
  "Trying to leave the editor with unsaved edits prompts first, rather than quietly discarding them.",
];

const editorFormat = [
  "The conversion between draggable blocks and Zwift .ZWO is a pure, DOM-free module, so it is unit-tested in isolation with no browser needed.",
  "It emits standard ZWO the app already understands: <SteadyState> for flat blocks and <Warmup> / <Cooldown> for rising and falling ramps.",
  "Because the output is plain ZWO, the existing parser runs the generated workout unchanged, no special-casing for designed sessions.",
];

const accountWhy = [
  "Ride history was capped at seven locally. The eighth ride silently destroyed the first, .FIT file and all.",
  "Custom workouts lived in one browser profile, one storage clear away from gone.",
  "So did the rider profile, so a second device rode every %FTP target against a default 200 W.",
];

const accountUi = [
  "Sign in, create an account, forgot password, enter the emailed code and signed-in: five states in one card, showing exactly one at a time.",
  "Each state is its own form, so a password manager sees a login form and a registration form rather than one form that changes meaning.",
  "A forgotten password is a six digit code typed into the app, not a link. A link opens whatever browser handles mail, which on iOS is never the installed app, so the session it creates lands in the wrong place.",
  "Signing in is optional and stays that way: signed out, the app behaves exactly as it did before any of this existed.",
];

const accountSecurity = [
  "Passwords are hashed with argon2id, never encrypted. There is no key that turns a stored hash back into a password.",
  "The session is an opaque HttpOnly cookie and only its sha256 is stored, so a database leak yields no usable live sessions.",
  "Reset codes are stored as a keyed HMAC rather than a bare digest: six digits is a space of a million, which a plain hash column gives up in milliseconds.",
  "Login answers the same way for an unknown address and a wrong password, and a reset request always answers 204, so neither endpoint confirms who has an account.",
  "Every query is scoped by the user id taken from the session cookie, never from a request body or path. A standing test suite proves it per endpoint, including when one user knows another's record ids.",
];

const syncPoints = [
  "IndexedDB stays the source of truth for the running app. The server is a replica that converges in the background, and no screen ever blocks on a network call.",
  "Records carry client-generated UUIDs, so a workout built offline keeps its identity when it finally reaches the server.",
  "Deletes write tombstones. Without them, a workout deleted on the laptop is resurrected by the phone on its next push.",
  "Two clocks: the device clock decides last-write-wins between two versions of a record, and a server-issued counter drives paging, so a skewed clock cannot make a record skip the cursor.",
  "Ride files upload straight from the browser to object storage over a presigned URL, in three phases, so a dropped connection is recoverable and never leaves a row claiming a file that is not there.",
  "The merge logic is a pure module like the editor's, tested apart from the browser: 78 tests on the client sync layer, 105 on the API.",
];

const optionPoints = [
  "Settings splits in two: Trainer, for the rider profile, app options and devices, and Account for the sign-in card.",
  "The rider profile derives FTP per kilo as you type, so the number you actually train off is on screen next to the two you enter.",
  "Options are one short list: units, sound, lock the controls by default, auto start on pedal, auto pause on coast, and the simulation source.",
  "Every device role, trainer, power meter, heart rate, speed and cadence, is a card showing its connection state and live values.",
  "The upstream Auuki account is gone. Its API allows exactly one origin, so sign-in and the OAuth connect flows could never work from a fork, and leaving them on screen was a promise the app could not keep.",
  "So is the intervals.icu key that briefly replaced it: the native account now covers workouts, history and profile, and a third-party credential in the account would make a breach here a breach there too.",
  "Strava and TrainingPeaks are not offered, because their token exchange needs a client secret and a client-side app cannot hold one. Garmin stays as what it honestly is, a link to upload the file you just downloaded.",
];

const appFeatures = [
  "Connects over Web Bluetooth to smart trainers (FTMS and Tacx FE-C over BLE), power meters, heart-rate straps and more, with no dongle or install.",
  "Runs workouts in ERG, resistance and slope modes, holding your target power while the trainer supplies the resistance.",
  "Plays standard Zwift .ZWO workouts and ships with a built-in library alongside the sessions you build yourself.",
  "A workout library that keeps read-only built-ins apart from your own sessions, with duplicate, edit and delete on the ones you made.",
  "Finished rides land in a completed list with expandable analysis, overlaying the recorded power, heart rate and cadence.",
  "A zoomable workout profile with zone-coloured blocks and a live position marker, plus a lock that guards the controls mid-effort.",
  "Records rides as cross-industry .FIT activities, kept in your account and downloadable for Garmin Connect or anything else that reads .FIT.",
];

const architecture = [
  "State lives in one reactive store: assigning a field automatically fires a DOM event and subscribed views re-render off it. Roughly 60 lines stand in for a whole framework.",
  "Every screen is a native Web Component that subscribes to the fields it cares about and tears those subscriptions down when it disconnects.",
  "The Bluetooth layer wraps each device role (trainer, power, heart rate) and pushes live measurements into the same store, so the UI reacts to hardware the same way it reacts to clicks.",
  "Sync hangs off the same store. A reducer writes the local change, then wakes the queue, which means anything that skips the reducers writes to the device and never leaves it.",
  "The accounts backend is FastAPI and Postgres in the same repo, served from the same origin as the app, so the session cookie is first party and no CORS is involved.",
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
          subtitle="A browser-based app for running structured cycling workouts on a smart trainer. It connects straight to the hardware over Web Bluetooth, drives ERG, resistance and slope modes, and records standard .FIT activities. I forked it and rebuilt it on four fronts: a dark, data-first redesign, a graphical workout editor, native accounts that keep your workouts and ride history across devices, and a settings screen stripped back to the options that work."
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
              is mature and running in production; the ground-up redesign, the workout editor, the
              accounts and sync layer and the richer ride views are the parts I built. Accounts are
              built and tested but not yet switched on for the public instance, which still runs as the
              signed-out app.
            </Callout>
          </Box>
        </Reveal>

        <Reveal delay={0.12} id="fork">
          <SectionHeading eyebrow="credit">Where it started</SectionHeading>
          <MarkdownBlock>
            {`This builds on [Auuki](${auukiLink}), an open-source, browser-based training app. Auuki already does the hard part: it speaks the Bluetooth Fitness Machine Service and Tacx FE-C, controls the trainer, and records rides. I forked it and made it my own:`}
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

        <Reveal delay={0.24} id="editor">
          <SectionHeading eyebrow="my contribution">The workout editor</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            A workout is a list of blocks, each a duration and a power target as a fraction of your
            FTP. The editor lets you build that list by hand, either by pulling the shape around on a
            chart or by typing it into a table, then compiles it to a Zwift .ZWO file the app can run.
          </Box>
          <Box sx={{ mt: 3 }}>
            <ImageFigure
              src="/watts/workout_editor.png"
              alt="The Watts workout editor: draggable power blocks above an editable block table"
              tag="new / workout editor"
              accent={ACCENT}
              caption="Blocks are dragged on the chart or typed into the table, each one showing the watts it works out to at your FTP."
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <SectionHeading eyebrow="on the chart">Direct manipulation</SectionHeading>
            <CheckList items={editorCanvas} accent={ACCENT} />
          </Box>
          <Box sx={{ mt: 3 }}>
            <SectionHeading eyebrow="in the table">The same session, typed</SectionHeading>
            <CheckList items={editorTable} accent={ACCENT} />
          </Box>
          <Box sx={{ mt: 3 }}>
            <SectionHeading eyebrow="the output">Plain .ZWO, nothing bespoke</SectionHeading>
            <CheckList items={editorFormat} accent={ACCENT} />
          </Box>
          <Box sx={{ mt: 2.5 }}>
            <Panel accent={ACCENT}>
              <MarkdownBlock>{zwoSnippet}</MarkdownBlock>
            </Panel>
          </Box>
        </Reveal>

        <Reveal delay={0.3} id="accounts">
          <SectionHeading eyebrow="my contribution">Accounts and sync</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            The app had no account of its own, and everything you made lived in one browser's storage.
            That is fine until it isn't:
          </Box>
          <CheckList items={accountWhy} accent={ACCENT} />
          <Box sx={{ mt: 3 }}>
            <MarkdownBlock>
              {`All three are the same problem, so they get the same fix: a small FastAPI and Postgres service in the same repo, behind the same web server as the app, holding email and password accounts and syncing your custom workouts, your ride history and your rider profile.`}
            </MarkdownBlock>
          </Box>
          <Box sx={{ mt: 3 }}>
            <SectionHeading eyebrow="signing in">The account card</SectionHeading>
            <CheckList items={accountUi} accent={ACCENT} />
          </Box>
          <Box sx={{ mt: 3 }}>
            <SectionHeading eyebrow="handling credentials">What is stored, and how</SectionHeading>
            <CheckList items={accountSecurity} accent={ACCENT} />
          </Box>
          <Box sx={{ mt: 3 }}>
            <SectionHeading eyebrow="staying in step">The sync layer</SectionHeading>
            <Box sx={{ color: "text.secondary", mb: 2 }}>
              This is the hard half, not the auth. A trainer app that stalls when the wifi drops
              mid-interval is broken, so the rule is that the network is never in the way:
            </Box>
            <CheckList items={syncPoints} accent={ACCENT} />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Callout accent={ACCENT} title="the deliberate omission">
              No social login, no 2FA and no email verification on signup. Each is additive later and
              none of them blocks the thing this exists for, which is that your rides stop disappearing.
            </Callout>
          </Box>
        </Reveal>

        <Reveal delay={0.36} id="options">
          <SectionHeading eyebrow="the pruning">Options worth having</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            A fork inherits a settings screen full of switches for services it cannot reach. Half this
            work was adding options; the other half was taking away the ones that were never going to
            do anything:
          </Box>
          <CheckList items={optionPoints} accent={ACCENT} />
          <Box sx={{ mt: 3 }}>
            <ImageFigure
              src="/watts/settings_trainer.png"
              alt="The Watts settings screen: rider profile, app options and device cards"
              tag="settings / trainer"
              accent={ACCENT}
              caption="Rider profile and options side by side, with every device role below as a card showing its connection state and live values."
            />
          </Box>
        </Reveal>

        <Reveal delay={0.42} id="app">
          <SectionHeading eyebrow="the app">What it does</SectionHeading>
          <CheckList items={appFeatures} accent={ACCENT} />
        </Reveal>

        <Reveal delay={0.48} id="how">
          <SectionHeading eyebrow="architecture">How it's wired</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            There is no framework. The whole app hangs off a tiny reactive core, which is what made
            slotting a new tab in tractable in the first place:
          </Box>
          <CheckList items={architecture} accent={ACCENT} />
        </Reveal>

        <Reveal delay={0.54} id="pwa">
          <SectionHeading eyebrow="delivery">Just a browser tab</SectionHeading>
          <MarkdownBlock>
            {`It is a progressive web app built with Parcel: no install and no app store. It leans on modern browser APIs (Web Bluetooth, Web Serial, Web Components), and every screen runs off local storage, so the ride you are in the middle of never depends on a server. The accounts backend is the one piece that is not in the browser, and it is optional: sign out and the whole app still works, offline included.`}
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
