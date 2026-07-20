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
  { src: "/gym_junkie/heartrate_settings.png", label: "Heart rate settings" },
];

export default function RestTimerHeartRate() {
  return (
    <Box
      component="section"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: { xs: 3, sm: 4 }, pb: 4 }}
    >
      <PageHeader
        eyebrow="gym junkie"
        title={<>Rest timer <GradientText>and heart rate</GradientText></>}
        subtitle="Keep your rest honest and see exactly how hard you pushed each session."
      />

      <Reveal delay={0.06}>
        <SectionHeading eyebrow="between sets">Built-in rest timer</SectionHeading>
        <CheckList
          accent={ACCENT}
          items={[
            "Kicks off automatically when you log a set.",
            "Floats above your workout so it never hides what you were doing.",
            "Dismiss or adjust it any time.",
          ]}
        />
        <Box sx={{ mt: 2 }}>
          <Callout accent={ACCENT}>
            If you lose track of time scrolling between sets, this stops your "60 seconds" rest
            from quietly becoming three minutes.
          </Callout>
        </Box>
      </Reveal>

      <Reveal delay={0.12}>
        <SectionHeading eyebrow="measure the effort">Bluetooth heart rate</SectionHeading>
        <CheckList
          accent={ACCENT}
          items={[
            "Pairs with Bluetooth heart-rate monitors: pop your strap on, pair it once in settings, and your live heart rate shows up during the workout.",
            "Samples are stored against the workout, so you can look back at how hard you actually pushed each session.",
          ]}
        />
        <Box sx={{ mt: 2 }}>
          <Callout accent={ACCENT} title="set and forget">
            The app remembers your device and reconnects on its own when you start your next
            workout.
          </Callout>
        </Box>
      </Reveal>

      <Reveal delay={0.18}>
        <ScreenshotGallery shots={screenshots} accent={ACCENT} />
      </Reveal>

      <PageNav
        left={{ text: "Details", link: "/gym-junkie/details" }}
        right={{ text: "Muscle Targets", link: "/gym-junkie/details/muscle-targets" }}
      />
    </Box>
  );
}
