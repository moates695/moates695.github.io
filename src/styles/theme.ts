// theme.ts
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
    background: { 
      default: "#f5f5f5", 
      paper: "#fff" 
    },
    text: { primary: "#000" },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    secondary: { main: "#ce93d8" },
    background: { 
      default: "#1b1b1bff", 
      paper: "#1d1d1d" 
    },
    text: { primary: "#fff" },
  },
});
