import "../App.css";
import Box from "@mui/material/Box";
import Loading from "./Loading";

export default function NoData({ label, loading, error }) {
  if (loading) {
    return (
      <Box
        sx={{
          height: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading />
      </Box>
    );
  } else if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Error, please try again.</h1>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          height: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>
          No {label} Data Found - Please Add Some {label}s
        </h1>
      </Box>
    );
  }
}
