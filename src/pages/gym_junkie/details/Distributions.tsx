import { Box, Typography } from "@mui/material";
import PageLinks from "../../../components/PageLinks";
import BottomNavigation from "../../../components/BottomNavigation";

const screenshots = [
  { src: "/gym_junkie/distributions_radar.png", label: "Muscle distributions" },
];

export default function Distributions() {
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
        Distributions & Ratios
      </Typography>
      <Typography>
        The distributions view answers a single, important question: where is your
        training time actually going? A radar chart shows your training split across
        muscle groups, so it's instantly obvious if you've got happy chest and shoulders
        but a back that's been ignored.
      </Typography>
      <Typography>
        You can switch the metric between total volume, number of working sets and total
        reps, and adjust the time window to match your training cycle. Each gives a
        slightly different picture - volume biases towards heavier compounds, set count
        rewards spread, rep count surfaces high-rep accessory work.
      </Typography>
      <Typography>
        Use it before a deload to plan the next block, or just to keep yourself honest if
        you suspect you've been skipping certain muscle groups.
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
        More screenshots coming: ratios slider, sets / reps distribution toggle states.
      </Typography>
      {BottomNavigation({
        left: { text: 'Details', link: '/gym-junkie/details' },
        right: { text: 'History & Calendar', link: '/gym-junkie/details/history-calendar' },
      })}
    </Box>
  );
}
