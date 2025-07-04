// theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6750A4", // M3 primary color
    },
    secondary: {
      main: "#625B71",
    },
    background: {
      default: "#FFFBFE",
      paper: "#FFFFFF",
    },
    error: {
      main: "#B3261E",
    },
  },
  shape: {
    borderRadius: 12, // Rounded corners like M3
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    button: {
      textTransform: "none", // M3 buttons are not uppercase
      fontWeight: "medium",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20, // M3 buttons have more rounded shapes
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;
