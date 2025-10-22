import { Box, Button, IconButton, Link, Typography } from "@mui/material";
import githubLogo from "../assets/github-logo.png";
import linkedInLogo from '../assets/linkedin-logo.jpg';
import expoLogo from '../assets/expo-logo.webp';
import pypiLogo from '../assets/pypi-logo.png';
import discordLogo from '../assets/discord-logo.png';
// import resume from '../assets/marcus_oates_resume.pdf';
import CopyButton from "../components/CopyButton";
import DownloadIcon from '@mui/icons-material/Download';
import PageLinks from "../components/PageLinks";
import { expoLink, githubLink, pypiLink } from "../middleware/links";

export default function ContactPage() {
  return (
    <Box 
      component="section"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flexStart',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <PageLinks />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%', 
            justifyContent: 'center', 
            gap: '10px',
            // backgroundColor: 'red'
          }}
        >
          <IconButton
            component="a"
            href={githubLink}
            target="_blank"
            rel="noopener"
          >
            <Box
              component="img"
              src={githubLogo}
              alt="GitHub"
              sx={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          </IconButton>
          <IconButton
            component="a"
            href="https://www.linkedin.com/in/marcus-oates-52814a233/"
            target="_blank"
            rel="noopener"
          >
            <Box
              component="img"
              src={linkedInLogo}
              alt="LinkedIn"
              sx={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          </IconButton>
          <IconButton
            component="a"
            href={expoLink}
            target="_blank"
            rel="noopener"
          >
            <Box
              component="img"
              src={expoLogo}
              alt="Expo"
              sx={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          </IconButton>
          <IconButton
            component="a"
            href={pypiLink}
            target="_blank"
            rel="noopener"
          >
            <Box
              component="img"
              src={pypiLogo}
              alt="PyPi"
              sx={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          </IconButton>
          <IconButton
            component="a"
            href="https://discord.gg/uUd8hJNvzM"
            target="_blank"
            rel="noopener"
          >
            <Box
              component="img"
              src={discordLogo}
              alt="Discord"
              sx={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          </IconButton>
        </Box>
        <Box>
          <Button
            variant="contained" startIcon={<DownloadIcon />}
            href="marcus_oates_resume.pdf"
            download
          >
            resume
          </Button>
        </Box>
        <Typography>
          Email: 
          <Link href="mailto:marcusjoates@gmail.com" underline="hover" sx={{marginLeft: '5px'}}>
            marcusjoates@gmail.com
          </Link>
          <CopyButton text={'marcusjoates@gmail.com'}/>
        </Typography>
        <Typography>
          Phone: 0428 211 020
          <CopyButton text={'0428211020'}/>
        </Typography>
        <Typography>
          Gym Junkie Support: 
          <Link href="mailto:gymtrackeraus@gmail.com" underline="hover" sx={{marginLeft: '5px'}}>
            gymtrackeraus@gmail.com
          </Link>
          <CopyButton text={'gymtrackeraus@gmail.com'}/>
        </Typography>
        <Typography
          fontSize={14}
        >
          Feel free to reach out using one of the methods above.<br/>
          Suggestions, improvements or bugfixes are welcome. <br/>
          I don't pickup on unkown numbers, so pls leave a message.
        </Typography>
      </Box>
    </Box>
  )
}