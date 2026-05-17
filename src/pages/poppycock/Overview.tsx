import { Avatar, Box, Button, Link, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import githubLogo from "../../assets/github-logo.png";
import { balderdashGithubLink } from "../../middleware/links";
import { buildBulletPoints } from "../../middleware/helpers";
import BottomNavigation from "../../components/BottomNavigation";

export default function PoppycockOverview() {
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
        Overview
      </Typography>
      <Typography>
        Poppycock is a real-time companion app for the physical <Link href="https://en.wikipedia.org/wiki/Balderdash" target="_blank" rel="noopener">Balderdash</Link> card game. The cards still drive the prompts - the app just handles the fiddly bits the score pad and slips of paper used to.
      </Typography>
      <Typography>
        The dasher reads a card, types in the real answer, and everyone else submits their bluff from their phone. The app shuffles them, runs the vote anonymously, and tallies the score deltas at the end of the round.
      </Typography>
      {buildBulletPoints([
        'Create a room and share the code with the people around the table',
        'Rotating dasher each round, host controls game flow',
        'Real-time updates over WebSocket',
        'Persistent scores so the same group can keep playing across nights',
      ])}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="outlined"
          href={balderdashGithubLink}
          target="_blank"
          rel="noopener"
          startIcon={
            <Avatar
              alt="github icon"
              src={githubLogo}
              sx={{
                width: 32,
                height: 32,
                marginRight: '10px'
              }}
            />
          }
        >
          GitHub
        </Button>
      </Box>
      {BottomNavigation({
        right: {
          text: 'Design',
          link: '/poppycock/design'
        }
      })}
    </Box>
  )
}
