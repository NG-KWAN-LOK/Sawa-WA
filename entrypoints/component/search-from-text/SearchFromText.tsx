import { IS_SEARCH_TEXT_CHECKED_STORAGE_KEY } from "@/entrypoints/utils/storage";
import { Box, Typography, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";

export const SearchFromText = () => {
  const [isSearchTextChecked, setIsSearchTextChecked] = useState<boolean>(true);

  useEffect(() => {
    const getStorageValue = async () => {
      const isSearchTextChecked = (await storage.getItem(
        IS_SEARCH_TEXT_CHECKED_STORAGE_KEY
      )) as unknown as boolean | null;

      if (isSearchTextChecked !== null) {
        setIsSearchTextChecked(isSearchTextChecked);
      } else {
        await storage.setItem(
          IS_SEARCH_TEXT_CHECKED_STORAGE_KEY,
          isSearchTextChecked
        );
      }
    };

    getStorageValue();
  }, []);

  const handleSearchTextCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsSearchTextChecked(event.target.checked);
    storage.setItem(IS_SEARCH_TEXT_CHECKED_STORAGE_KEY, event.target.checked);
  };
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          variant='body1'
          sx={{
            width: 230,
          }}
        >
          Search Text:
        </Typography>
        <Checkbox
          checked={isSearchTextChecked}
          onChange={handleSearchTextCheckboxChange}
        />
      </Box>
    </Box>
  );
};
