import { Avatar, Box, Button, Link, ListItemIcon, ListItemText, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import githubLogo from "../../assets/github-logo.png";
import expoLogo from "../../assets/expo-logo.webp";
import { finskaExpoLink, finskaGithubLink } from "../../middleware/links";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { buildBulletPoints } from "../../middleware/helpers";

export default function FinksaOverview() {
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
        When the sun is out and the weather is good, <Link href="https://www.finska.com.au/" target="_blank" rel="noopener">Finska</Link> is the game of choice my family to play.
      </Typography>
      <Typography>
        But after we exhausted the included score cards, we had to resort to using the notes app to keep score.
      </Typography>
      <Typography>
        Not ideal.
      </Typography>
      <Typography>
        So I whipped up this Finska Tracker app,
      </Typography>
      {buildBulletPoints([
        'Download and go, no sign in required',
        'Edit game rules and play your way',
        'Lightweight React TS',
      ])}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1
        }}
      >
        <Box>
          <Button 
            variant="outlined"
            href={finskaGithubLink}
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
        <Box>
          <Button 
            variant="outlined"
            href={finskaExpoLink}
            target="_blank"
            rel="noopener"
            startIcon={
              <Avatar
                alt="expo icon" 
                src={expoLogo}
                sx={{ 
                  width: 32, 
                  height: 32, 
                  marginRight: '10px'
                }}
              />
            }
          >
            Expo
          </Button>
        </Box>
      </Box>
    </Box>
  )
}