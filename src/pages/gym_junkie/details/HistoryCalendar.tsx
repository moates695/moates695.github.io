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

const screenshots = [
  { src: "/gym_junkie/workout_history.png", label: "Workout history" },
  { src: "/gym_junkie/wokrout_overview_history.png", label: "Past workout" },
  { src: "/gymJunkieHistoryData.png", label: "Workout details" },
];

export default function HistoryCalendar() {
  return (
    <Box
      component="section"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: { xs: 3, sm: 4 }, pb: 4 }}
    >
      <PageHeader
        eyebrow="gym junkie"
        title={
          <>
            History and <GradientText>calendar</GradientText>
          </>
        }
        subtitle="Every session you have ever logged, kept in one honest record of your consistency."
      />

      <Reveal delay={0.06}>
        <SectionHeading eyebrow="the log">Every workout, in full</SectionHeading>
        <CheckList
          accent={ACCENT}
          items={[
            "Tap any past session for the full breakdown: exercises, sets, weights, notes, muscle groups, duration and heart rate if you wore a strap.",
            "The same layout as the live workout overview, so there is nothing new to learn.",
            "A yearly frequency calendar paints every training day green, with the shade scaling to how hard the session was.",
          ]}
        />
      </Reveal>

      <Reveal delay={0.12}>
        <Callout accent={ACCENT} title="put it to work">
          Copy an old workout as a template for today, compare last month's performance against right
          now, or just remind yourself how far you have come. The calendar is a nice motivator and a
          brutally honest record of any holes in your consistency.
        </Callout>
      </Reveal>

      <Reveal delay={0.18}>
        <SectionHeading eyebrow="screens">See it in action</SectionHeading>
        <ScreenshotGallery shots={screenshots} accent={ACCENT} />
      </Reveal>

      <PageNav
        left={{ text: "Details", link: "/gym-junkie/details" }}
        right={{ text: "Friends and Leaderboards", link: "/gym-junkie/details/friends" }}
      />
    </Box>
  );
}
