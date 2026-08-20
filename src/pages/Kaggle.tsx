import { Avatar, Box, Typography } from "@mui/material";
import { kaggleCellTrackingLink, kaggleProfileLink } from "../middleware/links";
import kaggleLogo from "../assets/kaggle-logo.svg";
import MarkdownBlock from "../components/MarkdownBlock";
import OnThisPage from "../components/OnThisPage";
import { SectionNavLayout, Section } from "../components/SectionNav";
import { MONO } from "../styles/tokens";
import {
  PageHeader,
  GradientText,
  Reveal,
  SectionHeading,
  Panel,
  Callout,
  StatRow,
  ExternalButton,
  PageNav,
} from "../components/design";

const ACCENT = "#d8aa78";
// The cool half of the site's accent pair, used here for anything still moving:
// the in-progress milestone and the "more to come" note.
const COOL = "#8fd0d4";

/**
 * "Kaggle" is a single hub page listing the competitions I enter, one section
 * per competition, in the same shape as the Small Projects page: a sticky
 * `OnThisPage` pill bar naming each entry, plus the numbered rail on `md`+.
 *
 * Every entry is published under one rule: while a competition is running its
 * repository stays private, so a section carries the public brief, the status,
 * the scores and the progress, and never the approach. Adding a competition is:
 * append to `ENTRIES`, then render a matching `<Box id=...>` section below.
 */
const ENTRIES: Section[] = [{ id: "cell-tracking", label: "Cell Tracking" }];

/* ── Entry building blocks ────────────────────────────────────────────── */

type MilestoneState = "done" | "active" | "todo";

interface Milestone {
  state: MilestoneState;
  text: string;
}

/**
 * Where an entry is up to, one line per stage: a filled gold dot for finished,
 * a lit cyan ring for the stage being worked on, and a hollow outline for what
 * is still ahead.
 */
