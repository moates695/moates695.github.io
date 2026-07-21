import { Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Toolbar, Button, Menu, MenuItem, Box, IconButton, useMediaQuery, useTheme, Drawer, List, ListItemButton, ListItemText, Collapse, Divider } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SAND, SPACE, PLEX } from './sand';

const SHOWCASE_COLOR = SAND.gold;

/** Monogram mark on the left of the bar (Space Grotesk, wide tracking). */
const monogramSx = {
  font: `500 20px ${SPACE}`,
  letterSpacing: '.3em',
  color: SAND.primary,
  textDecoration: 'none',
} as const;

/** Sand nav link styling for the desktop bar. */
const navButtonSx = {
  textTransform: 'none',
  minWidth: 0,
  px: 0,
  font: `400 14px ${PLEX}`,
  color: SAND.body,
  '&:hover': { color: SAND.primary, background: 'transparent' },
} as const;

interface NavLink {
  label: string
  to: string
}

interface NavGroup {
  label: string
  overview: string
  color?: string
  bold?: boolean
  links: NavLink[]
}

// Every project menu, grouped under a single "Projects" entry.
const PROJECT_GROUPS: NavGroup[] = [
  {
    label: 'Gym Junkie',
    overview: '/gym-junkie',
    color: 'secondary.main',
    bold: true,
    links: [
      { label: 'Overview', to: '/gym-junkie' },
      { label: 'Details', to: '/gym-junkie/details' },
      { label: 'Changes', to: '/gym-junkie/changes' },
      { label: 'Data Export', to: '/gym-junkie/data-export' },
      { label: 'Delete Account', to: '/gym-junkie/delete-me' },
    ],
  },
  {
    label: 'Woodchuck',
    overview: '/woodchuck',
    color: SHOWCASE_COLOR,
    links: [
      { label: 'Overview', to: '/woodchuck' },
      { label: 'Design', to: '/woodchuck/design' },
      { label: 'Changes', to: '/woodchuck/changes' },
    ],
  },
  {
    label: 'Other',
    overview: '/projects',
    links: [
      { label: 'Cellular Tracking', to: '/other/cellular-tracking' },
      { label: 'Downer Helper', to: '/other/downer-helper' },
      { label: 'Postgres Deploy', to: '/other/postgres-deploy' },
      { label: 'Poppycock', to: '/poppycock' },
    ],
  },
];

