import "../App.css";
import NavBar from "../Components/NavBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "../Components/Table";
import { useState, useEffect } from "react";

const hc = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "postCode",
    numeric: true,
    disablePadding: false,
    label: "Post Code",
  },
  {
    id: "venueName",
    numeric: true,
    disablePadding: false,
    label: "Venue Name",
  },
];

const Events = () => {

  const [resp, setResponse] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await fetch(
        "http://localhost:8080/api/v1/event/getAll"
      ).then((r) => r.json());
      console.log("The result", response);
      setResponse(response);
    };
    getData();
  }, []);

  return (
    <div className="contacts">
      <NavBar />
      <Box sx={{padding: '10px'}}>
        <h1>Events</h1>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item md={10}>
           { resp.length > 0 && <Table headCells={hc} rows={resp} /> }
          </Grid>
          <Grid item md={2}>
            <Stack direction="column" spacing={2}>
              <Button>Add Single Event</Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Events;
