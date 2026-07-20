import { Box, Button, Typography } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { ProjectInfo } from "../middleware/projects";
import { getChip } from "../middleware/chipMap";
import StatusBadge from "./StatusBadge";
import { MONO } from "../styles/tokens";

interface FeaturedProjectProps {
  project: ProjectInfo
}

/**
 * The hero feature card — Gym Junkie, front and centre. Text + CTAs on the
 * left, product highlight on the right (stacks on mobile).
 */
export default function FeaturedProject({ project }: FeaturedProjectProps) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: `${project.accent}55`,
        bgcolor: 'background.paper',
        // soft accent wash behind the content
        backgroundImage: `radial-gradient(120% 120% at 100% 0%, ${project.accent}1f 0%, transparent 55%)`,
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': {
          borderColor: `${project.accent}aa`,
          boxShadow: `0 18px 50px -20px ${project.accent}80`,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
        }}
      >
        {/* Left: copy + CTAs */}
        <Box
          sx={{
            flex: '1 1 60%',
            p: { xs: 2.5, sm: 3.5 },
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            minWidth: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography
              component="span"
              sx={{
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'text.disabled',
              }}
            >
              {'// featured project'}
            </Typography>
            <StatusBadge status={project.status} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              component="img"
              src={project.icon}
              alt=""
              sx={{ width: 44, height: 44, borderRadius: 2 }}
            />
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, color: 'secondary.main', letterSpacing: '-0.02em' }}
            >
              {project.name}
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560 }}>
            {project.description}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
            {project.chipKeys.map((key) => (
              <span key={key}>{getChip(key)}</span>
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mt: 1 }}>
            <Button
              variant="contained"
              color="secondary"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate(project.link)}
              sx={{ fontWeight: 700 }}
            >
              Explore {project.name}
            </Button>
            {project.external?.map((link) => (
              <Button
                key={link.href}
                variant="outlined"
                color="inherit"
                endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                href={link.href}
                target="_blank"
                rel="noopener"
                sx={{ borderColor: 'divider', color: 'text.secondary' }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Right: product highlight */}
        {project.highlight && (
          <Box
            sx={{
              flex: '1 1 40%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 2, md: 3 },
              pt: { xs: 0, md: 3 },
            }}
          >
            <Box
              component="img"
              src={project.highlight}
              alt={`${project.name} preview`}
              loading="eager"
              sx={{
                maxWidth: '100%',
                maxHeight: { xs: 240, md: 300 },
                objectFit: 'contain',
                filter: `drop-shadow(0 12px 32px ${project.accent}55)`,
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
