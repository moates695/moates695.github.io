import { Box, Typography } from "@mui/material";
import PageLinks from "../../../components/PageLinks";
import BottomNavigation from "../../../components/BottomNavigation";

export default function Friends() {
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
        Friends & Leaderboards
      </Typography>
      <Typography>
        Add your gym mates and you'll see their workouts in a feed - what they trained,
        how heavy and how long it took. There are no likes, no comments, no streaks
        guilting you into pretending you trained. The point is to see what your friends
        are up to and feed off that energy, not to scroll a social network.
      </Typography>
      <Typography>
        Tap into a friend's profile and you can compare directly - same exercise, same
        rep range, side by side. It's a lightweight way to keep yourself honest without
        feeling like you're being measured all the time.
      </Typography>
      <Typography>
        Leaderboards close the loop. Pick a lift, pick a rep range and see where you
        stack up against your friends. Filter by age bracket, body weight or experience
        if you want a fairer comparison. Whether that motivates you to push harder or
        gently roast a mate is up to you.
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
        Screenshots coming: friend feed, friend profile view, add-friends screen,
        leaderboard view.
      </Typography>
      {BottomNavigation({
        left: { text: 'Details', link: '/gym-junkie/details' },
        right: { text: 'Strava Sharing', link: '/gym-junkie/details/strava' },
      })}
    </Box>
  );
}
