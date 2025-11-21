import { Box, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import BottomNavigation from "../../components/BottomNavigation";

export default function GymJunkieFunctionality() {
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
        Functionality
      </Typography>
      <Typography>
        Coming soon, will fill out when everything is more concrete
        <br/>
        In the meantime, here a some screenshots from an interanal alpha build.
      </Typography>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
        }}
      >
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
              src="/gymJunkieChooseExercise.png"
              alt="workout screen"
              sx={{width: 200}}
            />
            <Typography>
              Choose Exercise
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
              src="/gymJunkieMuscleHeat.png"
              alt="exercise history data"
              sx={{width: 200}}
            />
            <Typography>
              Exercise Heatmap
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
              src="/gymJunkieWorkout.png"
              alt="current workout overview"
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
              src="/gymJunkieNRepMax.png"
              alt="workout screen"
              sx={{width: 200}}
            />
            <Typography>
              Exercise Rep Data
            </Typography>
          </Box>
        </Box>
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
              src="/gymJunkieEditWorkoutExercise.png"
              alt="current workout overview"
              sx={{width: 200}}
            />
            <Typography>
              Edit Workout Exercise
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
              alt="workout screen"
              sx={{width: 200}}
            />
            <Typography>
              Workout Current Overview
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
              src="/gymJunkieOverviewHistory.png"
              alt="exercise history data"
              sx={{width: 200}}
            />
            <Typography>
              Workout History Overview
            </Typography>
          </Box>
        </Box>
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
              src="/gymJunkieStats.png"
              alt="current workout overview"
              sx={{width: 200}}
            />
            <Typography>
              Stats Page
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
              src="/gymJunkieMuscleChart.png"
              alt="workout screen"
              sx={{width: 200}}
            />
            <Typography>
              Muscle Distributions
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
              src="/gymJunkieLeaderboard.png"
              alt="exercise history data"
              sx={{width: 200}}
            />
            <Typography>
              Leaderboards
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
              src="/gymJunkieFavourites.png"
              alt="current workout overview"
              sx={{width: 200}}
            />
            <Typography>
              Favourite Exercises
            </Typography>
          </Box>
        </Box>
      </Box>
      {BottomNavigation({
        left:  {
          text: 'Overview',
          link: '/gym-junkie'
        },
        right:  {
          text: 'Changes',
          link: '/gym-junkie/changes'
        }
      })}
    </Box>
  )
}