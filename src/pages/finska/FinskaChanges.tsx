import { Box, Button, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../../components/BottomNavigation";

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
      <Box
        sx={{
          display: 'flex',
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: '50%',
          }}
        >

        </Box>
        <Box
          sx={{
            width: '50%',
          }}
        >

        </Box>
      </Box>
      {BottomNavigation({
        left:  {
          text: 'Design',
          link: '/finska/design'
        }
      })}
    </Box>
  )
}