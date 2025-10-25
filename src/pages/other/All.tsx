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
      {BottomNavigation({
        right:  {
          text: 'Downer Helper',
          link: '/other/downer-helper'
        }
      })}
    </Box>
  )
}