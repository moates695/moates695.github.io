import { Box, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import BottomNavigation from "../../components/BottomNavigation";

export default function OtherCellularTracking() {
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
        Cellular Tracking
      </Typography>
      {BottomNavigation({
        left:  {
          text: 'Downer Helper',
          link: '/other/downer-helper'
        },
      })}
    </Box>
  )
}