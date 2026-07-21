import { Box } from "@mui/material";
import ShopIcon from "@mui/icons-material/Shop";
import AppleIcon from "@mui/icons-material/Apple";
import {
  Reveal,
  GradientText,
  PageHeader,
  SectionHeading,
  CheckList,
  Callout,
  ScreenshotGallery,
  ExternalButton,
  PageNav,
} from "../../components/design";
import { gymJunkiePlayStoreLink, gymJunkieAppStoreLink } from "../../middleware/links";

const ACCENT = "#d8aa78";

const screenshots = [
  { src: "/gym_junkie/workout_screen.png", label: "Workout screen" },
  { src: "/gym_junkie/workout_exercise_history_graph.png", label: "Exercise history data" },
  { src: "/gym_junkie/workout_overview_current.png", label: "Current workout overview" },
];

const highlights = [
  "Fast set, rep and weight entry built for logging mid-workout with no fuss",
  "Rich analytics and comparisons without pressing through a stack of menus",
  "Free to use, with the features and customisation usually locked behind a subscription",
  "Friends without the noise: check in on your mates, but keep the focus on you",
];

export default function GymJunkieOverview() {
  return (
    <Box
      component="section"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: { xs: 3, sm: 4 }, pb: 4 }}
    >
      <PageHeader
        eyebrow="overview"
        title={
          <>
            Gym <GradientText>Junkie</GradientText>
          </>
        }
        subtitle="A free fitness app built on data, analytics and tracking. Record every set for progressive overload, then dig into the numbers, without paying yet another subscription."
        actions={
          <>
            <ExternalButton href={gymJunkiePlayStoreLink} icon={<ShopIcon />}>
              Play Store
            </ExternalButton>
            <ExternalButton href={gymJunkieAppStoreLink} icon={<AppleIcon />}>
              App Store
            </ExternalButton>
          </>
        }
      />

      <Reveal delay={0.06}>
        <SectionHeading eyebrow="why i built it">The idea</SectionHeading>
        <CheckList items={highlights} accent={ACCENT} columns={2} />
      </Reveal>

      <Reveal delay={0.12}>
        <Callout accent={ACCENT} title="built by a backend engineer">
          Yes, the frontend is packed with buttons and data, and you can tell who built it. That is
          kind of the point: in a workout I want to enter data quickly, or pull up comparisons and
          analytics, without hunting through menus. Whether you are an ego lifter or a science based
          bro, this app should have something for you.
        </Callout>
      </Reveal>

      <Reveal delay={0.18}>
        <SectionHeading eyebrow="screens">In the app</SectionHeading>
        <ScreenshotGallery shots={screenshots} accent={ACCENT} />
      </Reveal>

      <PageNav right={{ text: "Details", link: "/gym-junkie/details" }} />
    </Box>
  );
}
