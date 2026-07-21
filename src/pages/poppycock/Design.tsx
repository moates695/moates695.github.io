import { Box, Typography } from "@mui/material";
import HubIcon from "@mui/icons-material/Hub";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import StorageIcon from "@mui/icons-material/Storage";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import {
  Reveal,
  GradientText,
  PageHeader,
  SectionHeading,
  Panel,
  FeatureCard,
  CardGrid,
  CheckList,
  StatRow,
  Callout,
  PageNav,
} from "../../components/design";
import { SectionNavLayout, Section } from "../../components/SectionNav";

const ACCENT = "#d8aa78";

const SECTIONS: Section[] = [
  { id: "backend", label: "Backend process" },
  { id: "persistence", label: "Persistence" },
  { id: "round-phases", label: "Round phases" },
  { id: "mobile-client", label: "Mobile client" },
];

export default function PoppycockDesign() {
  return (
    <SectionNavLayout sections={SECTIONS}>
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
        eyebrow="design"
        title={
          <>
            System <GradientText>architecture</GradientText>
          </>
        }
        subtitle="Poppycock is split across two repos that share a single hand-mirrored protocol: a FastAPI backend and an Expo / React Native mobile client."
      />

      <Reveal delay={0.06}>
        <StatRow
          items={[
            { value: "2", label: "repos, one protocol" },
            { value: "3", label: "backend layers" },
            { value: "3", label: "round phases" },
          ]}
        />
      </Reveal>

      <Reveal delay={0.12} id="backend">
        <SectionHeading eyebrow="backend">A single uvicorn process</SectionHeading>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, maxWidth: 720 }}>
          One process, layered into transport, dispatch and domain so each
          concern stays isolated and testable.
        </Typography>
        <CardGrid>
          <FeatureCard
            accent={ACCENT}
            icon={<HubIcon />}
            title="Transport"
            blurb="REST endpoints for room create and join, plus a /ws/{room}/{player} WebSocket for live play."
          />
          <FeatureCard
            accent={ACCENT}
            icon={<CallSplitIcon />}
            title="Dispatch"
            blurb="Switches on message type, validates with pydantic, and enforces host, dasher and phase authorisation."
          />
          <FeatureCard
            accent={ACCENT}
            icon={<StorageIcon />}
            title="Domain"
            blurb="A RoomManager owns the in-memory rooms dict and is the only thing that talks to Postgres."
          />
        </CardGrid>
        <Box sx={{ mt: 2 }}>
          <Callout accent={ACCENT} title="testability">
            Pure helpers like shuffle_answers and compute_score_deltas live at
            module level, so they are trivially testable in isolation.
          </Callout>
        </Box>
      </Reveal>

      <Reveal delay={0.18} id="persistence">
        <SectionHeading eyebrow="persistence">A durable shell, live rounds in memory</SectionHeading>
        <Panel accent={ACCENT} wash>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
            Postgres stores the persistent shell only: rooms, players, scores,
            dasher order, round metadata, submissions, votes and score deltas.
            Active round state (the real answer, fake answers, the shuffled list,
            votes and score deltas) lives only in memory on the Round dataclass.
          </Typography>
          <Callout accent={ACCENT} title="restart behaviour">
            A restart mid-round leaves that round unrecoverable, so the host
            starts a new one. Hydration only rebuilds the shell.
          </Callout>
        </Panel>
      </Reveal>

      <Reveal delay={0.24} id="round-phases">
        <SectionHeading eyebrow="round phases">Three phases per round</SectionHeading>
        <CheckList
          accent={ACCENT}
          items={[
            "collecting: only the dasher submits the real answer; only non-dashers submit fakes",
            "voting: answers are shuffled and sent without attribution",
            "scored: attribution is revealed alongside score deltas",
          ]}
        />
      </Reveal>

      <Reveal delay={0.3} id="mobile-client">
        <SectionHeading eyebrow="mobile client">Three screens, one conditional</SectionHeading>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, maxWidth: 720 }}>
          Three logical screens are swapped by a single conditional in App.tsx
          based on the room code and round phase.
        </Typography>
        <CardGrid>
          <FeatureCard
            accent={ACCENT}
            icon={<PhoneIphoneIcon />}
            title="HomeScreen"
            blurb="Create or join a room."
          />
          <FeatureCard
            accent={ACCENT}
            icon={<PhoneIphoneIcon />}
            title="LobbyScreen"
            blurb="Roster, host controls and optional dasher rotation."
          />
          <FeatureCard
            accent={ACCENT}
            icon={<PhoneIphoneIcon />}
            title="GameScreen"
            blurb="Phase-driven internally for collecting, voting and scored."
          />
        </CardGrid>
        <Box sx={{ mt: 2 }}>
          <CheckList
            accent={ACCENT}
            items={[
              "GameProvider uses a useReducer-based context; useGameSocket owns the WebSocket lifecycle and reconnect",
              "protocol.ts is a hand-mirrored copy of the backend pydantic models, so both update in the same change",
            ]}
          />
        </Box>
      </Reveal>

      <PageNav
        left={{ text: "Overview", link: "/poppycock" }}
        right={{ text: "Changes", link: "/poppycock/changes" }}
      />
    </Box>
    </SectionNavLayout>
  );
}
