import { Box, Typography } from "@mui/material";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import {
  Link as RouterLink,
  Route,
  Routes,
  MemoryRouter,
  useLocation,
} from 'react-router';
import PageLinks from "../components/PageLinks";

export default function HomePage() {
  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        // maxWidth: 1200,
        alignSelf: 'center',
        gap: '10px'
      }}
    >
      <PageLinks />

      <Typography variant="h5">
        Marcus Oates
      </Typography>
      <Typography>
        Hey there, check out some of my projects!
      </Typography>
    </Box>
  )
}