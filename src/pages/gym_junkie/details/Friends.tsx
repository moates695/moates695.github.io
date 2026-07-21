import { Box } from "@mui/material";
import {
  PageHeader,
  GradientText,
  Reveal,
  SectionHeading,
  CheckList,
  Callout,
  ScreenshotGallery,
  PageNav,
} from "../../../components/design";

const ACCENT = "#d8aa78";

export default function Friends() {
  return (
    <Box
      component="section"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: { xs: 3, sm: 4 }, pb: 4 }}
    >
      <PageHeader
        eyebrow="gym junkie"
        title={
          <>
            Friends and <GradientText>leaderboards</GradientText>
          </>
        }
        subtitle="See what your gym mates are training and where you stack up, without the social-network noise."
      />

      <Reveal delay={0.06}>
        <SectionHeading eyebrow="the feed">Train alongside your mates</SectionHeading>
        <CheckList
          accent={ACCENT}
          items={[
            "Add gym mates and see their workouts in a feed: what they trained, how heavy and how long it took.",
            "Tap into a friend's profile to compare directly, same exercise and same rep range, side by side.",
            "Leaderboards let you pick a lift and rep range and see where you rank against your friends.",
            "Filter leaderboards by age bracket, body weight or experience for a fairer comparison.",
          ]}
        />
      </Reveal>

      <Reveal delay={0.12}>
        <Callout accent={ACCENT} title="no social-network guilt">
          There are no likes, no comments and no streaks guilting you into pretending you trained. The
          point is to feed off your friends' energy and keep yourself honest, whether that means
          pushing harder or gently roasting a mate.
        </Callout>
      </Reveal>

      <Reveal delay={0.18}>
        <ScreenshotGallery
          accent={ACCENT}
          shots={[{ src: "/gymJunkieLeaderboard.png", label: "Leaderboards" }]}
        />
      </Reveal>

      <PageNav
        left={{ text: "Details", link: "/gym-junkie/details" }}
        right={{ text: "Strava Sharing", link: "/gym-junkie/details/strava" }}
      />
    </Box>
  );
}