function Milestones({ items }: { items: Milestone[] }) {
  return (
    <Box sx={{ display: "grid", gap: 1.25 }}>
      {items.map((m) => {
        const done = m.state === "done";
        const active = m.state === "active";
        return (
          <Box key={m.text} sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
            <Box
              component="span"
              sx={{
                mt: "7px",
                width: 10,
                height: 10,
                borderRadius: "50%",
                flexShrink: 0,
                border: "1px solid",
                borderColor: done ? ACCENT : active ? COOL : "divider",
                bgcolor: done ? ACCENT : active ? `${COOL}33` : "transparent",
                boxShadow: done ? `0 0 6px ${ACCENT}` : active ? `0 0 8px ${COOL}` : "none",
              }}
            />
            <Typography
              variant="body1"
              sx={{ color: done ? "text.secondary" : active ? "text.primary" : "text.disabled" }}
            >
              {m.text}
              {active && (
                <Box
                  component="span"
                  sx={{
                    fontFamily: MONO,
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: COOL,
                    ml: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  in progress
                </Box>
              )}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

interface Submission {
  /** Day the notebook was scored, e.g. "20 Aug 2026". */
  date: string;
  /** What the submission was, in one short phrase. */
  label: string;
  /** Public leaderboard score, as Kaggle reports it. */
  score: string;
}

const labelSx = {
  fontFamily: MONO,
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "text.disabled",
} as const;

/**
 * Scored submissions for an entry, newest first. Until a notebook has been
 * graded there is nothing honest to show, so the empty state says so rather
 * than filling the table with placeholders.
 */
function Scoreboard({ rows, empty }: { rows: Submission[]; empty: string }) {
  return (
    <Panel accent={ACCENT}>
      <Typography sx={labelSx}>Leaderboard</Typography>
      {rows.length === 0 ? (
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
          {empty}
        </Typography>
      ) : (
        // The table sets its own minimum width and scrolls inside this box, so a
        // narrow phone never pushes the page sideways.
        <Box sx={{ overflowX: "auto", mt: 1.5 }}>
          <Box component="table" sx={{ width: "100%", minWidth: 380, borderCollapse: "collapse" }}>
            <Box component="thead">
              <Box component="tr">
                {["Date", "Submission", "Score"].map((h) => (
                  <Box
                    key={h}
                    component="th"
                    sx={{
                      ...labelSx,
                      textAlign: h === "Score" ? "right" : "left",
                      py: 1,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {rows.map((r) => (
                <Box key={`${r.date}-${r.label}`} component="tr">
                  <Box
                    component="td"
                    sx={{ fontFamily: MONO, fontSize: 13, color: "text.disabled", py: 1.25, pr: 2, whiteSpace: "nowrap" }}
                  >
                    {r.date}
                  </Box>
                  <Box component="td" sx={{ color: "text.secondary", fontSize: 14, py: 1.25, pr: 2 }}>
                    {r.label}
                  </Box>
                  <Box
                    component="td"
                    sx={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: ACCENT, py: 1.25, textAlign: "right" }}
                  >
                    {r.score}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Panel>
  );
}

/* ── Cell Tracking ────────────────────────────────────────────────────── */

const cellTrackingBrief = `[Biohub Cell Tracking During Development](${kaggleCellTrackingLink}) asks for algorithms that follow cells through 3D time-lapse microscopy of developing zebrafish embryos: detect every cell, link it from one frame to the next, and catch the moment it divides so the lineage branches correctly. Done by hand this is the bottleneck the competition exists to remove, with researchers spending days tracking thousands of near-identical cells that move, deform and divide.

Scoring combines how accurately cells are linked across time with how well divisions are found. Entries run as Kaggle notebooks with no internet access and a 12 hour limit for the whole hidden test set, so anything the run needs has to be packed up and shipped with the notebook.`;

const cellTrackingMilestones: Milestone[] = [
  {
    state: "done",
    text: "Competition data pulled down and verified locally: 199 training samples of 3D time-lapse microscopy, about 87 GB of volumes plus their ground-truth lineage graphs.",
  },
  {
    state: "done",
    text: "A local scorer that reimplements the competition metric, so a change can be measured the moment it is made rather than waiting on the leaderboard.",
  },
  {
    state: "active",
    text: "Detection: finding the cells in each 3D volume.",
  },
  {
    state: "todo",
    text: "Linking: associating detections across timepoints into tracks.",
  },
  {
    state: "todo",
    text: "Divisions: branching each lineage where a cell splits in two.",
  },
  {
    state: "todo",
    text: "A submission notebook that runs the full hidden test set inside the 12 hour, no internet limit.",
  },
];

const cellTrackingSubmissions: Submission[] = [];

function CellTracking() {
  return (
    <Box id="cell-tracking" sx={{ display: "flex", flexDirection: "column", gap: { xs: 3, sm: 4 } }}>
      <Reveal>
        <SectionHeading eyebrow="biohub, 3d microscopy">
          Cell Tracking <GradientText>During Development</GradientText>
        </SectionHeading>
        <MarkdownBlock>{cellTrackingBrief}</MarkdownBlock>
        <Box sx={{ mt: 1 }}>
          <ExternalButton
            href={kaggleCellTrackingLink}
            icon={<Avatar alt="kaggle icon" src={kaggleLogo} sx={{ width: 24, height: 24 }} />}
          >
            Competition
          </ExternalButton>
        </Box>
      </Reveal>

      <Reveal delay={0.06}>
        <Panel accent={ACCENT} wash>
          <StatRow
            items={[
              { value: "199", label: "training samples" },
              { value: "87 GB", label: "of 3D microscopy" },
              { value: "12 h", label: "notebook budget" },
              { value: "3", label: "stages to solve" },
            ]}
          />
        </Panel>
        <Callout accent={ACCENT} title="status">
          In progress. The data is local and the scoring harness is built, with the detection stage
          under way. Nothing has been submitted yet, so there is no leaderboard score to report.
        </Callout>
      </Reveal>

      <Reveal delay={0.12}>
        <SectionHeading eyebrow="results">Scored submissions</SectionHeading>
        <Scoreboard
          rows={cellTrackingSubmissions}
          empty="No submission yet. Every scored notebook is added here, newest first, with the public leaderboard score exactly as Kaggle reports it."
        />
      </Reveal>

      <Reveal delay={0.18}>
        <SectionHeading eyebrow="progress">Where it is up to</SectionHeading>
        <Milestones items={cellTrackingMilestones} />
      </Reveal>

      <Reveal delay={0.24}>
        <Callout accent={COOL} title="methods stay private">
          This one is still running, so its repository is private and there is no source link on this
          entry. Progress and scores go up as they happen; how it actually works follows once the
          competition closes.
        </Callout>
      </Reveal>
    </Box>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function Kaggle() {
  return (
    <SectionNavLayout sections={ENTRIES}>
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
          eyebrow="competitions"
          title={<>Kaggle <GradientText>Competitions</GradientText></>}
          subtitle="Machine learning competitions I am entering, each tracked here from the first commit to the final submission. Results go up as they land, and because a live competition means a private repository, what you get is the brief, the status and the numbers rather than the method."
          actions={
            kaggleProfileLink ? (
              <ExternalButton
                href={kaggleProfileLink}
                icon={<Avatar alt="kaggle icon" src={kaggleLogo} sx={{ width: 24, height: 24 }} />}
              >
                Kaggle profile
              </ExternalButton>
            ) : undefined
          }
        />

        <OnThisPage items={ENTRIES} />

        <CellTracking />

        <Reveal>
          <Callout accent={COOL} title="up next">
            New entries land on this page as I join competitions, each with its own brief, status,
            results table and progress list.
          </Callout>
        </Reveal>

        <PageNav
          left={{ text: "Projects", link: "/projects" }}
          right={{ text: "Cellular Tracking", link: "/other/cellular-tracking" }}
        />
      </Box>
    </SectionNavLayout>
  );
}
