import { Box, Typography } from "@mui/material";
import PageLinks from "../../../components/PageLinks";
import BottomNavigation from "../../../components/BottomNavigation";

const screenshots = [
  { src: "/gym_junkie/strava_settings.png", label: "Strava settings" },
  { src: "/gym_junkie/strava_upload_example.png", label: "Shared workout" },
];

export default function Strava() {
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
        Strava Sharing
      </Typography>
      <Typography>
        Connect Strava once from settings and you can push completed Gym Junkie workouts
        straight to your Strava feed. The integration handles the OAuth flow for you, and
        once it's set up you'll see a "Share to Strava" option when you wrap up a
        workout.
      </Typography>
      <Typography>
        Shared activities include the workout summary - exercises, total volume,
        duration, and heart-rate data if you trained with a strap connected. Your usual
        Strava followers see it as a strength session in their feed, with everything
        formatted for Strava rather than dumped as raw data.
      </Typography>
      <Typography>
        Sharing is opt-in per workout. Bad session? Don't share it. Hit a PR you want
        the world to know about? One tap.
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
        More screenshots coming: share-to-Strava button on workout finish.
      </Typography>
      {BottomNavigation({
        left: { text: 'Details', link: '/gym-junkie/details' },
      })}
    </Box>
  );
}
