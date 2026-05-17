import { Box, Button, Typography } from "@mui/material";
import ShopIcon from "@mui/icons-material/Shop";
import PageLinks from "../../components/PageLinks";
import BottomNavigation from "../../components/BottomNavigation";
import { gymJunkiePlayStoreLink } from "../../middleware/links";

const screenshots = [
  { src: "/gym_junkie/workout_screen.png", label: "Workout Screen" },
  { src: "/gym_junkie/workout_exercise_history_graph.png", label: "Exercise History Data" },
  { src: "/gym_junkie/workout_overview_current.png", label: "Current Workout Overview" },
];

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
        Yes, the frontend is cluttered with buttons and data, and you can tell it was built
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
          flexWrap: 'wrap',
          gap: { xs: 2, sm: 4 },
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {screenshots.map(({ src, label }) => (
          <Box
            key={src}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Box
              component="img"
              src={src}
              alt={label}
              sx={{ width: { xs: 140, sm: 200 }, maxWidth: '42vw', height: 'auto' }}
            />
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 0.5 }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Button
            variant="contained"
            href={gymJunkiePlayStoreLink}
            target="_blank"
            rel="noopener"
            startIcon={
              <ShopIcon
                sx={{
                  width: 32,
                  height: 32,
                  marginRight: '10px'
                }}
              />
            }
          >
            Play Store
          </Button>
        </Box>
      </Box>
      {BottomNavigation({
        right:  {
          text: 'Details',
          link: '/gym-junkie/details'
        }
      })}
    </Box>

  )
}
