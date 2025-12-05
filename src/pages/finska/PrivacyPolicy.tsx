import { Box, Typography } from "@mui/material";


export default function PrivacyPolicy() {
  return (
    <Box
      component="pre"
      sx={{
        // backgroundColor: '#f5f5f5',
        padding: 2,
        borderRadius: 1,
        overflow: 'auto',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap'
      }}
    >
      {`Privacy Policy for Finska Tracker

Last updated: 5/12/25

Finska Tracker does not collect, store, or share any personal information or data from its users.

We do not:
- Collect personal information
- Use cookies or tracking technologies
- Share data with third parties
- Store user data on our servers

Contact: marcusjoates@gmail.com`}
    </Box>
  )
}