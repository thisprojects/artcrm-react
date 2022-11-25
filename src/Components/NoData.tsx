import "../App.css";
import Box from "@mui/material/Box";
import Loading from "./Loading";

interface NoDataProps {
  label: string | null;
  loading: boolean | null;
  error: boolean | null;
}

const NoData: React.FC<NoDataProps> = ({ label, loading, error }) => {
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
};

export default NoData;
