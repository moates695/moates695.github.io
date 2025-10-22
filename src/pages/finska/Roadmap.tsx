import { Box } from "@mui/material";
import PageLinks from "../../components/PageLinks";

export default function FinksaRoadmap() {
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
    </Box>
  )
}