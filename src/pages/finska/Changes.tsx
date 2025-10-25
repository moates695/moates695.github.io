import { Box, Button, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import BottomNavigation from "../../components/BottomNavigation";
import { buildProjectChange } from "../../components/Changes";

export default function FinksaChanges() {
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
      {buildProjectChange('finska')}
      {BottomNavigation({
        left:  {
          text: 'Design',
          link: '/finska/design'
        }
      })}
    </Box>
  )
}