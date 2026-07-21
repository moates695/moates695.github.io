import { Box, Button, IconButton, Link, Typography } from "@mui/material";
import githubLogo from "../assets/github-logo.png";
import linkedInLogo from '../assets/linkedin-logo.jpg';
import expoLogo from '../assets/expo-logo.webp';
import pypiLogo from '../assets/pypi-logo.png';
import discordLogo from '../assets/discord-logo.png';
import CopyButton from "../components/CopyButton";
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import { expoLink, githubLink, paypalLink, pypiLink, stravaLink } from "../middleware/links";
import stravaLogo from "../assets/strava-icon.png";
import {
  PageHeader,
  GradientText,
  Reveal,
  SectionHeading,
  FeatureCard,
  CardGrid,
  Panel,
  Callout,
  DEFAULT_ACCENT,
} from "../components/design";

const linkedInLink = "https://www.linkedin.com/in/marcus-oates-52814a233/";
const discordLink = "https://discord.gg/uUd8hJNvzM";

const iconButtonHoverSx = {
  '&:hover': {
    backgroundColor: 'action.hover',
  },
};

/**
 * Compact social icon row. Exported because the home page reuses it.
 */
export const contactButtons = (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      justifyContent: 'center',
      gap: { xs: '6px', sm: '10px' },
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
        sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, borderRadius: "50%" }}
      />
    </IconButton>
    <IconButton
      component="a"
      href={linkedInLink}
      target="_blank"
      rel="noopener"
      sx={iconButtonHoverSx}
    >
      <Box
        component="img"
        src={linkedInLogo}
        alt="LinkedIn"
        sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, borderRadius: "50%" }}
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
        sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, borderRadius: "50%" }}
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
        sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, borderRadius: "50%" }}
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
        sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, borderRadius: "50%" }}
      />
    </IconButton>
    <IconButton
      component="a"
      href={discordLink}
      target="_blank"
      rel="noopener"
      sx={iconButtonHoverSx}
    >
      <Box
        component="img"
        src={discordLogo}
        alt="Discord"
        sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, borderRadius: "50%" }}
      />
    </IconButton>
  </Box>
);

/** Small circular logo used as a FeatureCard icon. */
function LogoIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{ width: 26, height: 26, borderRadius: "50%" }}
    />
  );
}

const channels = [
  { title: "GitHub", blurb: "moates695 (personal)", href: githubLink, logo: githubLogo },
  { title: "LinkedIn", blurb: "Marcus Oates", href: linkedInLink, logo: linkedInLogo },
  { title: "Strava", blurb: "Follow my training", href: stravaLink, logo: stravaLogo },
  { title: "Discord", blurb: "Join the server", href: discordLink, logo: discordLogo },
  { title: "Expo", blurb: "App builds", href: expoLink, logo: expoLogo },
  { title: "PyPi", blurb: "Python packages", href: pypiLink, logo: pypiLogo },
];

function DetailRow({
  icon,
  label,
  value,
  href,
  copy,
  caption,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  copy?: string;
  caption?: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 38,
          height: 38,
          borderRadius: 2,
          bgcolor: `${DEFAULT_ACCENT}1f`,
          color: DEFAULT_ACCENT,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography
          variant="caption"
          sx={{ color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.08em" }}
        >
          {label}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
          {href ? (
            <Link href={href} underline="hover" sx={{ wordBreak: "break-word" }}>
              {value}
            </Link>
          ) : (
            <Typography sx={{ wordBreak: "break-word" }}>{value}</Typography>
          )}
          {copy && <CopyButton text={copy} />}
        </Box>
        {caption && (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {caption}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default function ContactPage() {
  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 3, sm: 4 },
        pb: 4,
      }}
    >
      <PageHeader
        eyebrow="contact"
        title={<>Get in <GradientText>touch</GradientText></>}
        subtitle="Suggestions, improvements and bugfixes are welcome. Reach out through any of the channels below."
        actions={
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            href="marcus_oates_resume.pdf"
            download
            sx={{ fontWeight: 700 }}
          >
            Resume
          </Button>
        }
      />

      <Reveal delay={0.06}>
        <SectionHeading eyebrow="channels">Find me online</SectionHeading>
        <CardGrid>
          {channels.map((c) => (
            <FeatureCard
              key={c.title}
              icon={<LogoIcon src={c.logo} alt={c.title} />}
              title={c.title}
              blurb={c.blurb}
              href={c.href}
            />
          ))}
        </CardGrid>
      </Reveal>

      <Reveal delay={0.12}>
        <SectionHeading eyebrow="direct">Reach me directly</SectionHeading>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          }}
        >
          <Panel wash sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ fontWeight: 700 }}>Personal</Typography>
            <DetailRow
              icon={<EmailIcon fontSize="small" />}
              label="Email"
              value="marcusjoates@gmail.com"
              href="mailto:marcusjoates@gmail.com"
              copy="marcusjoates@gmail.com"
            />
            <DetailRow
              icon={<PhoneIcon fontSize="small" />}
              label="Phone"
              value="0428 211 020"
              href="tel:0428211020"
              copy="0428211020"
              caption="I don't pick up unknown numbers, so please leave a message."
            />
          </Panel>

          <Panel wash sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ fontWeight: 700 }}>Business</Typography>
            <DetailRow
              icon={<EmailIcon fontSize="small" />}
              label="Gym Junkie support"
              value="gymtrackeraus@gmail.com"
              href="mailto:gymtrackeraus@gmail.com"
              copy="gymtrackeraus@gmail.com"
            />
            <DetailRow
              icon={<BadgeIcon fontSize="small" />}
              label="ABN"
              value="50261161443"
              copy="50261161443"
              caption="Australian Business Number"
            />
          </Panel>
        </Box>
      </Reveal>

      <Reveal delay={0.18}>
        <Callout accent={DEFAULT_ACCENT} title="support">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Hosting apps isn't free. If something here helped you out, a small
              contribution keeps the servers running.
            </Typography>
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<LocalCafeIcon />}
                href={paypalLink}
                target="_blank"
                rel="noopener"
                sx={{ fontWeight: 700 }}
              >
                Buy Me a White Monster
              </Button>
            </Box>
          </Box>
        </Callout>
      </Reveal>
    </Box>
  );
}
