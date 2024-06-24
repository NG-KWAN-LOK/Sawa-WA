import { BackgroundImage } from "@/entrypoints/component/background-image/BackgroundImage";
import { Box } from "@mui/material";
import { useCallback, useState } from "react";

function App() {
  return (
    <Box
      sx={{
        width: 600,
        p: 2,
      }}
    >
      <BackgroundImage />
    </Box>
  );
}

export default App;
