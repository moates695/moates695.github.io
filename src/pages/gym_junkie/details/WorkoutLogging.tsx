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
  { src: "/gym_junkie/workout_screen.png", label: "Workout screen" },
  { src: "/gym_junkie/workout_overview_current.png", label: "Current overview" },
  { src: "/gymJunkieEditWorkoutExercise.png", label: "Edit exercise" },
];

export default function WorkoutLogging() {
  return (
    <Box
      component="section"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: { xs: 3, sm: 4 }, pb: 4 }}
    >
      <PageHeader
        eyebrow="gym junkie"
        title={<>Workout <GradientText>logging</GradientText></>}
        subtitle="The heart of Gym Junkie, built to stay out of your way so you can focus on the lift."
      />

      <Reveal delay={0.06}>
        <SectionHeading eyebrow="in the moment">Fast set entry</SectionHeading>
        <CheckList
          accent={ACCENT}
          items={[
            "A keyboard tuned for sets, reps and weight, with sensible defaults pulled from your last session, so you usually only tap once or twice per set.",
            "Mark a set as a drop set, or jump back to a previous set to fix a typo.",
            "A notes button on each exercise card title for quick reminders.",
            'Open "edit exercise" for the deeper controls: rearrange the order of exercises, copy an exercise, or delete one outright.',
          ]}
        />
      </Reveal>

      <Reveal delay={0.12}>
        <SectionHeading eyebrow="stay oriented">Always know where you are</SectionHeading>
        <Callout accent={ACCENT} title="autosave and sync">
          If your phone dies or you accidentally close the app, your workout is safe. Drafts
          autosave continuously and sync to the cloud, so picking up on another device, or just
          relaunching the app, drops you right back where you left off. Every change is reflected
          immediately in your overview.
        </Callout>
      </Reveal>

      <Reveal delay={0.18}>
        <ScreenshotGallery shots={screenshots} accent={ACCENT} />
      </Reveal>

      <PageNav
        left={{ text: "Details", link: "/gym-junkie/details" }}
        right={{ text: "Exercise Library", link: "/gym-junkie/details/exercise-library" }}
      />
    </Box>
  );
}
