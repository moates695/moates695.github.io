// theme.ts
import { createTheme } from "@mui/material/styles";

const SM_DOWN = "@media (max-width:599.95px)";

// "Tech Sand" faces: Space Grotesk for headings, IBM Plex Sans for body/UI.
const SPACE = "'Space Grotesk', system-ui, sans-serif";
const PLEX = "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// Headings use the display face; body inherits Plex from the root fontFamily.
const heading = (extra: object) => ({ fontFamily: SPACE, ...extra });

const sharedTypography = {
  fontFamily: PLEX,
  h1: heading({
    fontWeight: 700,
    letterSpacing: "-0.02em",
    [SM_DOWN]: { fontSize: "2.25rem" },
  }),
  h2: heading({
    fontWeight: 700,
    letterSpacing: "-0.01em",
    [SM_DOWN]: { fontSize: "1.85rem" },
  }),
  h3: heading({
    fontWeight: 600,
    letterSpacing: "-0.01em",
    [SM_DOWN]: { fontSize: "1.55rem" },
  }),
  h4: heading({
    fontWeight: 600,
    [SM_DOWN]: { fontSize: "1.35rem" },
  }),
  h5: heading({
    fontWeight: 600,
    [SM_DOWN]: { fontSize: "1.2rem" },
  }),
  h6: heading({
    fontWeight: 600,
    [SM_DOWN]: { fontSize: "1.05rem" },
  }),
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
    // Tech Sand: warm gold primary, cool cyan secondary, over near-black sand.
    primary: { main: "#d8aa78", light: "#ecc79a", dark: "#b98a55" },
    secondary: { main: "#8fd0d4", light: "#b5e2e5", dark: "#6bb3b8" },
    background: {
      default: "#0b0908",
      paper: "#100d08",
    },
    text: {
      primary: "#ece5d9",
      secondary: "#97907f",
      disabled: "#6f6857",
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
