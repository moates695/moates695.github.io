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
  { src: "/gym_junkie/distributions_heatmap.png", label: "Muscle heatmap" },
];

export default function MuscleHeatmap() {
  return (
    <Box
      component="section"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: { xs: 3, sm: 4 }, pb: 4 }}
    >
      <PageHeader
        eyebrow="gym junkie"
        title={<>Muscle <GradientText>heatmap</GradientText></>}
        subtitle="The fastest way to spot a training gap before it becomes an imbalance."
      />

      <Reveal delay={0.06}>
        <SectionHeading eyebrow="see the picture">Body diagram at a glance</SectionHeading>
        <CheckList
          accent={ACCENT}
          items={[
            "A body diagram coloured by how recently and how heavily each muscle has been worked.",
            "Bright muscles are fresh in the program, faded ones are starting to fall behind.",
            "A frequency view on the home screen shows training counts per muscle group over your chosen window, from the past 7 days to 14 days or however long your rotation runs.",
          ]}
        />
        <Box sx={{ mt: 2 }}>
          <Callout accent={ACCENT}>
            Pair the heatmap with the frequency view and you can answer "have I done enough back
            this week?" without scrolling through a single workout log.
          </Callout>
        </Box>
      </Reveal>

      <Reveal delay={0.12}>
        <SectionHeading eyebrow="make it yours">Tune it to your style</SectionHeading>
        <CheckList
          accent={ACCENT}
          items={[
            "Adjust the colour scale to match how you read intensity.",
            "Set the time window to suit your split, whether that is a tight push-pull-legs rotation or a more ad-hoc approach.",
          ]}
        />
      </Reveal>

      <Reveal delay={0.18}>
        <ScreenshotGallery shots={screenshots} accent={ACCENT} />
      </Reveal>

      <PageNav
        left={{ text: "Details", link: "/gym-junkie/details" }}
        right={{ text: "Exercise Stats", link: "/gym-junkie/details/exercise-stats" }}
      />
    </Box>
  );
}
