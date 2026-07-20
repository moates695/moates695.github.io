import { Box, Link, Typography } from "@mui/material";
import ShopIcon from "@mui/icons-material/Shop";
import { woodchuckPlayStoreLink } from "../../middleware/links";
import {
  Reveal,
  PageHeader,
  GradientText,
  SectionHeading,
  CheckList,
  ScreenshotGallery,
  ExternalButton,
  PageNav,
} from "../../components/design";

const ACCENT = "#82b1ff";

export default function WoodchuckOverview() {
  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 3, sm: 4 },
        pb: 4,
      }}
    >
      <PageHeader
        eyebrow="overview"
        title={
          <>
            Woodchuck <GradientText>scorer</GradientText>
          </>
        }
        subtitle="A download-and-go mobile scorer for Finska. Throw the log, tap the pins you knocked over, and land on exactly 50."
        actions={
          <ExternalButton href={woodchuckPlayStoreLink} icon={<ShopIcon />}>
            Play Store
          </ExternalButton>
        }
      />

      <Reveal delay={0.06}>
        <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 720 }}>
          When the sun is out and the weather is good,{" "}
          <Link
            href="https://en.wikipedia.org/wiki/M%C3%B6lkky"
            target="_blank"
            rel="noopener"
          >
            Finska
          </Link>{" "}
          (a.k.a. Molkky) is the game of choice for my family to play. Knock over
          the numbered pins to reach exactly 50: an easy game that gets awkward to
          score once the included cards run out and the notes app takes over. So I
          built Woodchuck to do the counting.
        </Typography>
      </Reveal>

      <Reveal delay={0.12}>
        <SectionHeading eyebrow="features">What it does</SectionHeading>
        <CheckList
          accent={ACCENT}
          columns={2}
          items={[
            "On-device only: no sign in, no backend, no tracking",
            "Players or teams, with rotating member throws",
            "Tap the pins you knocked over instead of counting yourself",
            "Tweak target score, reset score, miss limit and more in settings",
            "Light, dark and sand themes",
            "Auto-saves after every throw so you can pick up where you left off",
          ]}
        />
      </Reveal>

      <Reveal delay={0.18}>
        <SectionHeading eyebrow="screens">A look at the app</SectionHeading>
        <ScreenshotGallery
          accent={ACCENT}
          shots={[
            { src: "/woodchuck/setup.png", label: "Setup screen" },
            { src: "/woodchuck/game.png", label: "Play screen" },
            { src: "/woodchuck/settings.png", label: "Settings screen" },
          ]}
        />
      </Reveal>

      <PageNav right={{ text: "Design", link: "/woodchuck/design" }} />
    </Box>
  );
}
