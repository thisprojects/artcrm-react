import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
  fireEvent,
  waitFor,
} from "../../test-utils";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { serverFactory } from "../../API-Mocks/mockServer";
import { integrations, singleIntegration } from "../../API-Mocks/integrations";
import Integrations from "../Integrations";

const server = serverFactory({
  collection: integrations,
  single: singleIntegration,
  section: "integration",
});

beforeAll(() => server.listen());
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());
// clean up once the tests are done
afterAll(() => server.close());

describe("User interacts with integrations table", () => {
  test("Loads Integration Table", async () => {
    render(<Integrations />);
    const formIntegrationName = await screen.findByText("a integration");
    expect(formIntegrationName).toBeInTheDocument();
  });

  test("User Selects 1 Item From Table", async () => {
    render(<Integrations />);
    await userEvent.click(await screen.findByText("a integration"));
    const selected = await screen.findByText("1 selected");

    expect(selected).toBeInTheDocument();
  });

  test("User Selects 2 Items From Table", async () => {
    render(<Integrations />);
    await userEvent.click(await screen.findByText("a integration"));
    await userEvent.click(await screen.findByText("b integration"));
    const selected = await screen.findByText("2 selected");
    expect(selected).toBeInTheDocument();
  });

  test("Delete an integration From Table", async () => {
    render(<Integrations />);
    const integration = await screen.findByText("h integration");
    await userEvent.click(integration);
    const deleteButton = await screen.findByTestId("delete-button");
    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);
    expect(deleteButton).not.toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByText("h integration"));
    const deletedintegration = screen.queryByText("h integration");
    expect(deletedintegration).not.toBeInTheDocument();
  });
});

describe("User interacts with the view / edit form modal", () => {
  test("User clicks view / edit button", async () => {
    render(<Integrations />);
    const firstRowInTable = await screen.findByTestId("a integration");
    const viewEditButton = await within(firstRowInTable).findByTestId(
      "view-edit"
    );
    expect(viewEditButton).toBeInTheDocument();
    await userEvent.click(viewEditButton);

    const form = await screen.findByTestId("form");
    expect(form).toBeVisible();

    const formIntegrationName = await within(form).findByTestId(
      "a integration"
    );
    expect(formIntegrationName).toBeInTheDocument();
  });

  test("User views form", async () => {
    render(<Integrations />);
    const firstRowInTable = await screen.findByTestId("a integration");
    const viewEditButton = await within(firstRowInTable).findByTestId(
      "view-edit"
    );
    expect(viewEditButton).toBeInTheDocument();
    await userEvent.click(viewEditButton);

    const form = await screen.findByTestId("form");
    expect(form).toBeVisible();

    const formIntegrationName = await within(form).findByDisplayValue(
      "a integration"
    );
    // asserts that the form fields are disabled which means we are in read only mode.
    expect(formIntegrationName.getAttribute("disabled")).not.toBeNull();
  });

  test("User edits form", async () => {
    render(<Integrations />);
    const firstRowInTable = await screen.findByTestId("a integration");
    const viewEditButton = await within(firstRowInTable).findByTestId(
      "view-edit"
    );
    expect(viewEditButton).toBeInTheDocument();
    await userEvent.click(viewEditButton);

    const form = await screen.findByTestId("form");
    expect(form).toBeVisible();

    const formIntegrationName = await within(form).findByDisplayValue(
      "a integration"
    );

    const editToggle = await within(form).findByTestId("edit-toggle");
    expect(editToggle).toBeVisible();
    await userEvent.click(editToggle);

    //asserts that the form fields are not disabled meaning we are in edit
    expect(formIntegrationName.getAttribute("disabled")).toBeNull();

    fireEvent.change(formIntegrationName, {
      target: { value: "z integration" },
    });

    await userEvent.click(form);
    const submitButton = await screen.findByTestId("submit-button");
    await userEvent.click(submitButton);

    await waitForElementToBeRemoved(() => screen.queryByTestId("form"));
    expect(form).not.toBeVisible();
  });

  test("User views updated record", async () => {
    render(<Integrations />);
    const updatedRowInTable = await screen.findByTestId("z integration");
    const updatedViewEditButton = await within(updatedRowInTable).findByTestId(
      "view-edit"
    );

    expect(updatedViewEditButton).toBeInTheDocument();
    await userEvent.click(updatedViewEditButton);

    const updatedForm = await screen.findByTestId("form");
    expect(updatedForm).toBeVisible();

    const updatedFormIntegrationName = await within(
      updatedForm
    ).findByDisplayValue("z integration");

    // asserts that the form fields are disabled which means we are in read only mode.
    expect(updatedFormIntegrationName.getAttribute("disabled")).not.toBeNull();
  });
});

describe("User adds a integration", () => {
  test("User adds a integration via modal", async () => {
    render(<Integrations />);
    const addintegrationButton = await screen.findByTestId("add-integration");
    expect(addintegrationButton).toBeInTheDocument();

    // Silence act() error when relationships load
    await waitFor(async () => {
      await userEvent.click(addintegrationButton);
    });

    const addIntegrationForm = await screen.findByTestId("form");
    expect(addIntegrationForm).toBeVisible();

    const newIntegrationFormFirstName = (await within(
      addIntegrationForm
    ).findByLabelText("name")) as HTMLInputElement;

    fireEvent.change(newIntegrationFormFirstName, {
      target: { value: "y integration" },
    });
    expect(newIntegrationFormFirstName.value).toBe("y integration");
  });
});

export {};
