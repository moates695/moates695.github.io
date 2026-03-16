import { Box, Paper, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";

export default function DeleteMe() {
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
        Delete Me
      </Typography>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <Typography>
          Send me an email (marcusjoates@gmail.com) from the account you
          signed up with and include your password with a subject of "Delete Me"
          or similar. Once I have your confirmation I will delete your account.
        </Typography>
      </Paper>
    </Box>
  )
}
