import { render, screen } from "./test-utils";
import "@testing-library/jest-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { dashboard } from "./API-Mocks/dashboard";
import App from "./App";

const server = setupServer(
  rest.get(
    "http://localhost:8080/api/v1/analysis/getAnalysis",
    (req, res, ctx) => {
      // respond using a mocked JSON body
      return res(ctx.json(dashboard));
    }
  )
);

beforeAll(() => server.listen());
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());
// clean up once the tests are done
afterAll(() => server.close());

test("Loads dashboard", async () => {
  render(<App />);
  const totalContacts = await screen.findByTestId("total-contacts");
  const totalOrgs = await screen.findByTestId("total-orgs");
  const totalEvents = await screen.findByTestId("total-events");
  const fiveMostRecentEvents = await screen.findByText(
    "Five Most Recent Events"
  );
  const ageDemographics = await screen.findByText("Age Demographics");
  const postcodeDemographics = await screen.findByText(
    "Postcode Demographic - All Contacts"
  );

  expect(totalContacts.textContent).toEqual("Total Contacts: 100 ");
  expect(totalOrgs.textContent).toEqual("Total Organisations: 1 ");
  expect(totalEvents.textContent).toEqual("Total Events: 2");
  expect(fiveMostRecentEvents).toBeInTheDocument();
  expect(ageDemographics).toBeInTheDocument();
  expect(postcodeDemographics).toBeInTheDocument();
});

test("Displays Loading", async () => {
  server.use(
    rest.get(
      "http://localhost:8080/api/v1/analysis/getAnalysis",
      (req, res, ctx) => {
        return res(ctx.status(500));
      }
    )
  );
  render(<App />);
  const loading = await screen.findAllByTestId("loading");
  expect(loading).toBeInstanceOf(Array);
});
