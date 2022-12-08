import "../App.css";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import useNetworkRequest from "../Utilities/useNetworkRequest";
import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Loading from "../Components/Loading";
import Events from "../Models/IEvent";

interface Response {
  mostRecentEvents: Array<Events>;
  postcodes: Array<string>;
  ageDemographic: Array<{ age: number }>;
  numberOfContacts: number;
  numberOfOrganisations: number;
  numberOfEvents: number;
}

const Dashboard = () => {
  const [response, setResponse] = useState<Response>();
  const { getItems } = useNetworkRequest();

  const getAnalytics = async () => {
    const response = await getItems("/api/v1/analysis/getAnalysis");
    setResponse(response);
  };

  useEffect(() => {
    getAnalytics();
  }, []);

  const eventData = response && response?.mostRecentEvents;
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
    if (!acc[curr as keyof object]) {
      (acc[curr as keyof object] as number) = 1;
    } else {
      acc[curr as keyof object]++;
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
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid
            container
            sx={{
              paddingBottom: "10px",
              paddingTop: "10px",
              borderTop: "1px solid lightgray",
              borderBottom: "1px solid lightgray",
              boxShadow: "0 5px 10px -5px #aaaaaa",
              backgroundColor: "white",
              marginTop: "30px",
              justifyContent: "space-evenly",
            }}
          >
            <Grid item md={4}>
              {response ? (
                <p data-testid="total-contacts">
                  Total Contacts: {response?.numberOfContacts}{" "}
                </p>
              ) : (
                <Loading />
              )}
            </Grid>
            <Grid item md={4}>
              {response ? (
                <p data-testid="total-orgs">
                  Total Organisations: {response?.numberOfOrganisations}{" "}
                </p>
              ) : (
                <Loading />
              )}
            </Grid>
            <Grid item md={4}>
              {response ? (
                <p data-testid="total-events">
                  Total Events: {response?.numberOfEvents}
                </p>
              ) : (
                <Loading />
              )}
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              marginTop: "20px",
              paddingBottom: "20px",
              justifyContent: "space-evenly",
            }}
          >
            <Grid
              item
              md={5}
              sm={10}
              xs={10}
              sx={{
                border: "1px solid lightgray",
                boxShadow: "10px 0.5px 5px #aaaaaa",
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                minHeight: "300px",
                marginBottom: "20px",
              }}
            >
              {response ? (
                <HighchartsReact
                  data-testid="most-recent-events"
                  highcharts={Highcharts}
                  options={{
                    colors: [
                      "#492970",
                      "#f28f43",
                      "#77a1e5",
                      "#c42525",
                      "#a6c96a",
                    ],
                    accessibility: {
                      enabled: false,
                    },
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
              ) : (
                <Loading />
              )}{" "}
            </Grid>
            <Grid
              item
              md={5}
              sm={10}
              xs={10}
              sx={{
                border: "1px solid lightgray",
                boxShadow: "10px 0.5px 5px #aaaaaa",
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                marginBottom: "20px",
              }}
            >
              {response ? (
                <HighchartsReact
                  highcharts={Highcharts}
                  data-testid="age-demographic"
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
                      enabled: false,
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
              ) : (
                <Loading />
              )}
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              justifyContent: "center",
            }}
          >
            <Grid
              md={10}
              sm={10}
              xs={10}
              item
              sx={{
                border: "1px solid lightgray",
                boxShadow: "10px 0.5px 5px #aaaaaa",
                marginBottom: "10px",
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                minHeight: "300px",
              }}
            >
              {allPostCodeStats ? (
                <HighchartsReact
                  highcharts={Highcharts}
                  data-testid="postcode-demographic"
                  options={{
                    plotOptions: {
                      column: {
                        colorByPoint: true,
                      },
                    },
                    chart: {
                      type: "column",
                    },
                    accessibility: {
                      enabled: false,
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
              ) : (
                <Loading />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Dashboard;
