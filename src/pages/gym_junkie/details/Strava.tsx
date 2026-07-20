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

const ACCENT = "#ffb74d";

const screenshots = [
  { src: "/gym_junkie/strava_settings.png", label: "Strava settings" },
  { src: "/gym_junkie/strava_upload_example.png", label: "Shared activity" },
];

export default function Strava() {
  return (
    <Box
      component="section"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: { xs: 3, sm: 4 }, pb: 4 }}
    >
      <PageHeader
        eyebrow="gym junkie"
        title={
          <>
            Strava <GradientText>sharing</GradientText>
          </>
        }
        subtitle="Push completed workouts straight to your Strava feed, formatted as a proper strength session."
      />

      <Reveal delay={0.06}>
        <SectionHeading eyebrow="how it works">Connect once, share anytime</SectionHeading>
        <CheckList
          accent={ACCENT}
          items={[
            "Connect Strava once from settings and the integration handles the OAuth flow for you.",
            "A Share to Strava option appears whenever you wrap up a workout.",
            "Shared activities include the workout summary: exercises, total volume, duration and heart-rate data if you trained with a strap.",
            "Everything is formatted for Strava rather than dumped as raw data, so followers see a proper strength session.",
          ]}
        />
      </Reveal>

      <Reveal delay={0.12}>
        <Callout accent={ACCENT} title="always opt-in">
          Sharing is opt-in per workout. Bad session? Do not share it. Hit a PR you want the world to
          know about? One tap.
        </Callout>
      </Reveal>

      <Reveal delay={0.18}>
        <SectionHeading eyebrow="screens">See it in action</SectionHeading>
        <ScreenshotGallery shots={screenshots} accent={ACCENT} />
      </Reveal>

      <PageNav left={{ text: "Details", link: "/gym-junkie/details" }} />
    </Box>
  );
}
