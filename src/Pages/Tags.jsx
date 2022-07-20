import "../App.css";
import NavBar from "../Components/NavBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "../Components/Table";

const Tags = () => {
  return (
    <div className="contacts">
      <NavBar />
      <Box sx={{padding: '10px'}}>
        <h1>Tags</h1>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item md={8}>
            <Table />
          </Grid>
          <Grid item md={4}>
            <Stack direction="column" spacing={2}>
              <Button>Add Single Tag</Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Tags;