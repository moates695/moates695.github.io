import { Box, Paper, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import BottomNavigation from "../../components/BottomNavigation";
import { buildBulletPoints } from "../../middleware/helpers";

export default function WoodchuckDesign() {
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
        Woodchuck is an Expo / React Native app that runs entirely on-device. The whole game - participants, scores, turn order, rules - is modelled as one XState v5 machine. Everything around it is either a pure function, a validator, or a dumb component that reads state and dispatches events.
      </Typography>

      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6">
          State Machine
        </Typography>
        <Typography>
          A single machine owns the full game context and decides which screen renders - there is no navigation library.
        </Typography>
        {buildBulletPoints([
          'idle → setup → playing (awaitingTurn / won / gameOver / finishing) → settings',
          'settings is reachable from both setup and playing; a return_to context value sends the user back to where they came from',
          'snapshot is persisted to AsyncStorage on every transition, then restored to idle on launch so the user chooses to continue or start fresh',
          'guards (hasEnoughParticipants, isWinningScore, removalInvalidates, …) defer all branching logic to pure helpers - the machine never inlines game rules',
        ])}
      </Paper>

      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6">
          Pure Game Logic
        </Typography>
        <Typography>
          All state transformations live in <code>game_logic.ts</code> as pure functions - <code>submitTurn</code>, <code>missTurn</code>, <code>editScore</code>, <code>cycleStanding</code>, <code>swapTeamMember</code> and so on. Each returns a partial context update that the machine feeds into an <code>assign</code> action.
          <br/>
          Because there is no XState or React in the file, the rules are trivial to unit test - the suite currently covers them with ~130 cases against jest.
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6">
          Centralised Validation
        </Typography>
        <Typography>
          One module exposes every predicate the rest of the app needs: <code>isNameTaken</code>, <code>validateNewPlayer</code>, <code>validateNewTeam</code>, <code>validateMemberName</code>, <code>validateRules</code>, <code>isGameValid</code>, <code>canWinThisTurn</code>.
          <br/>
          Components call them directly to drive real-time form feedback (disabled buttons, inline errors); the machine reuses the same functions inside its guards. There is no second source of truth for what counts as a valid name, team or rule set.
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6">
          Idle Screen
        </Typography>
        <Typography>
          The launch screen. If a saved game is present (started, two or more participants), the user can continue it; otherwise the only choice is a new game. Snapshot restoration handles the rest.
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6">
          Setup Screen
        </Typography>
        <Typography>
          Where players and teams are added.
        </Typography>
        {buildBulletPoints([
          'player and team names are checked for case-insensitive collisions across the whole game',
          'teams can hold a single member at first, so people can join part-way through',
          'edit mode reveals remove buttons and rename inputs',
          'continue is only enabled once isGameValid passes',
        ])}
      </Paper>

      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6">
          Play Screen
        </Typography>
        <Typography>
          Three components stacked in priority order: scoreboard, up-next card, score input.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontStyle: "italic", mt: 1 }}>
          Scoreboard
        </Typography>
        <Typography>
          Participants are ordered by descending score, then alphabetically for ties. The current player has a highlighted border.
          <br/>
          A white divider, if shown, marks the cutoff for who could win on their next throw. A red divider, if shown, marks everyone currently eliminated.
          <br/>
          Edit mode swaps the row tap target for direct score and miss-count editing - useful for fixing mis-taps without restarting.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontStyle: "italic", mt: 1 }}>
          Up Next Card
        </Typography>
        <Typography>
          Shows whose turn it is and who is on deck, with the current player's score and miss count. For teams, the throwing member is also shown - members rotate, and the order can be swapped from a long-press on the card.
          <br/>
          Tapping the card opens the full upcoming queue as a modal.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontStyle: "italic", mt: 1 }}>
          Score Input (Pin Map)
        </Typography>
        <Typography>
          In Finska, knocking over one pin scores that pin's value (1&ndash;12); knocking over multiple pins scores the count of pins. Rather than ask players to do that arithmetic, the pin map lets them tap the pins they hit and computes the score live in the corner.
          <br/>
          This is why the "always use pin value" rule mod is a one-line setting - the input already knows which pins were hit.
          <br/>
          The X button registers a miss and ticks the player closer to elimination.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 2, sm: 4 },
            width: '100%',
            justifyContent: 'center',
            mt: 2,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              component="img"
              src="/woodchuck/game_up_later.png"
              alt="up next queue"
              sx={{ width: { xs: 140, sm: 200 }, maxWidth: '42vw', height: 'auto' }}
            />
            <Typography variant="caption">Up Next queue</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              component="img"
              src="/woodchuck/game_swap_to.png"
              alt="team member swap"
              sx={{ width: { xs: 140, sm: 200 }, maxWidth: '42vw', height: 'auto' }}
            />
            <Typography variant="caption">Team member swap</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              component="img"
              src="/woodchuck/game_add_participant.png"
              alt="mid-game add participant"
              sx={{ width: { xs: 140, sm: 200 }, maxWidth: '42vw', height: 'auto' }}
            />
            <Typography variant="caption">Add participant mid-game</Typography>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6">
          Settings Screen
        </Typography>
        <Typography>
          Top of the screen toggles theme between light, dark and sand. Below that, every rule from the validator is exposed:
        </Typography>
        {buildBulletPoints([
          'target score - the number players are trying to land on (default 50)',
          'reset score - what overshoots collapse to (can be negative)',
          'miss count - consecutive misses before elimination',
          'elimination reset - score a returning player comes back on',
          'elimination turns - null for permanent, otherwise sit out N turns and re-enter',
          'skip counts as miss - whether skipping a turn ticks the miss counter',
          'use pin value - when true, multi-pin hits sum the pin values instead of counting pins',
        ])}
        <Typography>
          If new settings would invalidate the in-progress game (e.g. lowering miss count would immediately eliminate too many players), the user is asked to confirm before the rules are applied.
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6">
          Theme
        </Typography>
        <Typography>
          Theme lives outside the game machine as two Jotai atoms - one stores the light/dark/sand selection, the other derives the full palette. Components subscribe with <code>useAtomValue</code>, so a theme change re-renders the UI without touching game state.
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6">
          Testing
        </Typography>
        <Typography>
          Three jest suites under <code>tests/</code>:
        </Typography>
        {buildBulletPoints([
          'game_logic.test.ts - pure function coverage of every rule branch',
          'validation.test.ts - predicate coverage including edge cases like empty names and duplicate teams',
          'machine.test.ts - XState transition coverage, using object syntax for nested state matches',
        ])}
        <Typography>
          AsyncStorage and expo-crypto are mocked in <code>jest.setup.js</code> so the suites run without a device.
        </Typography>
      </Paper>

      {BottomNavigation({
        left:  {
          text: 'Overview',
          link: '/woodchuck'
        },
        right: {
          text: 'Changes',
          link: '/woodchuck/changes'
        }
      })}
    </Box>
  )
}
