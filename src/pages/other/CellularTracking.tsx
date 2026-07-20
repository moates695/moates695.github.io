import { Avatar, Box } from "@mui/material";
import { cellularTrackingGithubLink } from "../../middleware/links";
import githubLogo from "../../assets/github-logo.png";
import {
  PageHeader,
  GradientText,
  Reveal,
  SectionHeading,
  Panel,
  Callout,
  CheckList,
  StatRow,
  ScreenshotGallery,
  ExternalButton,
  PageNav,
} from "../../components/design";

const ACCENT = "#ec407a";

const segmentSteps = [
  "Apply CLAHE (Contrast Limited Adaptive Histogram Equalisation) preprocessing.",
  "Calculate a histogram with 257 bins, then iterate to find an intensity threshold where the histogram stops decreasing consistently.",
  "Scale the selected intensity to form the final pixel threshold for segmentation.",
  "Create a binary mask of the pixels above the threshold.",
  "Apply a morphological open with a 5x5 rectangular kernel to remove noise and small artefacts.",
  "Flush cells touching the image border to prevent erosion from the frame edge.",
  "Apply watershed to separate touching cells.",
  "Apply a separate open to each cell within its own image space.",
  "Label the cells.",
  'Delete tiny "cells" that are likely background noise or out of focus.',
  "Compare flushed cells with current cells to decide their inclusion.",
];

const trackSteps = [
  "Compute centroids for the first frame of the sequence.",
  "Initialise tracking: global labels across frames, frame-specific centroid labels, and per-frame centroid displacement.",
  "For each frame, compute centroids for the current and next frame, plus the distance matrix between consecutive frames.",
  "Match centroids between frames with nearest neighbour, keeping only matches within a threshold (cells may appear mid-sequence).",
  "Assign global labels to each cell so it can be tracked between frames.",
  "Detect cells in the process of splitting and label these events, including in previous frames.",
  "Filter out small and short-lived cells as potential noise.",
  "For each frame, outline each cell in a colour based on its label id, highlight splitting events in white, and draw trajectories onto the image.",
];

const improvements = [
  "Use curvature based overlap detection instead of separation filtering methods.",
  "For cells that flash in and out of existence between frames, use a predictive model of their trajectory to link them across non-consecutive frames.",
  "Use the regions around these flashing cells to run a secondary, more aggressive segmentation in an attempt to locate the faint ones.",
];

export default function OtherCellularTracking() {
  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: { xs: 3, sm: 4 },
        pb: 4,
      }}
    >
      <PageHeader
        eyebrow="research"
        title={<>Cellular <GradientText>Tracking</GradientText></>}
        subtitle="A UNSW COMP9517 (Computer Vision) group project: segmenting cells and tracking their position, size and divisions across four provided microscopy sequences."
        actions={
          <ExternalButton
            href={cellularTrackingGithubLink}
            icon={<Avatar alt="github icon" src={githubLogo} sx={{ width: 24, height: 24 }} />}
          >
            GitHub
          </ExternalButton>
        }
      />

      <Reveal delay={0.06}>
        <Panel accent={ACCENT} wash>
          <StatRow
            items={[
              { value: "4", label: "image sequences" },
              { value: "COMP9517", label: "UNSW course" },
              { value: "Custom", label: "CV methods" },
            ]}
          />
        </Panel>
      </Reveal>

      <Reveal delay={0.12}>
        <Box sx={{ color: "text.secondary", lineHeight: 1.7 }}>
          I have included this in my personal projects because I did most of the legwork,
          and I really enjoyed working on it during lockdown. The solution leans on the usual
          Python ML libraries: OpenCV, scikit-image, matplotlib and SciPy, plus custom
          functions tailored to the problem.
        </Box>
        <Box sx={{ mt: 2 }}>
          <Callout accent={ACCENT} title="constraint">
            Transfer learning with existing neural networks was allowed, but as a computer
            vision course the mark would have been capped at a distinction, which is why the
            solution uses custom methods throughout.
          </Callout>
        </Box>
      </Reveal>

      <Reveal delay={0.18}>
        <SectionHeading eyebrow="step one">Segmenting</SectionHeading>
        <Box sx={{ color: "text.secondary", mb: 2 }}>
          To separate the cells from the background, each image in a sequence runs through:
        </Box>
        <CheckList items={segmentSteps} accent={ACCENT} />
        <Box sx={{ mt: 3 }}>
          <ScreenshotGallery
            accent={ACCENT}
            width={360}
            shots={[
              { src: "/segBefore.png", label: "Original image" },
              { src: "/segAfter.png", label: "Segmented image" },
            ]}
          />
        </Box>
      </Reveal>

      <Reveal delay={0.24}>
        <SectionHeading eyebrow="step two">Tracking</SectionHeading>
        <Box sx={{ color: "text.secondary", mb: 2 }}>
          With the cells segmented and labelled, they can be tracked across a sequence:
        </Box>
        <CheckList items={trackSteps} accent={ACCENT} />
        <Box
          component="video"
          src="/videos/output1_encoded.mp4"
          controls
          sx={{
            mt: 3,
            width: { xs: "100%", sm: "60%" },
            maxWidth: "100%",
            height: "auto",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            alignSelf: "center",
          }}
        />
      </Reveal>

      <Reveal delay={0.3}>
        <SectionHeading eyebrow="reflection">Improvements</SectionHeading>
        <Box sx={{ color: "text.secondary", mb: 2 }}>
          Apparently just segmenting some of the cells from the background was an achievement
          for this assignment, let alone tracking them over time. That said, with hindsight,
          here is what I would change:
        </Box>
        <CheckList items={improvements} accent={ACCENT} />
      </Reveal>

      <PageNav
        left={{ text: "Other Projects", link: "/other" }}
        right={{ text: "Downer Helper", link: "/other/downer-helper" }}
      />
    </Box>
  );
}
