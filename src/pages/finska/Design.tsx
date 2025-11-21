import { Box, Button, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../../components/BottomNavigation";
import { buildBulletPoints } from "../../middleware/helpers";

export default function FinksaDesign() {
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
      {BottomNavigation({
        left:  {
          text: 'Overview',
          link: '/finska'
        },
        right: {
          text: 'Changes',
          link: '/finska/changes'
        }
      })}
      <Typography>
        The Finska Tracker has to be easy to use, since players will likely be 
        downloading and setting up their games on the fly.
        <br/>
        The app has 3 main screens; setup, game and settings.
      </Typography>
      <Typography variant="h6">
        Game Setup
      </Typography>
      <Typography>
        When launching for the first time, users will first see the game setup screen. 
        Here they can add players or teams to the new game.
        <br/>
        Both player and team names are checked for case insensitive collisions. 
        Teams can have a single member, in case members want to join later.
        <br/>
        Players and teams can be removed by clicking on the edit icon.
        <br/>
        Clicking continue will take you to the main game screen.
      </Typography>
      <Typography variant="h6">
        Main Screen
      </Typography>
      <Typography>
        The main screen is comprised of 3 main components; scoreboard, up next card and score input.
      </Typography>
      <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
        Scoreboard
      </Typography>
      <Typography>
        The scoreboard shows critical game data, with participants ordered by descending 
        score, and alphabetically for ties.
        <br/>
        The current player has a highlighted border.
        <br/>
        If the white divider exists, all players above it can potentially win 
        on their next throw, while players below cannot.
        <br/>
        If the red divider exists, all players below it are currently eliminated!
      </Typography>
      <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
        Up Next Card
      </Typography>
      <Typography>
        The up next card is pretty simple, it just shows the current player whose turn
        it is, and the next player in the queue. 
        <br/>
        For the current player, it also shows their game data.
        <br/>
        For teams, it shows the member who is up next, where members have rotating turns.
        <br/>
        Pressing on the card reveals a modal, which is the complete list of participants
        who are up next.
      </Typography>
      <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
        Score Input
      </Typography>
      <Typography>
        In Finska, if you knock over a single pin you get that pins value as score, but if you
        knock over more than one then your score is the number of pins knocked over.
        <br/>
        So, instead of making users count up their score, they just tap the pins that
        they knocked over. Score is shown bottom left. 
        <br/>
        This opens up an easy rule modification in settings where 
        the pin value is always used.
        <br/>
        If a player misses, hitting the X will increase their number of misses, bringing
        them closer to elimination. 
      </Typography>
      <Typography variant="h6">
        Settings
      </Typography>
      <Typography>
        Up top, users can choose between the light, dark and sand themes.
        <br/>
        Users can change the following settings,
        {buildBulletPoints([
          'target score: the score players are trying land on',
          'reset score: players are reset to this if they go over the target score (can be negative)',
          'miss count: after these many misses, a player is eliminated',
          'elimination reset: if someone is eliminated, a player is reset to this score (can be negative)',
          'elimination turns: in not null, a player becomes un-eliminated after sitting out this many turns',
          'skip counts as miss: if true, a skip counts as a miss',
          'use pin value: if true and more than one pin is knocked down, sum the pin values'
        ])}
        If applying settings would cause a change to game state, 
        then the user is asked to confirm the change.
      </Typography>
      {BottomNavigation({
        left:  {
          text: 'Overview',
          link: '/finska'
        },
        right: {
          text: 'Changes',
          link: '/finska/changes'
        }
      })}
    </Box>
  )
}