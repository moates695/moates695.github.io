import { Brightness4, Brightness7 } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box, Switch, IconButton } from "@mui/material";
import { useState, MouseEvent, Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";

export interface AppToolbarProps {
  isDark: boolean
  setIsDark: Dispatch<SetStateAction<boolean>>
}

// todo look for mui button badges for (alpha) text
export default function AppToolbar(props: AppToolbarProps) {
  const { isDark, setIsDark } = props;

  const [finskaAnchor, setFinskaAnchor] = useState<null | HTMLElement>(null);
  const finskaOpen = Boolean(finskaAnchor);
  
  const [gymAnchor, setGymAnchor] = useState<null | HTMLElement>(null);
  const gymOpen = Boolean(gymAnchor);

  const [codeAnchor, setCodeAnchor] = useState<null | HTMLElement>(null);
  const codeOpen = Boolean(codeAnchor);
  
  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", maxWidth: 1200, width: '100%', alignSelf: 'center' }}>
        <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button
            color="inherit"
            onClick={(e) => setFinskaAnchor(e.currentTarget)}
          >
            Finska
          </Button>
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Button
              color="inherit"
              onClick={(e) => setGymAnchor(e.currentTarget)}
            >
              Gym Junkie
            </Button>
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: 0,
                right: -16,
                fontSize: "0.6rem",
                color: "white",
                opacity: 0.8,
                pointerEvents: "none",
              }}
            >
              alpha
            </Typography>
          </Box>
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
        
        <Menu 
          anchorEl={finskaAnchor}
          open={finskaOpen}
          onClose={() => setFinskaAnchor(null)}
        >
          <MenuItem
            component={Link}
            to="/finska"
            onClick={() => setFinskaAnchor(null)}
          >
            Overview
          </MenuItem>
          <MenuItem
            component={Link}
            to="/finska/design"
            onClick={() => setFinskaAnchor(null)}
          >
            Design
          </MenuItem>
          <MenuItem
            component={Link}
            to="/finska/changes"
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
            to="/gym-junkie/functionality"
            onClick={() => setGymAnchor(null)}
          >
            Functionality
          </MenuItem>
          <MenuItem
            component={Link}
            to="/gym-junkie/changes"
            onClick={() => setGymAnchor(null)}
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
