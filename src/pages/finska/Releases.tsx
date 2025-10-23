import { Box, Button } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../../components/BottomNavigation";

export default function FinksaReleases() {
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
      {BottomNavigation({
        left:  {
          text: 'Roadmap',
          link: '/finska/roadmap'
        }
      })}
    </Box>
  )
}