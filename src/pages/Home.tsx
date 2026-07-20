import { Box, Button, Divider, Typography } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useNavigate } from 'react-router-dom';
import { gymJunkie, otherProjects } from "../middleware/projects";
import FeaturedProject from "../components/FeaturedProject";
import ProjectCard from "../components/ProjectCard";
import { contactButtons } from "./Contact";
import { MONO, ACCENT_GRADIENT } from "../styles/tokens";

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <Typography
    component="span"
    sx={{
      fontFamily: MONO,
      fontSize: 12,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'text.disabled',
    }}
  >
    {children}
  </Typography>
);

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: { xs: 4, sm: 5 }, pb: 3 }}
    >
      {/* ── Intro / profile ─────────────────────────────────────────── */}
      <Box className="reveal" sx={{ pt: { xs: 1, sm: 3 } }}>
        <Eyebrow>full-stack&nbsp;·&nbsp;ai&nbsp;&amp;&nbsp;backend engineer</Eyebrow>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            letterSpacing: '-0.03em',
            mt: 1,
            fontSize: { xs: '2.4rem', sm: '3.4rem' },
            lineHeight: 1.05,
          }}
        >
          Marcus{' '}
          <Box
            component="span"
            sx={{
              background: ACCENT_GRADIENT,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Oates
          </Box>
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: 'text.secondary', mt: 1.5, maxWidth: 640, fontWeight: 400 }}
        >
          I build full-stack products end to end: mobile apps, backend services and the data and
          ML that make them useful. By day I&apos;m a senior engineer working on AI and backend
          systems; by night I ship my own apps. Here are a few of them.
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mt: 2.5 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DescriptionOutlinedIcon />}
            onClick={() => navigate('/about')}
            sx={{ fontWeight: 700 }}
          >
            View resume
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/projects')}
            sx={{ borderColor: 'divider', color: 'text.secondary' }}
          >
            Browse projects
          </Button>
        </Box>
      </Box>

      {/* ── Featured: Gym Junkie ────────────────────────────────────── */}
      <Box className="reveal" sx={{ animationDelay: '0.08s' }}>
        <FeaturedProject project={gymJunkie} />
      </Box>

      {/* ── More projects ───────────────────────────────────────────── */}
      <Box className="reveal" sx={{ animationDelay: '0.16s' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            mb: 2,
            gap: 2,
          }}
        >
          <Eyebrow>{'// more projects'}</Eyebrow>
          <Button
            size="small"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/projects')}
            sx={{ color: 'primary.main', fontWeight: 600 }}
          >
            View all
          </Button>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {otherProjects.map((project) => (
            <ProjectCard key={project.key} project={project} />
          ))}
        </Box>
      </Box>

      {/* ── Footer quick links ──────────────────────────────────────── */}
      <Box>
        <Divider sx={{ mb: 2, borderColor: 'divider' }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {contactButtons}
          <Typography sx={{ fontFamily: MONO, fontSize: 11, mt: 1, color: 'text.disabled' }}>
            quick links
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
