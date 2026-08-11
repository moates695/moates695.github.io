import { Avatar, Box } from "@mui/material";
import { imaxBotGithubLink } from "../../middleware/links";
import githubLogo from "../../assets/github-logo.png";
import imaxLogo from "../../assets/imax_logo.jpeg";
import MarkdownBlock from "../../components/MarkdownBlock";
import TelegramChat, { ChatMessage } from "../../components/TelegramChat";
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

const ACCENT = "#d8aa78";

const SECTIONS: Section[] = [
  { id: "streams", label: "What it watches" },
  { id: "examples", label: "The alerts" },
  { id: "commands", label: "Ask on demand" },
  { id: "how", label: "How it works" },
  { id: "deploy", label: "Deploy" },
];

const exampleMessages: ChatMessage[] = [
  {
    text:
      "📅 IMAX Sydney daily update - Mon 21 Jul 2026\n\n" +
      "🎬 Coming soon (3):\n" +
      "• The Odyssey\n• Avatar: Fire and Ash\n• Wicked: For Good\n\n" +
      "🎫 On sale now (2):\n" +
      "• Dune: Part Three - 6 session(s), earliest Wed 22 Jul 18:45\n" +
      "• Superman - 4 session(s), earliest Tue 21 Jul 20:00\n\n" +
      "https://www.eventcinemas.com.au/Cinema/imax-sydney",
    time: "08:00",
  },
  {
    text:
      "🎫 'Dune: Part Three' now has tickets ON SALE at IMAX Sydney! " +
      "6 session(s), earliest Wed 22 Jul 18:45. Book: https://www.eventcinemas.com.au/Cinema/imax-sydney",
    time: "10:02",
  },
  {
    text:
      "❗ 'The Odyssey' (on your watchlist) is now COMING SOON at IMAX Sydney! " +
      "I'll ping you the moment tickets open. https://www.eventcinemas.com.au/Cinema/imax-sydney",
    time: "16:45",
  },
  {
    text:
      "🎫 'The Odyssey' is ON SALE at IMAX Sydney - 3 session(s) with seats:\n" +
      "• Fri 17 Jul 19:30 - Standard 142, Full Recliner 24\n" +
      "• Sat 18 Jul 14:00 - Standard 88, Full Recliner 12\n" +
      "• Sat 18 Jul 20:15 - Standard 61, Full Recliner 6\n" +
      "Book: https://www.eventcinemas.com.au/Cinema/imax-sydney",
    time: "18:20",
  },
];

const streams = [
  "Coming-soon discovery: a new film appears on the IMAX Sydney coming-soon list.",
  "On-sale discovery: any film site-wide gains bookable sessions.",
  "Watchlist: for films you are tracking, a highlighted alert when it first shows as coming-soon, then a per-session Standard / Full Recliner seat breakdown the moment it is bookable.",
  "Daily digest: once a day (08:00 Sydney by default), the full coming-soon and on-sale lists.",
];

const commands = [
  "/seats <film> lists every bookable session with its available Standard and Full Recliner counts and a booking link. Sold-out sessions are left off, and you can ask for several films at once with commas.",
  "/seats on its own runs that same check across every film on your watchlist.",
  "/nowshowing returns every film on sale now, with its session count and earliest start.",
  "/comingsoon returns the films listed as coming soon.",
  "/watchlist shows every film you are tracking, its current state (on sale, coming soon, or not listed yet) and whether its alerts are on or muted.",
  "/mute <film> silences that film's alerts, /unmute turns them back on. Bare /mute and /unmute apply to the whole watchlist.",
  "/help prints the command overview.",
];

const commandMessages: ChatMessage[] = [
  { text: "/seats The Odyssey", time: "21:03", outgoing: true },
  {
    text:
      "🎫 'The Odyssey' - IMAX Sydney (2 session(s) with seats):\n" +
      "• Fri 17 Jul 19:30 - Standard 142, Full Recliner 24\n" +
      "• Sat 18 Jul 14:00 - Standard 88, Full Recliner 12\n" +
      "Book: https://www.eventcinemas.com.au/Cinema/imax-sydney",
    time: "21:03",
  },
  { text: "/nowshowing", time: "21:05", outgoing: true },
  {
    text:
      "🎫 Now showing at IMAX Sydney (2):\n" +
      "• Dune: Part Three - 6 session(s), earliest Wed 22 Jul 18:45\n" +
      "• Superman - 4 session(s), earliest Tue 21 Jul 20:00\n\n" +
      "https://www.eventcinemas.com.au/Cinema/imax-sydney",
    time: "21:05",
  },
  { text: "/comingsoon", time: "21:06", outgoing: true },
  {
    text:
      "🎬 Coming soon at IMAX Sydney (3):\n" +
      "• The Odyssey\n• Avatar: Fire and Ash\n• Wicked: For Good\n\n" +
      "https://www.eventcinemas.com.au/Cinema/imax-sydney",
    time: "21:06",
  },
  { text: "/mute The Odyssey", time: "21:08", outgoing: true },
  {
    text:
      "🔕 Muted: The Odyssey.\n" +
      "No alerts until you /unmute. I keep watching quietly, and the daily " +
      "digest still lists every film.",
    time: "21:08",
  },
  { text: "/watchlist", time: "21:09", outgoing: true },
  {
    text:
      "📋 IMAX Sydney watchlist (2):\n" +
      "• Dune: Part Three - 🔔 alerts on - on sale now (6 session(s) tracked)\n" +
      "• The Odyssey - 🔕 muted - coming soon\n\n" +
      "/mute <film> to silence alerts, /unmute <film> to resume.",
    time: "21:09",
  },
];

