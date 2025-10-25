import { Box, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import BottomNavigation from "../../components/BottomNavigation";

export default function GymJunkieOverview() {
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
        Overview
      </Typography>
      <Typography>
        Filling this out soon...
      </Typography>
      {BottomNavigation({
        right:  {
          text: 'Functionality',
          link: '/gym-junkie/functionality'
        }
      })}
    </Box>
  )
}