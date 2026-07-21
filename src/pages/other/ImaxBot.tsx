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

const mechanics = [
  "One run does a single site scan and drives all four streams.",
  "The first run seeds state silently, so there is no alert burst on setup.",
  "Every run after that only messages you on a genuine change.",
  "State lives in a local agent_state.json, so each alert fires once per transition and never repeats.",
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
        subtitle="A Python agent that watches Event Cinemas IMAX Sydney and pings you on Telegram when films appear or tickets open, so you never miss a release or an on-sale window."
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
          Currently in testing, running against the live IMAX Sydney site.
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

      <Reveal delay={0.3} id="how">
        <SectionHeading eyebrow="design">How it works</SectionHeading>
        <Box sx={{ color: "text.secondary", mb: 2 }}>
          The agent is stateless per invocation: it reads its config, scans once, diffs against saved
          state and fires only on transitions.
        </Box>
        <CheckList items={mechanics} accent={ACCENT} />
      </Reveal>

      <Reveal delay={0.36} id="deploy">
        <SectionHeading eyebrow="ops">Deploy</SectionHeading>
        <MarkdownBlock>
          {`Because each run is self-contained, deployment is just a cron job on a droplet: no runner, no state-commit dance. A \`flock\` guard stops a slow scan overlapping the next tick, and \`uv\` provisions the Python 3.12 toolchain from a lockfile.`}
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
