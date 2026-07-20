import { Box, Typography } from "@mui/material";
import {
  Reveal,
  PageHeader,
  GradientText,
  SectionHeading,
  Panel,
  CheckList,
  Callout,
  ScreenshotGallery,
  PageNav,
} from "../../components/design";

const ACCENT = "#82b1ff";

/** Inline monospace code token. */
function Code({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component="code"
      sx={{
        fontFamily: "monospace",
        fontSize: "0.9em",
        px: 0.5,
        py: "1px",
        borderRadius: 1,
        bgcolor: "action.hover",
      }}
    >
      {children}
    </Box>
  );
}

export default function WoodchuckDesign() {
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
        eyebrow="design"
        title={
          <>
            How Woodchuck <GradientText>works</GradientText>
          </>
        }
        subtitle="An Expo / React Native app that runs entirely on-device. The whole game (participants, scores, turn order, rules) is one XState v5 machine; everything around it is a pure function, a validator, or a dumb component that reads state and dispatches events."
      />

      <Reveal delay={0.06}>
        <SectionHeading eyebrow="architecture">Core building blocks</SectionHeading>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Panel accent={ACCENT} wash>
            <SectionHeading sx={{ mb: 1 }}>State machine</SectionHeading>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 1.5 }}>
              A single machine owns the full game context and decides which screen
              renders, so there is no navigation library.
            </Typography>
            <CheckList
              accent={ACCENT}
              items={[
                "idle to setup to playing (awaitingTurn / won / gameOver / finishing) to settings",
                "settings is reachable from both setup and playing; a return_to context value sends the user back to where they came from",
                "snapshot is persisted to AsyncStorage on every transition, then restored to idle on launch so the user chooses to continue or start fresh",
                "guards (hasEnoughParticipants, isWinningScore, removalInvalidates, and so on) defer all branching logic to pure helpers, so the machine never inlines game rules",
              ]}
            />
          </Panel>

          <Panel accent={ACCENT} wash>
            <SectionHeading sx={{ mb: 1 }}>Pure game logic</SectionHeading>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              All state transformations live in <Code>game_logic.ts</Code> as pure
              functions: <Code>submitTurn</Code>, <Code>missTurn</Code>,{" "}
              <Code>editScore</Code>, <Code>cycleStanding</Code>,{" "}
              <Code>swapTeamMember</Code> and so on. Each returns a partial context
              update that the machine feeds into an <Code>assign</Code> action.
              Because there is no XState or React in the file, the rules are trivial
              to unit test: the suite currently covers them with around 130 cases
              against jest.
            </Typography>
          </Panel>

          <Panel accent={ACCENT} wash>
            <SectionHeading sx={{ mb: 1 }}>Centralised validation</SectionHeading>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              One module exposes every predicate the rest of the app needs:{" "}
              <Code>isNameTaken</Code>, <Code>validateNewPlayer</Code>,{" "}
              <Code>validateNewTeam</Code>, <Code>validateMemberName</Code>,{" "}
              <Code>validateRules</Code>, <Code>isGameValid</Code>,{" "}
              <Code>canWinThisTurn</Code>. Components call them directly to drive
              real-time form feedback (disabled buttons, inline errors); the machine
              reuses the same functions inside its guards. There is no second source
              of truth for what counts as a valid name, team or rule set.
            </Typography>
          </Panel>
        </Box>
      </Reveal>

      <Reveal delay={0.12}>
        <SectionHeading eyebrow="screens">Idle and setup</SectionHeading>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Panel accent={ACCENT}>
            <SectionHeading sx={{ mb: 1 }}>Idle screen</SectionHeading>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              The launch screen. If a saved game is present (started, two or more
              participants), the user can continue it; otherwise the only choice is a
              new game. Snapshot restoration handles the rest.
            </Typography>
          </Panel>

          <Panel accent={ACCENT}>
            <SectionHeading sx={{ mb: 1 }}>Setup screen</SectionHeading>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 1.5 }}>
              Where players and teams are added.
            </Typography>
            <CheckList
              accent={ACCENT}
              items={[
                "player and team names are checked for case-insensitive collisions across the whole game",
                "teams can hold a single member at first, so people can join part-way through",
                "edit mode reveals remove buttons and rename inputs",
                "continue is only enabled once isGameValid passes",
              ]}
            />
          </Panel>
        </Box>
      </Reveal>

      <Reveal delay={0.18}>
        <SectionHeading eyebrow="gameplay">Play screen</SectionHeading>
        <Panel accent={ACCENT} wash>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
            Three components stacked in priority order: scoreboard, up-next card,
            score input.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
            Scoreboard
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
            Participants are ordered by descending score, then alphabetically for
            ties. The current player has a highlighted border. A white divider, if
            shown, marks the cutoff for who could win on their next throw; a red
            divider marks everyone currently eliminated. Edit mode swaps the row tap
            target for direct score and miss-count editing, useful for fixing
            mis-taps without restarting.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
            Up next card
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
            Shows whose turn it is and who is on deck, with the current player's
            score and miss count. For teams, the throwing member is also shown:
            members rotate, and the order can be swapped from a long-press on the
            card. Tapping the card opens the full upcoming queue as a modal.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
            Score input (pin map)
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
            In Finska, knocking over one pin scores that pin's value (1 to 12);
            knocking over multiple pins scores the count of pins. Rather than ask
            players to do that arithmetic, the pin map lets them tap the pins they
            hit and computes the score live in the corner. This is why the "always
            use pin value" rule mod is a one-line setting: the input already knows
            which pins were hit. The X button registers a miss and ticks the player
            closer to elimination.
          </Typography>

          <ScreenshotGallery
            accent={ACCENT}
            shots={[
              { src: "/woodchuck/game_up_later.png", label: "Up next queue" },
              { src: "/woodchuck/game_swap_to.png", label: "Team member swap" },
              {
                src: "/woodchuck/game_add_participant.png",
                label: "Add participant mid-game",
              },
            ]}
          />
        </Panel>
      </Reveal>

      <Reveal delay={0.24}>
        <SectionHeading eyebrow="rules">Settings</SectionHeading>
        <Panel accent={ACCENT}>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 1.5 }}>
            Top of the screen toggles theme between light, dark and sand. Below
            that, every rule from the validator is exposed:
          </Typography>
          <CheckList
            accent={ACCENT}
            columns={2}
            items={[
              "target score: the number players are trying to land on (default 50)",
              "reset score: what overshoots collapse to (can be negative)",
              "miss count: consecutive misses before elimination",
              "elimination reset: score a returning player comes back on",
              "elimination turns: null for permanent, otherwise sit out N turns and re-enter",
              "skip counts as miss: whether skipping a turn ticks the miss counter",
              "use pin value: when true, multi-pin hits sum the pin values instead of counting pins",
            ]}
          />
          <Box sx={{ mt: 2 }}>
            <Callout accent={ACCENT} title="safe changes">
              If new settings would invalidate the in-progress game (for example,
              lowering miss count would immediately eliminate too many players), the
              user is asked to confirm before the rules are applied.
            </Callout>
          </Box>
        </Panel>
      </Reveal>

      <Reveal delay={0.3}>
        <SectionHeading eyebrow="internals">Theme and testing</SectionHeading>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Panel accent={ACCENT}>
            <SectionHeading sx={{ mb: 1 }}>Theme</SectionHeading>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Theme lives outside the game machine as two Jotai atoms: one stores the
              light/dark/sand selection, the other derives the full palette.
              Components subscribe with <Code>useAtomValue</Code>, so a theme change
              re-renders the UI without touching game state.
            </Typography>
          </Panel>

          <Panel accent={ACCENT}>
            <SectionHeading sx={{ mb: 1 }}>Testing</SectionHeading>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 1.5 }}>
              Three jest suites under <Code>tests/</Code>:
            </Typography>
            <CheckList
              accent={ACCENT}
              items={[
                "game_logic.test.ts: pure function coverage of every rule branch",
                "validation.test.ts: predicate coverage including edge cases like empty names and duplicate teams",
                "machine.test.ts: XState transition coverage, using object syntax for nested state matches",
              ]}
            />
            <Typography variant="body1" sx={{ color: "text.secondary", mt: 1.5 }}>
              AsyncStorage and expo-crypto are mocked in <Code>jest.setup.js</Code>{" "}
              so the suites run without a device.
            </Typography>
          </Panel>
        </Box>
      </Reveal>

      <PageNav
        left={{ text: "Overview", link: "/woodchuck" }}
        right={{ text: "Changes", link: "/woodchuck/changes" }}
      />
    </Box>
  );
}
