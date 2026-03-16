import { Box, Link, Paper, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";


export default function PrivacyPolicy() {
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
        Privacy Policy
      </Typography>
      <Paper sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Last updated: 5/12/25
        </Typography>
        <Typography paragraph>
          Finska Tracker does not collect, store, or share any personal information or data from its users.
        </Typography>
        <Typography paragraph>
          We do not:
        </Typography>
        <Box component="ul" sx={{ mt: 0, pl: 3 }}>
          <li><Typography>Collect personal information</Typography></li>
          <li><Typography>Use cookies or tracking technologies</Typography></li>
          <li><Typography>Share data with third parties</Typography></li>
          <li><Typography>Store user data on our servers</Typography></li>
        </Box>
        <Typography>
          Contact: <Link href="mailto:marcusjoates@gmail.com">marcusjoates@gmail.com</Link>
        </Typography>
      </Paper>
    </Box>
  )
}
