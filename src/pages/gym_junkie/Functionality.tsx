import { Box, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import BottomNavigation from "../../components/BottomNavigation";

const screenshotRows = [
  [
    { src: "/gymJunkieChooseExercise.png", label: "Choose Exercise" },
    { src: "/gymJunkieMuscleHeat.png", label: "Exercise Heatmap" },
    { src: "/gymJunkieWorkout.png", label: "Workout Screen" },
    { src: "/gymJunkieNRepMax.png", label: "Exercise Rep Data" },
  ],
  [
    { src: "/gymJunkieHistoryData.png", label: "Exercise History Data" },
    { src: "/gymJunkieEditWorkoutExercise.png", label: "Edit Workout Exercise" },
    { src: "/gymJunkieOverviewCurrent.png", label: "Workout Current Overview" },
    { src: "/gymJunkieOverviewHistory.png", label: "Workout History Overview" },
  ],
  [
    { src: "/gymJunkieStats.png", label: "Stats Page" },
    { src: "/gymJunkieMuscleChart.png", label: "Muscle Distributions" },
    { src: "/gymJunkieLeaderboard.png", label: "Leaderboards" },
    { src: "/gymJunkieFavourites.png", label: "Favourite Exercises" },
  ],
];

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
        In the meantime, here a some screenshots from an internal alpha build.
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
        }}
      >
        {screenshotRows.map((row, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              width: '100%',
              justifyContent: 'center',
            }}
          >
            {row.map(({ src, label }) => (
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
                  sx={{ width: 200, maxWidth: '40vw', height: 'auto' }}
                />
                <Typography>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
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
