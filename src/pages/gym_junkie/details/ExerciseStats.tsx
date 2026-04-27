import { Box, Typography } from "@mui/material";
import PageLinks from "../../../components/PageLinks";
import BottomNavigation from "../../../components/BottomNavigation";

const screenshots = [
  { src: "/gymJunkieNRepMax.png", label: "N-rep max" },
  { src: "/gymJunkieHistoryData.png", label: "Exercise history" },
  { src: "/gymJunkieStats.png", label: "Stats overview" },
];

export default function ExerciseStats() {
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
        Exercise Stats
      </Typography>
      <Typography>
        Pick any exercise and Gym Junkie shows you a complete history of every set you've
        ever done — weights, reps, dates, the lot. Sort by anything that matters to you,
        scroll back through years if you've got the data, and see exactly how a lift has
        evolved.
      </Typography>
      <Typography>
        The n-rep max view is the headline number for most lifters: your best set at 1
        rep, 3, 5, 8, 10, 12, 15. Hit a new PR mid-workout and the app flags it on the
        spot. You can also pull up estimated maxes for rep ranges you don't directly
        train, useful when you're planning a percentage-based program.
      </Typography>
      <Typography>
        On top of raw history, progression charts plot weight (or volume, or estimated 1RM)
        over time so you can see whether you're actually getting stronger or just
        spinning your wheels.
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
        More screenshots coming: progression line graph for a single exercise.
      </Typography>
      {BottomNavigation({
        left: { text: 'Details', link: '/gym-junkie/details' },
        right: { text: 'Distributions', link: '/gym-junkie/details/distributions' },
      })}
    </Box>
  );
}
