import { Box, Typography } from "@mui/material";
import PageLinks from "../../../components/PageLinks";
import BottomNavigation from "../../../components/BottomNavigation";

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
        — for example, ten sets of back work over a rolling seven days.
      </Typography>
      <Typography>
        On the home screen, every target you've created shows up as a progress card. As
        you log sets through the week, the cards fill up. A glance tells you what you've
        already done, what's behind, and where to put your effort next session.
      </Typography>
      <Typography>
        You can run as many targets as you like in parallel — you might have a high
        priority on legs, a maintenance target for arms and a "don't forget" target for
        rear delts, all running at different volumes.
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
        Screenshots coming: home target tracking card, create / edit target screens.
      </Typography>
      {BottomNavigation({
        left: { text: 'Details', link: '/gym-junkie/details' },
        right: { text: 'Muscle Heatmap', link: '/gym-junkie/details/muscle-heatmap' },
      })}
    </Box>
  );
}
