import { Avatar, Box, Button, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import BottomNavigation from "../../components/BottomNavigation";
import { gymJunkieAppGithubLink, gymJunkieExpoLink, gymJunkieServerGithubLink } from "../../middleware/links";
import githubLogo from "../../assets/github-logo.png";
import expoLogo from "../../assets/expo-logo.webp";

export default function GymJunkieOverview() {
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
        I like to go to the gym, and recording reps and weight per set is essential 
        for progressive overload.
        <br/>
        What I don't particularly like is the idea of paying yet another subscription, 
        just for a fitness tracker that doesn't have all the features and customisation 
        that I reckon should be included for the price.
        <br/>
        So I am in the process of making Gym Junkie, a free fitness app built on a data
        analytics and tracking.
        <br/>
        Whether your an ego lifter or science based bro, this app should have something
        for you.
        <br/><br/>
        Yes, the frontend is clutered with buttons and data, and you can tell it was built
        by a backend engineer, but thats kind of the point. In my workouts I want to just
        enter data with no fuss, or have the capability to bring up comparisions and
        analytics without pressing through a bunch of menus.
        <br/>
        I am planning on adding friends to this in future, but without likes or comments. 
        You can check up on what your mates are up to if you want, and compare your workouts
        to theirs, but the focus should be on you and your fitness journey.
        <br/>
        Check out the next pages for more detail about the app, and what's coming next. 
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box
            component="img"
            src="/gymJunkieWorkout.png"
            alt="workout screen"
            sx={{width: 200}}
          />
          <Typography>
            Workout Screen
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box
            component="img"
            src="/gymJunkieHistoryData.png"
            alt="exercise history data"
            sx={{width: 200}}
          />
          <Typography>
            Exercise History Data
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box
            component="img"
            src="/gymJunkieOverviewCurrent.png"
            alt="current workout overview"
            sx={{width: 200}}
          />
          <Typography>
            Current Workout Overview
          </Typography>
        </Box>
      </Box>
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
            href={gymJunkieAppGithubLink}
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
            App
          </Button>
        </Box>
        <Box>
          <Button 
            variant="outlined"
            href={gymJunkieServerGithubLink}
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
            Server
          </Button>
        </Box>
        <Box>
          <Button 
            variant="outlined"
            href={gymJunkieExpoLink}
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
      {BottomNavigation({
        right:  {
          text: 'Functionality',
          link: '/gym-junkie/functionality'
        }
      })}
    </Box>
    
  )
}