const mechanics = [
  "One run does a single site scan and drives all four streams.",
  "The first run seeds state silently, so there is no alert burst on setup.",
  "Every run after that only messages you on a genuine change.",
  "State lives in a local agent_state.json, so each alert fires once per transition and never repeats.",
  "A separate always-on listener answers the chat commands, long-polling Telegram so it needs no public endpoint.",
  "Mutes get their own file with one-way ownership: the listener writes it when you send a command, the scanner only ever reads it, so a scheduled run and an ad-hoc command can never clobber each other.",
  "Title matching is case, punctuation and accent insensitive, so \"dune part two\" matches \"Dune: Part Two\".",
];

export default function OtherImaxBot() {
  const cronString = `\`\`\`cron
# every 15 minutes, logging to a file
*/15 * * * * $HOME/imax_bot/run.sh >> $HOME/imax_bot/imax_bot.log 2>&1
\`\`\``;

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
        eyebrow="agent"
        title={<>IMAX <GradientText>Watch Agent</GradientText></>}
        subtitle="A Python agent that watches Event Cinemas IMAX Sydney and pings you on Telegram when films appear or tickets open, so you never miss a release or an on-sale window. You can also message the bot to check seats, now showing and coming soon on demand, and mute any film that gets too chatty."
        actions={
          <ExternalButton
            href={imaxBotGithubLink}
            icon={<Avatar alt="github icon" src={githubLogo} sx={{ width: 24, height: 24 }} />}
          >
            Source
          </ExternalButton>
        }
      />

      <Reveal delay={0.06}>
        <Panel accent={ACCENT} wash>
          <StatRow
            items={[
              { value: "4", label: "alert streams" },
              { value: "7", label: "chat commands" },
              { value: "15 min", label: "scan cadence" },
              { value: "Telegram", label: "delivery" },
            ]}
          />
        </Panel>
      </Reveal>

      <Reveal delay={0.12}>
        <MarkdownBlock>
          {`Chasing IMAX tickets in Sydney means refreshing the same page for weeks and still missing the moment a film goes on sale. This agent does the watching instead: it scans the site on a schedule and only reaches out when something actually changes, straight to Telegram.`}
        </MarkdownBlock>
        <Callout accent={ACCENT} title="status">
          In production, running against the live IMAX Sydney site.
        </Callout>
      </Reveal>

      <Reveal delay={0.18} id="streams">
        <SectionHeading eyebrow="alerts">What it watches</SectionHeading>
        <Box sx={{ color: "text.secondary", mb: 2 }}>
          A single run drives four independent streams. For watchlisted films, the richer watchlist
          alerts replace the plain discovery ones:
        </Box>
        <CheckList items={streams} accent={ACCENT} />
      </Reveal>

      <Reveal delay={0.24} id="examples">
        <SectionHeading eyebrow="on your phone">The alerts</SectionHeading>
        <Box sx={{ color: "text.secondary", mb: 2 }}>
          Everything lands in one Telegram chat. Here is a run of each alert type, from a
          watchlisted film going on sale to the daily digest:
        </Box>
        <Box sx={{ display: "flex", justifyContent: { xs: "stretch", sm: "flex-start" } }}>
          <TelegramChat
            messages={exampleMessages}
            avatar={imaxLogo}
            name="IMAX Watch Agent"
            accent={ACCENT}
          />
        </Box>
      </Reveal>

      <Reveal delay={0.3} id="commands">
        <SectionHeading eyebrow="on demand">Ask on demand</SectionHeading>
        <Box sx={{ color: "text.secondary", mb: 2 }}>
          The four streams push alerts to you. The bot also answers when you message it: a handful of
          commands run a fresh scan and reply in seconds, so you can pull the current picture without
          waiting for a transition.
        </Box>
        <CheckList items={commands} accent={ACCENT} />
        <Callout accent={ACCENT} title="muting">
          A film in its on-sale window can produce a lot of seat alerts. Muting it stops the
          messages without stopping the watching: the agent still scans it and still moves its
          seat baselines forward, so unmuting picks up from what is on sale at that moment
          rather than replaying everything you missed. The daily digest keeps listing it either
          way, and a mute takes effect on the next scheduled scan.
        </Callout>
        <Box sx={{ display: "flex", justifyContent: { xs: "stretch", sm: "flex-start" }, mt: 2.5 }}>
          <TelegramChat
            messages={commandMessages}
            avatar={imaxLogo}
            name="IMAX Watch Agent"
            accent={ACCENT}
          />
        </Box>
      </Reveal>

      <Reveal delay={0.36} id="how">
        <SectionHeading eyebrow="design">How it works</SectionHeading>
        <Box sx={{ color: "text.secondary", mb: 2 }}>
          The agent is stateless per invocation: it reads its config, scans once, diffs against saved
          state and fires only on transitions.
        </Box>
        <CheckList items={mechanics} accent={ACCENT} />
      </Reveal>

      <Reveal delay={0.42} id="deploy">
        <SectionHeading eyebrow="ops">Deploy</SectionHeading>
        <MarkdownBlock>
          {`Because each run is self-contained, deployment is just a cron job on a droplet: no runner, no state-commit dance. A \`flock\` guard stops a slow scan overlapping the next tick, and \`uv\` provisions the Python 3.12 toolchain from a lockfile. The on-demand listener runs alongside it as a \`systemd\` service, so the two halves stay independent.`}
        </MarkdownBlock>
        <Panel accent={ACCENT}>
          <MarkdownBlock>{cronString}</MarkdownBlock>
        </Panel>
      </Reveal>

      <PageNav
        left={{ text: "Other Projects", link: "/other" }}
        right={{ text: "Cellular Tracking", link: "/other/cellular-tracking" }}
      />
    </Box>
    </SectionNavLayout>
  );
}
