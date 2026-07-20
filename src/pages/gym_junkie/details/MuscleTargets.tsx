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
  { src: "/gym_junkie/home_screen.png", label: "Muscle targets on home" },
];

export default function MuscleTargets() {
  return (
    <Box
      component="section"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: { xs: 3, sm: 4 }, pb: 4 }}
    >
      <PageHeader
        eyebrow="gym junkie"
        title={<>Muscle <GradientText>targets</GradientText></>}
        subtitle={'Turn vague intentions ("hit chest twice this week") into something you can actually track.'}
      />

      <Reveal delay={0.06}>
        <SectionHeading eyebrow="set the goal">Define a target</SectionHeading>
        <CheckList
          accent={ACCENT}
          items={[
            "Pick a muscle group.",
            "Choose what you are targeting: sets, total volume or total reps.",
            "Set the number you want to hit and over what window, for example ten sets of back work over a rolling seven days.",
          ]}
        />
      </Reveal>

      <Reveal delay={0.12}>
        <SectionHeading eyebrow="track it live">Progress at a glance</SectionHeading>
        <CheckList
          accent={ACCENT}
          items={[
            "Every target you create shows up on the home screen as a progress card that fills as you log sets through the week.",
            "A glance tells you what you have already done, what is behind, and where to put your effort next session.",
          ]}
        />
        <Box sx={{ mt: 2 }}>
          <Callout accent={ACCENT} title="run them in parallel">
            Keep as many targets going as you like: a high priority on legs, a maintenance target
            for arms, and a "don't forget" target for rear delts, all running at different volumes.
          </Callout>
        </Box>
      </Reveal>

      <Reveal delay={0.18}>
        <ScreenshotGallery shots={screenshots} accent={ACCENT} />
      </Reveal>

      <PageNav
        left={{ text: "Details", link: "/gym-junkie/details" }}
        right={{ text: "Muscle Heatmap", link: "/gym-junkie/details/muscle-heatmap" }}
      />
    </Box>
  );
}
