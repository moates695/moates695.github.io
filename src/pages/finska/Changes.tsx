import { Box } from "@mui/material";
import { buildProjectChange } from "../../components/Changes";
import { Reveal, PageHeader, GradientText, PageNav } from "../../components/design";

export default function WoodchuckChanges() {
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
        eyebrow="changes"
        title={
          <>
            Roadmap and <GradientText>releases</GradientText>
          </>
        }
        subtitle="What is shipped and what is planned next for Woodchuck."
      />

      <Reveal delay={0.06}>{buildProjectChange("finska")}</Reveal>

      <PageNav left={{ text: "Design", link: "/woodchuck/design" }} />
    </Box>
  );
}
