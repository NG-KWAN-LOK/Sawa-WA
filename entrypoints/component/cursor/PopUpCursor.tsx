import SearchIcon from "@mui/icons-material/Search";

export const PopUpCursor = ({
  top,
  left,
  text,
}: {
  top: number;
  left: number;
  text: string;
}) => {
  return (
    <div
      id='pop-up-cursor-button'
      style={{
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        zIndex: 9999,
        borderRadius: "50%",
        top,
        left,
        cursor: "pointer",
      }}
      onClick={() => {
        window.open(`https://www.google.com/search?q=${text}`, "_blank");
      }}
    >
      <SearchIcon
        sx={{
          p: 1,
        }}
      />
      {/* 123 */}
    </div>
  );
};
