import "../App.css";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import useNetworkRequest from "../Hooks/useNetworkRequest";
import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const Dashboard = () => {
  const [response, setResponse] = useState(null);
  const { getItems } = useNetworkRequest();

  const getAnalytics = async () => {
    const response = await getItems(
      "http://localhost:8080/api/v1/analysis/getAnalysis"
    );
    setResponse(response);
  };

  const options = {
    title: {
      text: "My chart",
    },
    series: [
      {
        data: [1, 2, 3],
      },
    ],
  };

  useEffect(() => {
    getAnalytics();
  }, []);

  const eventData = response && response.mostRecentEvents;
  const contactData = response && response.lastFiveContactSignups;

  const eventCatagories = eventData?.map((item) => item.name);
  const eventSeries = eventData?.map((item) => item.contactCount);

  const postCodeStats = contactData?.reduce((acc, curr) => {
    if (!acc[curr.postCode]) {
      acc[curr.postCode] = 1;
    } else {
      acc[curr.postCode]++;
    }
    return acc;
  }, {});

  console.log("post code", postCodeStats);

  const postCodeCatagories =
    (postCodeStats && Object.keys(postCodeStats)) || [];
  const postCodeSeries = (postCodeStats && Object.values(postCodeStats)) || [];

  // const postCodes = contactData?.map((item) => item.postCodes);

  console.log("cats", eventCatagories);
  console.log("conts", eventSeries);

  console.log("response", response);
  return (
    <div className="dashboard">
      <Box sx={{ padding: "10px" }}>
        <h1>Dashboard</h1>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item md={3}>
            Number of Contacts
          </Grid>
          <Grid item md={3}>
            Number of Organisations
          </Grid>
          <Grid item md={3}>
            Number of Events
          </Grid>
          <Grid item md={3}>
            Most recent contacts
            {contactData?.map((item) => (
              <p>
                {item.firstName} {item.lastName}
              </p>
            ))}
          </Grid>
          <Grid item md={12}>
            Most Recent Events
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                plotOptions: {
                  column: {
                    colorByPoint: true,
                  },
                },
                chart: {
                  type: "column",
                },
                xAxis: {
                  categories: eventCatagories,
                  crosshair: true,
                  colors: [
                    "#2f7ed8",
                    "#0d233a",
                    "#8bbc21",
                    "#910000",
                    "#1aadce",
                    "#492970",
                    "#f28f43",
                    "#77a1e5",
                    "#c42525",
                    "#a6c96a",
                  ],
                },
                title: {
                  text: "chart",
                },
                series: [{ data: eventSeries }],
              }}
            />
          </Grid>
          <Grid item md={12}>
            Post Code Stats
            {postCodeStats && (
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  plotOptions: {
                    column: {
                      colorByPoint: true,
                    },
                  },
                  chart: {
                    type: "column",
                  },
                  xAxis: {
                    categories: postCodeCatagories,
                    crosshair: true,
                    colors: [
                      "#2f7ed8",
                      "#0d233a",
                      "#8bbc21",
                      "#910000",
                      "#1aadce",
                      "#492970",
                      "#f28f43",
                      "#77a1e5",
                      "#c42525",
                      "#a6c96a",
                    ],
                  },
                  title: {
                    text: "chart",
                  },
                  series: [{ data: postCodeSeries }],
                }}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Dashboard;
