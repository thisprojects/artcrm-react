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

  useEffect(() => {
    getAnalytics();
  }, []);

  const eventData = response && response.mostRecentEvents;

  const allPostCodes = response && response.postcodes;

  const eventCatagories = eventData?.map((item) => item.name);
  const eventSeries = eventData?.map((item) => item.contactCount);

  const ageDemographics = {
    "Under 10": 0,
    "Ten to Twenty": 0,
    "Twenty to Forty": 0,
    "Forty to Sixty": 0,
    "Sixty Plus": 0,
  };

  response?.ageDemographic?.forEach((item) => {
    if (item.age === null) return;
    if (item.age < 10) ageDemographics["Under 10"] += 1;
    if (item.age >= 10 && item.age <= 20) ageDemographics["Ten to Twenty"] += 1;
    if (item.age > 20 && item.age <= 40)
      ageDemographics["Twenty to Forty"] += 1;
    if (item.age > 40 && item.age <= 60) ageDemographics["Forty to Sixty"] += 1;
    if (item.age > 60) ageDemographics["Sixty Plus"] += 1;
  });

  console.log("DEMOS", ageDemographics);
  const ageDemographicCatagories =
    (ageDemographics && Object.keys(ageDemographics)) || [];
  const ageDemographicSeries =
    (ageDemographics && Object.values(ageDemographics)) || [];

  const allPostCodeStats = allPostCodes?.reduce((acc, curr) => {
    if (!acc[curr]) {
      acc[curr] = 1;
    } else {
      acc[curr]++;
    }
    return acc;
  }, {});

  console.log("post code", allPostCodeStats);

  const postCodeCatagories =
    (allPostCodeStats && Object.keys(allPostCodeStats)) || [];
  const postCodeSeries =
    (allPostCodeStats && Object.values(allPostCodeStats)) || [];

  // const postCodes = contactData?.map((item) => item.postCodes);

  console.log("cats", eventCatagories);
  console.log("conts", eventSeries);

  console.log("response", response);
  return (
    <div className="dashboard">
      <Box sx={{ padding: "10px" }}>
        <h1>Dashboard</h1>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item md={4}>
            <p>Total Contacts: {response?.numberOfContacts} </p>
          </Grid>
          <Grid item md={4}>
            <p>Total Organisations: {response?.numberOfOrganisations} </p>
          </Grid>
          <Grid item md={4}>
            <p>Total Events: {response?.numberOfEvents}</p>
          </Grid>
          <Grid item md={6}>
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                colors: ["#2f7ed8", "#0d233a", "#8bbc21", "#910000", "#1aadce"],
                plotOptions: {
                  column: {
                    colorByPoint: true,
                  },
                },
                chart: {
                  type: "column",
                },
                xAxis: {
                  categories: ageDemographicCatagories,
                  crosshair: true,
                },
                title: {
                  text: "Age Demographics",
                },
                series: [{ data: ageDemographicSeries }],
              }}
            />
          </Grid>
          <Grid item md={6}>
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                colors: ["#492970", "#f28f43", "#77a1e5", "#c42525", "#a6c96a"],
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
                },
                title: {
                  text: "Five Most Recent Events",
                },
                series: [{ data: eventSeries }],
              }}
            />
          </Grid>
          <Grid item md={12}>
            {allPostCodeStats && (
              <HighchartsReact
                highcharts={Highcharts}
                umber
                of
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
                    text: "Postcode Demographic - All Contacts",
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
