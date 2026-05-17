import { Box, Typography } from "@mui/material";
import PageLinks from "../../../components/PageLinks";
import BottomNavigation from "../../../components/BottomNavigation";

const screenshots = [
  { src: "/gym_junkie/home_screen.png", label: "Home screen with targets" },
];

export default function MuscleTargets() {
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
        Muscle Targets
      </Typography>
      <Typography>
        Targets let you turn vague intentions ("hit chest twice this week") into something
        you can actually track. Pick a muscle group, decide whether you're targeting sets,
        total volume or total reps, set the number you want to hit and over what window
        - for example, ten sets of back work over a rolling seven days.
      </Typography>
      <Typography>
        On the home screen, every target you've created shows up as a progress card. As
        you log sets through the week, the cards fill up. A glance tells you what you've
        already done, what's behind, and where to put your effort next session.
      </Typography>
      <Typography>
        You can run as many targets as you like in parallel - you might have a high
        priority on legs, a maintenance target for arms and a "don't forget" target for
        rear delts, all running at different volumes.
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
        More screenshots coming: create / edit target screens.
      </Typography>
      {BottomNavigation({
        left: { text: 'Details', link: '/gym-junkie/details' },
        right: { text: 'Muscle Heatmap', link: '/gym-junkie/details/muscle-heatmap' },
      })}
    </Box>
  );
}
