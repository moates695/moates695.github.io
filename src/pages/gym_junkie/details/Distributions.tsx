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
  { src: "/gym_junkie/distributions_radar.png", label: "Distribution radar" },
];

export default function Distributions() {
  return (
    <Box
      component="section"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: { xs: 3, sm: 4 }, pb: 4 }}
    >
      <PageHeader
        eyebrow="gym junkie"
        title={
          <>
            Distributions and <GradientText>ratios</GradientText>
          </>
        }
        subtitle="Where is your training time actually going? A radar chart makes muscle-group balance instantly obvious."
      />

      <Reveal delay={0.06}>
        <SectionHeading eyebrow="the picture">Spot the gaps</SectionHeading>
        <CheckList
          accent={ACCENT}
          items={[
            "A radar chart shows your training split across muscle groups, so a neglected back is obvious next to well-worked chest and shoulders.",
            "Switch the metric between total volume, working sets and total reps to see the split from different angles.",
            "Adjust the time window to match your current training cycle.",
          ]}
        />
      </Reveal>

      <Reveal delay={0.12}>
        <Callout accent={ACCENT} title="reading the metrics">
          Each metric tells a slightly different story: volume biases towards heavier compounds, set
          count rewards spread, and rep count surfaces high-rep accessory work. Use the view before a
          deload to plan your next block, or just to keep yourself honest if you suspect you have been
          skipping certain muscle groups.
        </Callout>
      </Reveal>

      <Reveal delay={0.18}>
        <SectionHeading eyebrow="screens">See it in action</SectionHeading>
        <ScreenshotGallery shots={screenshots} accent={ACCENT} />
      </Reveal>

      <PageNav
        left={{ text: "Details", link: "/gym-junkie/details" }}
        right={{ text: "History and Calendar", link: "/gym-junkie/details/history-calendar" }}
      />
    </Box>
  );
}
