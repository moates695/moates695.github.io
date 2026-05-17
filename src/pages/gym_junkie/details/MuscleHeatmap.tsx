import { Box, Typography } from "@mui/material";
import PageLinks from "../../../components/PageLinks";
import BottomNavigation from "../../../components/BottomNavigation";

const screenshots = [
  { src: "/gym_junkie/distributions_heatmap.png", label: "Muscle heatmap" },
];

export default function MuscleHeatmap() {
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
        Muscle Heatmap
      </Typography>
      <Typography>
        The heatmap is a body diagram coloured by how recently and how heavily each muscle
        has been worked. Bright muscles are fresh in the program, faded ones are starting
        to fall behind. It's the fastest way to spot a gap before it becomes an imbalance.
      </Typography>
      <Typography>
        On the home screen you also get a frequency view that shows training counts per
        muscle group over your chosen window - past 7 days, 14 days, however long your
        rotation tends to run. Pair it with the heatmap and you can answer "have I done
        enough back this week?" without scrolling through a single workout log.
      </Typography>
      <Typography>
        The colour scale and the time window are both adjustable, so you can tune it to
        your training style - whether that's a tight push-pull-legs split or a more
        ad-hoc approach.
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
        More screenshots coming: home Muscle History card, home Frequency card.
      </Typography>
      {BottomNavigation({
        left: { text: 'Details', link: '/gym-junkie/details' },
        right: { text: 'Exercise Stats', link: '/gym-junkie/details/exercise-stats' },
      })}
    </Box>
  );
}
