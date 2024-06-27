import { BackgroundImage } from "@/entrypoints/component/background-image/BackgroundImage";
import { useTheme } from "@emotion/react";
import { Box, ThemeProvider } from "@mui/material";
import { SearchFromText } from "../component/search-from-text/SearchFromText";

function App() {
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: 600,
          p: 2,
        }}
      >
        <BackgroundImage />
        <SearchFromText />
      </Box>
    </ThemeProvider>
  );
}

export default App;
