import { Box, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import BottomNavigation from "../../components/BottomNavigation";

export default function OtherAll() {
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
        Other Projects
      </Typography>
      <Typography>
        Click through to see some of my other coding projects.
      </Typography>
      {BottomNavigation({
        right:  {
          text: 'Cellular Tracking',
          link: '/other/cellular-tracking'
        }
      })}
    </Box>
  )
}