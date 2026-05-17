import { Box, Typography } from "@mui/material";
import PageLinks from "../../../components/PageLinks";
import BottomNavigation from "../../../components/BottomNavigation";

const screenshots = [
  { src: "/gym_junkie/heartrate_settings.png", label: "Heart rate settings" },
];

export default function RestTimerHeartRate() {
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
        Rest Timer & Heart Rate
      </Typography>
      <Typography>
        A built-in rest timer kicks off automatically when you log a set. It floats above
        your workout so it doesn't hide what you were doing, and you can dismiss or
        adjust it any time. If you're like most people who lose track of time scrolling
        between sets, this stops your "60 seconds" rest from quietly becoming three
        minutes.
      </Typography>
      <Typography>
        For anyone serious about effort, Gym Junkie also pairs with Bluetooth heart-rate
        monitors. Pop your strap on, pair it once in settings, and your live heart rate
        shows up during the workout. Samples are stored against the workout, so you can
        look back at how hard you actually pushed each session.
      </Typography>
      <Typography>
        Pairing is "set and forget" - the app remembers your device and reconnects on its
        own when you start your next workout.
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
        More screenshots coming: rest timer running mid-workout, live heart-rate readout
        during a workout.
      </Typography>
      {BottomNavigation({
        left: { text: 'Details', link: '/gym-junkie/details' },
        right: { text: 'Muscle Targets', link: '/gym-junkie/details/muscle-targets' },
      })}
    </Box>
  );
}
