import { Box, Tooltip, Typography } from "@mui/material";
import { ProjectStatus, statusMeta } from "../middleware/projects";
import { MONO } from "../styles/tokens";

interface StatusBadgeProps {
  status: ProjectStatus
  size?: 'small' | 'medium'
}

/**
 * Monospace status pill (prod / test / poc) with a coloured status dot.
 * Theme-aware: the colour comes from `statusMeta` and reads on light + dark.
 */
export default function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const meta = statusMeta[status];
  const dot = size === 'small' ? 6 : 7;

  return (
    <Tooltip title={meta.full} arrow disableInteractive>
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          flexShrink: 0,
          px: size === 'small' ? 0.75 : 1,
          py: 0.25,
          borderRadius: 999,
          border: '1px solid',
          borderColor: `${meta.color}66`,
          bgcolor: `${meta.color}1a`,
        }}
      >
        <Box
          component="span"
          sx={{
            width: dot,
            height: dot,
            borderRadius: '50%',
            bgcolor: meta.color,
            boxShadow: `0 0 6px ${meta.color}`,
            flexShrink: 0,
          }}
        />
        <Typography
          component="span"
          sx={{
            fontFamily: MONO,
            fontSize: size === 'small' ? 10 : 11,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: meta.color,
            lineHeight: 1,
          }}
        >
          {meta.label}
        </Typography>
      </Box>
    </Tooltip>
  );
}
