import { Brightness4, Brightness7, Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box, Switch, IconButton, useMediaQuery, useTheme, Drawer, List, ListItemButton, ListItemText, Collapse, Divider } from "@mui/material";
import { useState, MouseEvent, Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const SHOWCASE_COLOR = '#82b1ff';

export interface AppToolbarProps {
  isDark: boolean
  setIsDark: Dispatch<SetStateAction<boolean>>
}

// todo look for mui button badges for (alpha) text
export default function AppToolbar(props: AppToolbarProps) {
  const { isDark, setIsDark } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [finskaAnchor, setFinskaAnchor] = useState<null | HTMLElement>(null);
  const finskaOpen = Boolean(finskaAnchor);

  const [gymAnchor, setGymAnchor] = useState<null | HTMLElement>(null);
  const gymOpen = Boolean(gymAnchor);

  const [poppycockAnchor, setPoppycockAnchor] = useState<null | HTMLElement>(null);
  const poppycockOpen = Boolean(poppycockAnchor);

  const [codeAnchor, setCodeAnchor] = useState<null | HTMLElement>(null);
  const codeOpen = Boolean(codeAnchor);

  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [finskaExpanded, setFinskaExpanded] = useState(false);
  const [gymExpanded, setGymExpanded] = useState(false);
  const [poppycockExpanded, setPoppycockExpanded] = useState(false);
  const [otherExpanded, setOtherExpanded] = useState(false);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setFinskaExpanded(false);
    setGymExpanded(false);
    setPoppycockExpanded(false);
    setOtherExpanded(false);
  };

  const mobileDrawer = (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={closeDrawer}
      PaperProps={{
        sx: { width: 260, bgcolor: 'background.paper' }
      }}
    >
      <Box sx={{ pt: 1 }}>
        <List disablePadding>
          <ListItemButton component={Link} to="/" onClick={closeDrawer}>
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton component={Link} to="/about" onClick={closeDrawer}>
            <ListItemText primary="About" />
          </ListItemButton>
          <Divider />

          <ListItemButton onClick={() => setFinskaExpanded(!finskaExpanded)}>
            <ListItemText
              primary="Woodchuck"
              primaryTypographyProps={{ sx: { color: SHOWCASE_COLOR } }}
            />
            {finskaExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={finskaExpanded}>
            <List disablePadding>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/woodchuck" onClick={closeDrawer}>
                <ListItemText primary="Overview" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/woodchuck/design" onClick={closeDrawer}>
                <ListItemText primary="Design" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/woodchuck/changes" onClick={closeDrawer}>
                <ListItemText primary="Changes" />
              </ListItemButton>
            </List>
          </Collapse>
          <Divider />

          <ListItemButton onClick={() => setGymExpanded(!gymExpanded)}>
            <ListItemText
              primary="Gym Junkie"
              primaryTypographyProps={{
                sx: { color: 'secondary.main', fontWeight: 700 },
              }}
            />
            {gymExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={gymExpanded}>
            <List disablePadding>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/gym-junkie" onClick={closeDrawer}>
                <ListItemText primary="Overview" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/gym-junkie/details" onClick={closeDrawer}>
                <ListItemText primary="Details" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/gym-junkie/changes" onClick={closeDrawer}>
                <ListItemText primary="Changes" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/gym-junkie/data-export" onClick={closeDrawer}>
                <ListItemText primary="Data Export" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/gym-junkie/delete-me" onClick={closeDrawer}>
                <ListItemText primary="Delete Account" />
              </ListItemButton>
            </List>
          </Collapse>
          <Divider />

          <ListItemButton onClick={() => setPoppycockExpanded(!poppycockExpanded)}>
            <ListItemText
              primary="Poppycock"
              primaryTypographyProps={{ sx: { color: SHOWCASE_COLOR } }}
            />
            {poppycockExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={poppycockExpanded}>
            <List disablePadding>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/poppycock" onClick={closeDrawer}>
                <ListItemText primary="Overview" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/poppycock/design" onClick={closeDrawer}>
                <ListItemText primary="Design" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/poppycock/changes" onClick={closeDrawer}>
                <ListItemText primary="Changes" />
              </ListItemButton>
            </List>
          </Collapse>
          <Divider />

          <ListItemButton onClick={() => setOtherExpanded(!otherExpanded)}>
            <ListItemText primary="Other" />
            {otherExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={otherExpanded}>
            <List disablePadding>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/other" onClick={closeDrawer}>
                <ListItemText primary="All" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/other/cellular-tracking" onClick={closeDrawer}>
                <ListItemText primary="Cellular Tracking" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/other/downer-helper" onClick={closeDrawer}>
                <ListItemText primary="Downer Helper" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/other/postgres-deploy" onClick={closeDrawer}>
                <ListItemText primary="Postgres Deploy" />
              </ListItemButton>
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
    <AppBar position="static">
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
            <Typography variant="subtitle1" sx={{ flexGrow: 1, textAlign: 'center' }}>
              Portfolio
            </Typography>
            {mobileDrawer}
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexGrow: 1, flexWrap: 'wrap' }}>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/about">About</Button>
              <Button
                onClick={(e) => setFinskaAnchor(e.currentTarget)}
                sx={{ color: SHOWCASE_COLOR }}
              >
                Woodchuck
              </Button>
              <Button
                onClick={(e) => setGymAnchor(e.currentTarget)}
                sx={{ color: 'secondary.main', fontWeight: 700 }}
              >
                Gym Junkie
              </Button>
              <Button
                onClick={(e) => setPoppycockAnchor(e.currentTarget)}
                sx={{ color: SHOWCASE_COLOR }}
              >
                Poppycock
              </Button>
              <Button
                color="inherit"
                onClick={(e) => setCodeAnchor(e.currentTarget)}
              >
                Other
              </Button>
              <Button color="inherit" component={Link} to="/contact">Contact</Button>
            </Box>
            {/* <Box sx={{ display: 'inline-flex' }}>
              <IconButton onClick={() => setIsDark(!isDark)} color="inherit">
                {isDark ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box> */}
          </>
        )}

        <Menu
          anchorEl={finskaAnchor}
          open={finskaOpen}
          onClose={() => setFinskaAnchor(null)}
        >
          <MenuItem
            component={Link}
            to="/woodchuck"
            onClick={() => setFinskaAnchor(null)}
          >
            Overview
          </MenuItem>
          <MenuItem
            component={Link}
            to="/woodchuck/design"
            onClick={() => setFinskaAnchor(null)}
          >
            Design
          </MenuItem>
          <MenuItem
            component={Link}
            to="/woodchuck/changes"
            onClick={() => setFinskaAnchor(null)}
          >
            Changes
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={gymAnchor}
          open={gymOpen}
          onClose={() => setGymAnchor(null)}
        >
          <MenuItem
            component={Link}
            to="/gym-junkie"
            onClick={() => setGymAnchor(null)}
          >
            Overview
          </MenuItem>
          <MenuItem
            component={Link}
            to="/gym-junkie/details"
            onClick={() => setGymAnchor(null)}
          >
            Details
          </MenuItem>
          <MenuItem
            component={Link}
            to="/gym-junkie/changes"
            onClick={() => setGymAnchor(null)}
          >
            Changes
          </MenuItem>
          <MenuItem
            component={Link}
            to="/gym-junkie/data-export"
            onClick={() => setGymAnchor(null)}
          >
            Data Export
          </MenuItem>
          <MenuItem
            component={Link}
            to="/gym-junkie/delete-me"
            onClick={() => setGymAnchor(null)}
          >
            Delete Account
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={poppycockAnchor}
          open={poppycockOpen}
          onClose={() => setPoppycockAnchor(null)}
        >
          <MenuItem
            component={Link}
            to="/poppycock"
            onClick={() => setPoppycockAnchor(null)}
          >
            Overview
          </MenuItem>
          <MenuItem
            component={Link}
            to="/poppycock/design"
            onClick={() => setPoppycockAnchor(null)}
          >
            Design
          </MenuItem>
          <MenuItem
            component={Link}
            to="/poppycock/changes"
            onClick={() => setPoppycockAnchor(null)}
          >
            Changes
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={codeAnchor}
          open={codeOpen}
          onClose={() => setCodeAnchor(null)}
        >
          <MenuItem
            component={Link}
            to="/other"
            onClick={() => setCodeAnchor(null)}
          >
            All
          </MenuItem>
          <MenuItem
            component={Link}
            to="/other/cellular-tracking"
            onClick={() => setCodeAnchor(null)}
          >
            Cellular Tracking
          </MenuItem>
          <MenuItem
            component={Link}
            to="/other/downer-helper"
            onClick={() => setCodeAnchor(null)}
          >
            Downer Helper
          </MenuItem>
          <MenuItem
            component={Link}
            to="/other/postgres-deploy"
            onClick={() => setCodeAnchor(null)}
          >
            Postgres Deploy
          </MenuItem>
        </Menu>

      </Toolbar>
    </AppBar>
  );
}
