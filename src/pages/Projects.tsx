import { Box, Typography } from "@mui/material";
import PageLinks from "../components/PageLinks";
import ProjectCard from "../components/ProjectCard";
import StatusBadge from "../components/StatusBadge";
import { allProjects, ProjectStatus, statusMeta } from "../middleware/projects";

const LEGEND: ProjectStatus[] = ['prod', 'test', 'poc', 'collection', 'comp'];

export default function Projects() {
  return (
    <Box
      component="section"
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, pb: 3 }}
    >
      <PageLinks />

      <Box className="reveal">
        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          Everything I&apos;ve built on weekends
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 1, fontWeight: 400 }}>
          Personal projects, every one of them built in my own time on weekends and evenings
          outside of work hours. Shipped apps, published packages and research projects. Each tile
          links through to the detail pages.
        </Typography>
      </Box>

      {/* status legend */}
      <Box
        className="reveal"
        sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 2.5 }, alignItems: 'center', animationDelay: '0.06s' }}
      >
        {LEGEND.map((status) => (
          <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <StatusBadge status={status} size="small" />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {statusMeta[status].full}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        className="reveal"
        sx={{
          display: 'grid',
          gap: 2,
          mt: 1,
          animationDelay: '0.12s',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
        }}
      >
        {allProjects.map((project) => (
          <ProjectCard key={project.key} project={project} />
        ))}
      </Box>
    </Box>
  );
}
