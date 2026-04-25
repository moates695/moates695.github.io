// theme.ts
import { createTheme } from "@mui/material/styles";

const SM_DOWN = "@media (max-width:599.95px)";

const sharedTypography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  h1: {
    fontWeight: 700,
    letterSpacing: "-0.02em",
    [SM_DOWN]: { fontSize: "2.25rem" },
  },
  h2: {
    fontWeight: 700,
    letterSpacing: "-0.01em",
    [SM_DOWN]: { fontSize: "1.85rem" },
  },
  h3: {
    fontWeight: 600,
    letterSpacing: "-0.01em",
    [SM_DOWN]: { fontSize: "1.55rem" },
  },
  h4: {
    fontWeight: 600,
    [SM_DOWN]: { fontSize: "1.35rem" },
  },
  h5: {
    fontWeight: 600,
    [SM_DOWN]: { fontSize: "1.2rem" },
  },
  h6: {
    fontWeight: 600,
    [SM_DOWN]: { fontSize: "1.05rem" },
  },
  subtitle1: {
    fontWeight: 500,
    [SM_DOWN]: { fontSize: "0.95rem" },
  },
  subtitle2: { fontWeight: 500 },
  body1: { fontWeight: 400, lineHeight: 1.7 },
  body2: { fontWeight: 400, lineHeight: 1.6 },
  button: { fontWeight: 600, letterSpacing: "0.02em" },
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0e9aa7", light: "#4dd0e1", dark: "#00796b" },
    secondary: { main: "#f59e0b", light: "#ffb74d", dark: "#e65100" },
    background: {
      default: "#f8f9fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a2e",
      secondary: "#4a4a68",
    },
  },
  typography: sharedTypography,
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#4dd0e1", light: "#80deea", dark: "#26c6da" },
    secondary: { main: "#ffb74d", light: "#ffd180", dark: "#f59e0b" },
    background: {
      default: "#0f0f14",
      paper: "#1a1a24",
    },
    text: {
      primary: "#e8e8f0",
      secondary: "#9999b0",
    },
    divider: "rgba(255, 255, 255, 0.08)",
  },
  typography: sharedTypography,
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});
