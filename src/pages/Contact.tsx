import { Box, Button, IconButton, Link, Paper, Typography } from "@mui/material";
import githubLogo from "../assets/github-logo.png";
import linkedInLogo from '../assets/linkedin-logo.jpg';
import expoLogo from '../assets/expo-logo.webp';
import pypiLogo from '../assets/pypi-logo.png';
import discordLogo from '../assets/discord-logo.png';
// import resume from '../assets/marcus_oates_resume.pdf';
import CopyButton from "../components/CopyButton";
import DownloadIcon from '@mui/icons-material/Download';
import PageLinks from "../components/PageLinks";
import { expoLink, githubLink, paypalLink, pypiLink, stravaLink } from "../middleware/links";
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import stravaLogo from "../assets/strava-icon.png"

const iconButtonHoverSx = {
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
};

export const contactButtons = (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      gap: '10px',
    }}
  >
    <IconButton
      component="a"
      href={githubLink}
      target="_blank"
      rel="noopener"
      sx={iconButtonHoverSx}
    >
      <Box
        component="img"
        src={githubLogo}
        alt="GitHub"
        sx={{ width: 48, height: 48, borderRadius: "50%" }}
      />
    </IconButton>
    <IconButton
      component="a"
      href="https://www.linkedin.com/in/marcus-oates-52814a233/"
      target="_blank"
      rel="noopener"
      sx={iconButtonHoverSx}
    >
      <Box
        component="img"
        src={linkedInLogo}
        alt="LinkedIn"
        sx={{ width: 48, height: 48, borderRadius: "50%" }}
      />
    </IconButton>
    <IconButton
      component="a"
      href={stravaLink}
      target="_blank"
      rel="noopener"
      sx={iconButtonHoverSx}
    >
      <Box
        component="img"
        src={stravaLogo}
        alt="Strava"
        sx={{ width: 48, height: 48, borderRadius: "50%" }}
      />
    </IconButton>
    <IconButton
      component="a"
      href={expoLink}
      target="_blank"
      rel="noopener"
      sx={iconButtonHoverSx}
    >
      <Box
        component="img"
        src={expoLogo}
        alt="Expo"
        sx={{ width: 48, height: 48, borderRadius: "50%" }}
      />
    </IconButton>
    <IconButton
      component="a"
      href={pypiLink}
      target="_blank"
      rel="noopener"
      sx={iconButtonHoverSx}
    >
      <Box
        component="img"
        src={pypiLogo}
        alt="PyPi"
        sx={{ width: 48, height: 48, borderRadius: "50%" }}
      />
    </IconButton>
    <IconButton
      component="a"
      href="https://discord.gg/uUd8hJNvzM"
      target="_blank"
      rel="noopener"
      sx={iconButtonHoverSx}
    >
      <Box
        component="img"
        src={discordLogo}
        alt="Discord"
        sx={{ width: 48, height: 48, borderRadius: "50%" }}
      />
    </IconButton>
  </Box>
)

export default function ContactPage() {
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
        <Typography variant="h5">Contact</Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {/* Left column: socials + resume */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              flex: '1 1 280px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              backgroundColor: 'transparent',
              borderColor: 'rgba(255, 255, 255, 0.12)',
            }}
          >
            <Typography variant="overline" color="text.secondary">
              Socials
            </Typography>
            {contactButtons}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                href="marcus_oates_resume.pdf"
                download
                sx={{ fontWeight: 600 }}
              >
                Resume
              </Button>
            </Box>
          </Paper>

          {/* Right column: personal contact */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              flex: '1 1 280px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              backgroundColor: 'transparent',
              borderColor: 'rgba(255, 255, 255, 0.12)',
            }}
          >
            <Typography variant="overline" color="text.secondary">
              Personal
            </Typography>
            <Typography>
              Email:
              <Link href="mailto:marcusjoates@gmail.com" underline="hover" sx={{marginLeft: '5px'}}>
                marcusjoates@gmail.com
              </Link>
              <CopyButton text={'marcusjoates@gmail.com'}/>
            </Typography>
            <Typography>
              Phone:
              <Link href="tel:0428211020" underline="hover" sx={{marginLeft: '5px'}}>
                0428 211 020
              </Link>
              <CopyButton text={'0428211020'}/>
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {/* Gym Junkie Support */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              flex: '1 1 280px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              backgroundColor: 'transparent',
              borderColor: 'rgba(255, 255, 255, 0.12)',
            }}
          >
            <Typography variant="overline" color="text.secondary">
              Gym Junkie Support
            </Typography>
            <Typography>
              Email:
              <Link href="mailto:gymtrackeraus@gmail.com" underline="hover" sx={{marginLeft: '5px'}}>
                gymtrackeraus@gmail.com
              </Link>
              <CopyButton text={'gymtrackeraus@gmail.com'}/>
            </Typography>
          </Paper>

          {/* Business */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              flex: '1 1 280px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              backgroundColor: 'transparent',
              borderColor: 'rgba(255, 255, 255, 0.12)',
            }}
          >
            <Typography variant="overline" color="text.secondary">
              Business
            </Typography>
            <Typography>
              ABN: 50261161443
              <CopyButton text={'50261161443'}/>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Australian Business Number
            </Typography>
          </Paper>

          {/* Support */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              flex: '1 1 280px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              backgroundColor: 'transparent',
              borderColor: 'rgba(255, 255, 255, 0.12)',
            }}
          >
            <Typography variant="overline" color="text.secondary">
              Support
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hosting apps isn't free :(
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<LocalCafeIcon />}
                href={paypalLink}
                target="_blank"
                rel="noopener"
                sx={{ fontWeight: 600 }}
              >
                Buy Me a White Monster
              </Button>
            </Box>
          </Paper>
        </Box>

        <Typography
          fontSize={14}
          sx={{ mt: 1, color: 'text.secondary' }}
        >
          Feel free to reach out using one of the methods above.<br/>
          Suggestions, improvements or bugfixes are welcome. <br/>
          I don't pickup on unknown numbers, so pls leave a message.
        </Typography>
    </Box>
  )
}
