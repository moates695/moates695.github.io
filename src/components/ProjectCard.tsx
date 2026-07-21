import { Avatar, Box, Card, CardActionArea, Typography } from "@mui/material";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { useNavigate } from 'react-router-dom';
import { ProjectInfo } from "../middleware/projects";
import { getChip } from "../middleware/chipMap";
import StatusBadge from "./StatusBadge";

interface ProjectCardProps {
  project: ProjectInfo
}

/**
 * Standard project card used in the homepage grid and the projects page.
 * The whole card is a single link to the project's page (keyboard-focusable
 * via CardActionArea). Hover lifts the card and lights the border in the
 * project's accent colour.
 */
export default function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: project.accent,
          boxShadow: `0 10px 30px -12px ${project.accent}80`,
        },
        '&:focus-within': {
          borderColor: project.accent,
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(project.link)}
        sx={{
          height: '100%',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, width: '100%' }}>
          <Avatar
            src={project.icon}
            alt=""
            variant="rounded"
            sx={{
              width: 40,
              height: 40,
              bgcolor: `${project.accent}22`,
              color: project.accent,
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {project.initials}
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              lineHeight: 1.15,
              color: project.featureName ? 'secondary.main' : 'text.primary',
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            {project.name}
          </Typography>
          <StatusBadge status={project.status} size="small" />
          <ArrowOutwardIcon
            sx={{ fontSize: 18, color: 'text.disabled', flexShrink: 0 }}
          />
        </Box>

        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', mt: 1.25, mb: 2, flexGrow: 1 }}
        >
          {project.blurb}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {project.chipKeys.map((key) => (
            <span key={key}>{getChip(key)}</span>
          ))}
        </Box>
      </CardActionArea>
    </Card>
  );
}
