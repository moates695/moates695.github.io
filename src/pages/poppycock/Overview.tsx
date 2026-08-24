import { Avatar, Box, Typography } from "@mui/material";
import githubLogo from "../../assets/github-logo.png";
import { balderdashGithubLink } from "../../middleware/links";
import {
  Reveal,
  GradientText,
  PageHeader,
  SectionHeading,
  CheckList,
  Callout,
  ExternalButton,
  PageNav,
} from "../../components/design";

const ACCENT = "#d8aa78";

export default function PoppycockOverview() {
  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 3, sm: 4 },
        pb: 4,
      }}
    >
      <PageHeader
        eyebrow="overview"
        title={
          <>
            Poppycock <GradientText>companion</GradientText>
          </>
        }
        subtitle={
          <>
            A real-time companion app for the physical Balderdash card game. The
            cards still drive the prompts; the app just handles the fiddly bits
            the score pad and slips of paper used to.
          </>
        }
        actions={
          <ExternalButton
            href={balderdashGithubLink}
            icon={
              <Avatar
                alt="GitHub icon"
                src={githubLogo}
                sx={{ width: 22, height: 22 }}
              />
            }
          >
            GitHub
          </ExternalButton>
        }
      />

      <Reveal delay={0.06}>
        <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 720 }}>
          The dasher reads a card, types in the real answer, and everyone else
          submits their bluff from their phone. The app shuffles them, runs the
          vote anonymously, and tallies the score deltas at the end of the round.
        </Typography>
      </Reveal>

      <Reveal delay={0.12}>
        <SectionHeading eyebrow="how it plays">Around the table</SectionHeading>
        <CheckList
          accent={ACCENT}
          items={[
            "Create a room and share the code with the people around the table",
            "Rotating dasher each round, with the host controlling game flow",
            "Real-time updates over WebSocket",
            "Persistent scores so the same group can keep playing across nights",
          ]}
        />
      </Reveal>

      <Reveal delay={0.18}>
        <Callout accent={ACCENT} title="status: in testing">
          Poppycock is in testing. It is playable end to end, with real games
          being run against it, but the client is not yet published to an app
          store.
        </Callout>
      </Reveal>

      <PageNav right={{ text: "Design", link: "/poppycock/design" }} />
    </Box>
  );
}
