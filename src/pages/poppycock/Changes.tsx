import { Box } from "@mui/material";
import { buildProjectChange } from "../../components/Changes";
import { Reveal, GradientText, PageHeader, PageNav } from "../../components/design";

export default function PoppycockChanges() {
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
        subtitle="What has shipped for Poppycock and what is planned next."
      />

      <Reveal delay={0.06}>{buildProjectChange("balderdash")}</Reveal>

      <PageNav left={{ text: "Design", link: "/poppycock/design" }} />
    </Box>
  );
}
