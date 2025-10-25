import { Box, Button, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import BottomNavigation from "../../components/BottomNavigation";
import { buildProjectChange } from "../../components/Changes";

export default function GymJunkieChanges() {
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
        Changes
      </Typography>
      {buildProjectChange('gym_junkie')}
      {BottomNavigation({
        left:  {
          text: 'Functionality',
          link: '/gym-junkie/functionality'
        }
      })}
    </Box>
  )
}