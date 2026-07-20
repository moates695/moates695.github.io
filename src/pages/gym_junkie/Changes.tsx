import { Box } from "@mui/material";
import { Reveal, GradientText, PageHeader, PageNav } from "../../components/design";
import { buildProjectChange } from "../../components/Changes";

export default function GymJunkieChanges() {
  return (
    <Box
      component="section"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: { xs: 3, sm: 4 }, pb: 4 }}
    >
      <PageHeader
        eyebrow="changes"
        title={
          <>
            Roadmap & <GradientText>releases</GradientText>
          </>
        }
        subtitle="What is shipping soon and what has landed already in Gym Junkie."
      />

      <Reveal delay={0.06}>{buildProjectChange("gym_junkie")}</Reveal>

      <PageNav left={{ text: "Details", link: "/gym-junkie/details" }} />
    </Box>
  );
}
