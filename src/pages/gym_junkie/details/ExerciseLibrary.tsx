import { Box, Typography } from "@mui/material";
import PageLinks from "../../../components/PageLinks";
import BottomNavigation from "../../../components/BottomNavigation";

const screenshots = [
  { src: "/gym_junkie/choose_workout_exercise.png", label: "Choose exercise" },
];

export default function ExerciseLibrary() {
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
        Exercise Library
      </Typography>
      <Typography>
        Gym Junkie ships with a large catalogue of exercises covering every major muscle
        group, with filters so you can narrow by equipment, target muscle or movement
        pattern. The picker remembers what you usually do, so the exercises you actually
        train float to the top.
      </Typography>
      <Typography>
        If your gym has something niche, or you've got a movement of your own, you can
        create a custom exercise from scratch - name it, tag the muscles it works, and it
        slots straight into your library alongside the built-ins. You can also create
        variations of existing exercises (think "incline DB press, neutral grip") without
        polluting the catalogue.
      </Typography>
      <Typography>
        Mark exercises as favourites and they pin to the top of the picker, so your bread
        and butter lifts are one tap away.
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
        More screenshots coming: favourites view, My Exercises list, create-variation / edit-exercise screens.
      </Typography>
      {BottomNavigation({
        left: { text: 'Details', link: '/gym-junkie/details' },
        right: { text: 'Rest Timer & Heart Rate', link: '/gym-junkie/details/rest-timer-heart-rate' },
      })}
    </Box>
  );
}