export default function AppToolbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Desktop "Projects" dropdown + hover-flyout submenus
  const [projectsAnchor, setProjectsAnchor] = useState<null | HTMLElement>(null);
  const projectsOpen = Boolean(projectsAnchor);
  const [submenu, setSubmenu] = useState<{ label: string; anchorEl: HTMLElement } | null>(null);
  const closeAll = () => {
    setProjectsAnchor(null);
    setSubmenu(null);
  };

  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [groupExpanded, setGroupExpanded] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) =>
    setGroupExpanded((prev) => ({ ...prev, [label]: !prev[label] }));

  const closeDrawer = () => {
    setDrawerOpen(false);
    setProjectsExpanded(false);
    setGroupExpanded({});
  };

  const mobileDrawer = (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={closeDrawer}
      PaperProps={{
        sx: { width: 270, bgcolor: 'background.paper' }
      }}
    >
      <Box sx={{ pt: 1 }}>
        <List disablePadding>
          <ListItemButton component={Link} to="/" onClick={closeDrawer}>
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton component={Link} to="/about" onClick={closeDrawer}>
            <ListItemText primary="Resume" />
          </ListItemButton>
          <Divider />

          <ListItemButton onClick={() => setProjectsExpanded((v) => !v)}>
            <ListItemText primary="Projects" primaryTypographyProps={{ sx: { fontWeight: 600 } }} />
            {projectsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={projectsExpanded}>
            <List disablePadding>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/projects" onClick={closeDrawer}>
                <ListItemText primary="All projects" />
              </ListItemButton>

              {PROJECT_GROUPS.map((group) => (
                <Box key={group.label}>
                  <ListItemButton sx={{ pl: 4 }} onClick={() => toggleGroup(group.label)}>
                    <ListItemText
                      primary={group.label}
                      primaryTypographyProps={{ sx: { color: group.color, fontWeight: group.bold ? 700 : 400 } }}
                    />
                    {groupExpanded[group.label] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItemButton>
                  <Collapse in={Boolean(groupExpanded[group.label])}>
                    <List disablePadding>
                      {group.links.map((link) => (
                        <ListItemButton
                          key={link.to}
                          sx={{ pl: 6 }}
                          component={Link}
                          to={link.to}
                          onClick={closeDrawer}
                        >
                          <ListItemText primary={link.label} primaryTypographyProps={{ variant: 'body2' }} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </Box>
              ))}
            </List>
          </Collapse>
          <Divider />

          <ListItemButton component={Link} to="/contact" onClick={closeDrawer}>
            <ListItemText primary="Contact" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: 'rgba(11,9,8,.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${SAND.hairline}`,
        backgroundImage: 'none',
        color: SAND.primary,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", maxWidth: 1200, width: '100%', alignSelf: 'center' }}>
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Box component={Link} to="/" sx={monogramSx}>MO</Box>
            </Box>
            {/* keep the row balanced opposite the hamburger */}
            <Box sx={{ width: 40 }} />
            {mobileDrawer}
          </>
        ) : (
          <>
            <Box component={Link} to="/" sx={monogramSx}>MO</Box>
            <Box sx={{ display: "flex", alignItems: 'center', gap: '28px' }}>
              <Button component={Link} to="/" sx={{ ...navButtonSx, color: SAND.primary }}>Home</Button>
              <Button component={Link} to="/about" sx={navButtonSx}>Resume</Button>
              <Button
                onClick={(e) => setProjectsAnchor(e.currentTarget)}
                endIcon={projectsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={navButtonSx}
              >
                Projects
              </Button>
              <Button
                component={Link}
                to="/contact"
                endIcon={<Box component="span" sx={{ color: SAND.gold }}>&#8594;</Box>}
                sx={{
                  textTransform: 'none',
                  font: `400 14px ${PLEX}`,
                  color: SAND.primary,
                  border: '1px solid rgba(216,170,120,.32)',
                  borderRadius: '8px',
                  px: '15px',
                  py: '9px',
                  '&:hover': { borderColor: 'rgba(216,170,120,.6)', background: 'rgba(216,170,120,.06)' },
                }}
              >
                Contact
              </Button>
            </Box>
          </>
        )}

        {/* Top-level Projects menu */}
        <Menu
          anchorEl={projectsAnchor}
          open={projectsOpen}
          onClose={closeAll}
          slotProps={{
            list: { sx: { minWidth: 200, py: 0.5 } },
            paper: {
              sx: {
                background: SAND.surface,
                color: SAND.primary,
                border: `1px solid ${SAND.goldBorder}`,
                backgroundImage: 'none',
              },
            },
          }}
        >
          <MenuItem
            component={Link}
            to="/projects"
            onClick={closeAll}
            onMouseEnter={() => setSubmenu(null)}
            sx={{ fontWeight: 600 }}
          >
            All projects
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          {PROJECT_GROUPS.map((group) => (
            <MenuItem
              key={group.label}
              component={Link}
              to={group.overview}
              onClick={closeAll}
              onMouseEnter={(e) => setSubmenu({ label: group.label, anchorEl: e.currentTarget })}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 3,
                color: group.color,
                fontWeight: group.bold ? 700 : 400,
              }}
            >
              {group.label}
              <ChevronRightIcon fontSize="small" sx={{ opacity: 0.6, mr: -0.5 }} />
            </MenuItem>
          ))}
        </Menu>

        {/* Hover flyout submenus, one per group, opening to the side */}
        {PROJECT_GROUPS.map((group) => (
          <Menu
            key={`${group.label}-submenu`}
            anchorEl={submenu?.label === group.label ? submenu.anchorEl : null}
            open={submenu?.label === group.label}
            onClose={closeAll}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            hideBackdrop
            disableAutoFocus
            disableEnforceFocus
            disableScrollLock
            sx={{ pointerEvents: 'none' }}
            slotProps={{
              paper: {
                sx: {
                  pointerEvents: 'auto',
                  minWidth: 180,
                  background: SAND.surface,
                  color: SAND.primary,
                  border: `1px solid ${SAND.goldBorder}`,
                  backgroundImage: 'none',
                },
              },
              list: { sx: { py: 0.5 }, onMouseLeave: () => setSubmenu(null) },
            }}
          >
            {group.links.map((link) => (
              <MenuItem
                key={link.to}
                component={Link}
                to={link.to}
                onClick={closeAll}
                sx={{ fontSize: 14 }}
              >
                {link.label}
              </MenuItem>
            ))}
          </Menu>
        ))}
      </Toolbar>
    </AppBar>
  );
}
