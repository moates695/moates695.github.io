import { Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";

export default function DeleteMe() {
  return (
    <Box
      component="pre"
      sx={{
        padding: 2,
        borderRadius: 1,
        overflow: 'auto',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap'
      }}
    >
      <Typography>
        Delete Me Instructions
      </Typography>
      <Typography>
        Send me an email (marcusjoates@gmail.com) from the account you  
        signed up with and include your password with a subject of "Delete Me"
        or similar. Once I have your confirmation I will delete your account. 
      </Typography>
    </Box>
  )
}