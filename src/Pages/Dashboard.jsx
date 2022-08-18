import "../App.css";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import useNetworkRequest from "../Hooks/useNetworkRequest";
import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Typography from "@mui/material/Typography";

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

  const ageDemographics = [
    { name: "Under 10", y: 0 },
    { name: "Ten to Twenty", y: 0 },
    { name: "Twenty to Forty", y: 0 },
    { name: "Forty to Sixty", y: 0 },
    { name: "Sixty Plus", y: 0 },
  ];

  response?.ageDemographic?.forEach((item) => {
    if (item.age === null) return;
    if (item.age < 10) ageDemographics[0].y += 1;
    if (item.age >= 10 && item.age <= 20) ageDemographics[1].y += 1;
    if (item.age > 20 && item.age <= 40) ageDemographics[2].y += 1;
    if (item.age > 40 && item.age <= 60) ageDemographics[3].y += 1;
    if (item.age > 60) ageDemographics[4].y += 1;
  });

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

  const postCodeCatagories =
    (allPostCodeStats && Object.keys(allPostCodeStats)) || [];
  const postCodeSeries =
    (allPostCodeStats && Object.values(allPostCodeStats)) || [];

  return (
    <div className="dashboard">
      <Box>
        <Typography variant="h3" sx={{ margin: "30px" }}>
          Dashboard
        </Typography>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
          <Grid
            container
            item
            md={12}
            sx={{
              paddingBottom: "20px",
              borderTop: "1px solid lightgray",
              borderBottom: "1px solid lightgray",
            }}
          >
            <Grid item md={4}>
              <p>Total Contacts: {response?.numberOfContacts} </p>
            </Grid>
            <Grid item md={4}>
              <p>Total Organisations: {response?.numberOfOrganisations} </p>
            </Grid>
            <Grid item md={4}>
              <p>Total Events: {response?.numberOfEvents}</p>
            </Grid>
          </Grid>
          <Grid
            container
            md={12}
            sx={{
              borderBottom: "1px solid lightgray",
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
          >
            <Grid item md={6} sm={12}>
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  colors: [
                    "#492970",
                    "#f28f43",
                    "#77a1e5",
                    "#c42525",
                    "#a6c96a",
                  ],
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
                  yAxis: {
                    title: {
                      text: "Participants",
                    },
                  },
                  title: {
                    text: "Five Most Recent Events",
                  },
                  series: [
                    {
                      showInLegend: false,
                      data: eventSeries,
                    },
                  ],
                }}
              />
            </Grid>
            <Grid item md={6} sm={12}>
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  colors: [
                    "#2f7ed8",
                    "#0d233a",
                    "#8bbc21",
                    "#910000",
                    "#1aadce",
                  ],
                  plotOptions: {
                    allowPointSelect: true,
                    cursor: "pointer",
                    dataLabels: {
                      enabled: true,
                      format: "<b>{point.name}</b>: {point.percentage:.1f} %",
                    },
                  },
                  accessibility: {
                    point: {
                      valueSuffix: "%",
                    },
                  },
                  chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: "pie",
                  },
                  tooltip: {
                    pointFormat:
                      "{series.name}: <b>{point.percentage:.1f}%</b>",
                  },
                  title: {
                    text: "Age Demographics",
                  },
                  series: [
                    {
                      showInLegend: false,
                      name: "Age Demographic",
                      colorByPoint: true,
                      data: ageDemographicSeries,
                    },
                  ],
                }}
              />
            </Grid>
          </Grid>
          <Grid item md={12} sm={12}>
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
                  yAxis: {
                    title: {
                      text: "Contact Numbers",
                    },
                  },
                  title: {
                    text: "Postcode Demographic - All Contacts",
                  },
                  series: [
                    {
                      showInLegend: false,
                      data: postCodeSeries,
                    },
                  ],
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
