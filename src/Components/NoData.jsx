import "../App.css";
import Box from "@mui/material/Box";
import Loading from "./Loading";

export default function NoData({ label, loading }) {
  return (
    <Box
      sx={{
        height: "500px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? (
        <Loading />
      ) : (
        <h1>
          No {label} Data Found - Please Add Some {label}s
        </h1>
      )}
    </Box>
  );
}
