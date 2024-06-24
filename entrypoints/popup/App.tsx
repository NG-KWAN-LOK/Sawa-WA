import { useEffect, useState } from "react";
import { Box, Button, Slider, Stack, Typography } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";

function App() {
  const [lightValue, setLightValue] = useState<number>(1);

  useEffect(() => {
    const getLightValue = async () => {
      const value = (await storage.getItem(
        "local:backgroundImageBrightness"
      )) as unknown as number | null;

      if (value) {
        setLightValue(value);
      }
    };

    getLightValue();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (file.size > 1024 * 1024) {
          alert("Image size should be less than 1MB");
          return;
        }
        if (event.target) {
          storage.setItem(
            "local:backgroundImageUrl",
            event.target.result as string
          );
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImageClick = () => {
    storage.removeItem("local:backgroundImageUrl");
  };

  const handleLightValueChange = (
    _event: unknown,
    value: number | number[]
  ) => {
    setLightValue(value as number);
    storage.setItem("local:backgroundImageBrightness", value);
  };

  return (
    <>
      <Box
        sx={{
          width: 600,
          minHeight: 400,
          padding: 2,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Typography
              variant='body1'
              sx={{
                marginRight: 2,
              }}
            >
              Change Background Image:
            </Typography>
            <Button size='small' onClick={handleRemoveImageClick}>
              Remove Image
            </Button>
            <input type='file' accept='image/*' onChange={handleImageChange} />
          </Box>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Typography
              variant='body1'
              sx={{
                marginRight: 2,
              }}
            >
              Background Image Brightness:
            </Typography>
            <Box sx={{ width: 300 }}>
              <Stack
                spacing={2}
                direction='row'
                sx={{ mb: 1 }}
                alignItems='center'
              >
                <DarkMode />
                <Slider
                  max={1}
                  min={0.01}
                  step={0.01}
                  value={lightValue}
                  onChange={handleLightValueChange}
                />
                <LightMode />
                <Typography>{Math.round(lightValue * 100)}</Typography>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default App;
