import { Box, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import BottomNavigation from "../../components/BottomNavigation";
import { buildProjectChange } from "../../components/Changes";

export default function PoppycockChanges() {
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
      {buildProjectChange('balderdash')}
      {BottomNavigation({
        left: {
          text: 'Design',
          link: '/poppycock/design'
        }
      })}
    </Box>
  )
}
