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
  { src: "/gym_junkie/stats_screen.png", label: "Stats overview" },
  { src: "/gym_junkie/exercise_stats.png", label: "Exercise stats" },
  { src: "/gym_junkie/workout_exercise_history_graph.png", label: "History graph" },
  { src: "/gym_junkie/workout_exercise_n_rep_max_graph.png", label: "N-rep-max graph" },
];

export default function ExerciseStats() {
  return (
    <Box
      component="section"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: { xs: 3, sm: 4 }, pb: 4 }}
    >
      <PageHeader
        eyebrow="gym junkie"
        title={
          <>
            Exercise <GradientText>stats</GradientText>
          </>
        }
        subtitle="Pick any lift and see its full history, personal records and progression at a glance."
      />

      <Reveal delay={0.06}>
        <SectionHeading eyebrow="the record">What you get per exercise</SectionHeading>
        <CheckList
          accent={ACCENT}
          items={[
            "A complete history of every set you have logged: weights, reps and dates, sortable by whatever matters to you.",
            "N-rep max view: your best set at 1, 3, 5, 8, 10, 12 and 15 reps, the headline number most lifters chase.",
            "Estimated maxes for rep ranges you do not directly train, handy when planning a percentage-based program.",
            "Progression charts plotting weight, volume or estimated 1RM over time so you can tell real gains from spinning your wheels.",
          ]}
        />
      </Reveal>

      <Reveal delay={0.12}>
        <Callout accent={ACCENT} title="Live PR flags">
          Hit a new personal record mid-workout and Gym Junkie flags it on the spot, so you never
          miss the moment a lift moves forward.
        </Callout>
      </Reveal>

      <Reveal delay={0.18}>
        <SectionHeading eyebrow="screens">See it in action</SectionHeading>
        <ScreenshotGallery shots={screenshots} accent={ACCENT} />
      </Reveal>

      <PageNav
        left={{ text: "Details", link: "/gym-junkie/details" }}
        right={{ text: "Distributions", link: "/gym-junkie/details/distributions" }}
      />
    </Box>
  );
}
