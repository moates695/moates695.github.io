import { Box } from "@mui/material";
import {
  PageHeader,
  GradientText,
  Reveal,
  SectionHeading,
  CheckList,
  ScreenshotGallery,
  PageNav,
} from "../../../components/design";

const ACCENT = "#ffb74d";

const screenshots = [
  { src: "/gym_junkie/choose_workout_exercise.png", label: "Exercise picker" },
  { src: "/gymJunkieFavourites.png", label: "Favourites" },
];

export default function ExerciseLibrary() {
  return (
    <Box
      component="section"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: { xs: 3, sm: 4 }, pb: 4 }}
    >
      <PageHeader
        eyebrow="gym junkie"
        title={<>Exercise <GradientText>library</GradientText></>}
        subtitle="A large catalogue covering every major muscle group, with the lifts you actually train floating to the top."
      />

      <Reveal delay={0.06}>
        <SectionHeading eyebrow="find your lift">Built for the way you train</SectionHeading>
        <CheckList
          accent={ACCENT}
          items={[
            "Filter by equipment, target muscle or movement pattern to narrow the catalogue fast.",
            "The picker remembers what you usually do, so your regular exercises float to the top.",
            "Mark exercises as favourites to pin your bread and butter lifts one tap away.",
          ]}
        />
      </Reveal>

      <Reveal delay={0.12}>
        <SectionHeading eyebrow="make it yours">Custom exercises and variations</SectionHeading>
        <CheckList
          accent={ACCENT}
          items={[
            "Create a custom exercise from scratch: name it, tag the muscles it works, and it slots straight into your library alongside the built-ins.",
            'Create variations of existing exercises (think "incline DB press, neutral grip") without polluting the catalogue.',
          ]}
        />
      </Reveal>

      <Reveal delay={0.18}>
        <ScreenshotGallery shots={screenshots} accent={ACCENT} />
      </Reveal>

      <PageNav
        left={{ text: "Details", link: "/gym-junkie/details" }}
        right={{ text: "Rest Timer & Heart Rate", link: "/gym-junkie/details/rest-timer-heart-rate" }}
      />
    </Box>
  );
}
