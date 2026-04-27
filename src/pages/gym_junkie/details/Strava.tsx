import { Box, Typography } from "@mui/material";
import PageLinks from "../../../components/PageLinks";
import BottomNavigation from "../../../components/BottomNavigation";

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
        Shared activities include the workout summary — exercises, total volume,
        duration, and heart-rate data if you trained with a strap connected. Your usual
        Strava followers see it as a strength session in their feed, with everything
        formatted for Strava rather than dumped as raw data.
      </Typography>
      <Typography>
        Sharing is opt-in per workout. Bad session? Don't share it. Hit a PR you want
        the world to know about? One tap.
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          mt: 2,
          p: 2,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 1,
          textAlign: 'center',
        }}
      >
        Screenshots coming: Strava settings page, share-to-Strava button on workout
        finish, example Strava post.
      </Typography>
      {BottomNavigation({
        left: { text: 'Details', link: '/gym-junkie/details' },
      })}
    </Box>
  );
}
