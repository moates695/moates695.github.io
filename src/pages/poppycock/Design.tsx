import { Box, Paper, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import BottomNavigation from "../../components/BottomNavigation";
import { buildBulletPoints } from "../../middleware/helpers";

export default function PoppycockDesign() {
  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        gap: '10px',
      }}
    >
      <PageLinks />
      <Typography variant="h5">
        Design
      </Typography>
      <Typography>
        Poppycock is split across two repos that share a single hand-mirrored protocol - a FastAPI backend and an Expo / React Native mobile client.
      </Typography>
      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6">
          Backend
        </Typography>
        <Typography>
          A single uvicorn process layered into transport, dispatch and domain.
        </Typography>
        {buildBulletPoints([
          'transport: REST endpoints for room create/join and a /ws/{room}/{player} WebSocket',
          'dispatch: switches on message type, validates with pydantic, enforces host/dasher/phase authorisation',
          'domain: a RoomManager owns the in-memory rooms dict and is the only thing that talks to Postgres',
          'pure helpers like shuffle_answers and compute_score_deltas live at module level so they are trivially testable',
        ])}
      </Paper>
      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6">
          Persistence Model
        </Typography>
        <Typography>
          Postgres stores the persistent shell only - rooms, players, scores, dasher order, round metadata, submissions, votes and score deltas.
          <br/>
          Active round state (the real answer, fake answers, the shuffled list, votes, score deltas) lives only in memory on the Round dataclass.
          <br/>
          A restart mid-round leaves that round unrecoverable; the host starts a new one. Hydration only rebuilds the shell.
        </Typography>
      </Paper>
      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6">
          Round Phases
        </Typography>
        <Typography>
          Each round walks through three phases.
        </Typography>
        {buildBulletPoints([
          'collecting: only the dasher submits the real answer; only non-dashers submit fakes',
          'voting: answers are shuffled and sent without attribution',
          'scored: attribution is revealed alongside score deltas',
        ])}
      </Paper>
      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6">
          Mobile Client
        </Typography>
        <Typography>
          Three logical screens swapped by a single conditional in App.tsx based on the room code and round phase.
        </Typography>
        {buildBulletPoints([
          'HomeScreen: create or join a room',
          'LobbyScreen: roster, host controls and optional dasher rotation',
          'GameScreen: phase-driven internally for collecting, voting and scored',
          'GameProvider uses a useReducer-based context; useGameSocket owns the WebSocket lifecycle and reconnect',
          'protocol.ts is a hand-mirrored copy of the backend pydantic models - both update in the same change',
        ])}
      </Paper>
      {BottomNavigation({
        left: {
          text: 'Overview',
          link: '/poppycock'
        },
        right: {
          text: 'Changes',
          link: '/poppycock/changes'
        }
      })}
    </Box>
  )
}
