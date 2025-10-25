import { Box, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import BottomNavigation from "../../components/BottomNavigation";

export default function OtherDownerHelper() {
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
        Downer Helper
      </Typography>
      {BottomNavigation({
        left:  {
          text: 'Other Projects',
          link: '/other'
        },
        right:  {
          text: 'Cellular Tracking',
          link: '/other/cellular-tracking'
        }
      })}
    </Box>
  )
}