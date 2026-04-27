import { Box, Typography } from "@mui/material";
import PageLinks from "../../../components/PageLinks";
import BottomNavigation from "../../../components/BottomNavigation";

const screenshots = [
  { src: "/gymJunkieWorkout.png", label: "Workout screen" },
  { src: "/gymJunkieEditWorkoutExercise.png", label: "Edit exercise" },
  { src: "/gymJunkieOverviewCurrent.png", label: "Current workout overview" },
];

export default function WorkoutLogging() {
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
        Workout Logging
      </Typography>
      <Typography>
        Logging is the heart of Gym Junkie, and it's been built to stay out of your way.
        Tap the workout tab, pick an exercise and start punching in numbers — the keyboard
        you see is tuned for sets, reps and weight, with sensible defaults pulled from your
        last session so you usually only need to tap once or twice per set.
      </Typography>
      <Typography>
        Mid-workout you can rearrange the order of exercises, swap one out for something
        else, add notes, mark a set as a drop set, or jump back to a previous set to fix a
        typo. Every change is reflected immediately in your overview so you always know
        where you're up to.
      </Typography>
      <Typography>
        If your phone dies or you accidentally close the app, your workout is safe. Drafts
        autosave continuously and sync to the cloud, so picking up on another device — or
        just relaunching the app — drops you right back where you left off.
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 2, sm: 4 },
          width: '100%',
          justifyContent: 'center',
          mt: 1,
        }}
      >
        {screenshots.map(({ src, label }) => (
          <Box
            key={src}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
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
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        More screenshots coming: rest timer mid-workout, drop-set entry.
      </Typography>
      {BottomNavigation({
        left: { text: 'Details', link: '/gym-junkie/details' },
        right: { text: 'Exercise Library', link: '/gym-junkie/details/exercise-library' },
      })}
    </Box>
  );
}
