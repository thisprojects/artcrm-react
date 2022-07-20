import "../App.css";
import NavBar from "../Components/NavBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "../Components/Table";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <h1>Dashboard</h1>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item md={10}>
            Some stuff here
          </Grid>
          <Grid item md={2}></Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Dashboard;
