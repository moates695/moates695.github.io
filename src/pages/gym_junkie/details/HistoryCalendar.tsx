import { Box, Typography } from "@mui/material";
import PageLinks from "../../../components/PageLinks";
import BottomNavigation from "../../../components/BottomNavigation";

const screenshots = [
  { src: "/gymJunkieHistory.png", label: "Workout history" },
  { src: "/gymJunkieOverviewHistory.png", label: "Past workout overview" },
];

export default function HistoryCalendar() {
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
        History & Calendar
      </Typography>
      <Typography>
        Every workout you've ever logged lives in your history. Tap any session and you
        get the full breakdown — exercises, sets, weights, notes, the muscle groups you
        hit, the duration and your heart rate if you were wearing a strap. It's the same
        layout as the live workout overview, so nothing has to be re-learned.
      </Typography>
      <Typography>
        On top of the list view, the yearly frequency calendar paints every day of the
        year green if you trained, with the shade scaling to how hard the session was.
        It's a nice motivator — and a brutally honest record of any holes in your
        consistency.
      </Typography>
      <Typography>
        Use the history to copy old workouts as a template for today, compare last
        month's performance to right now, or just remind yourself how far you've come.
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
        More screenshots coming: yearly frequency calendar view.
      </Typography>
      {BottomNavigation({
        left: { text: 'Details', link: '/gym-junkie/details' },
        right: { text: 'Friends & Leaderboards', link: '/gym-junkie/details/friends' },
      })}
    </Box>
  );
}
