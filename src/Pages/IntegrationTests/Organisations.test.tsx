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
import {
  organisations,
  singleOrganisation,
} from "../../API-Mocks/organisations";
import Organisations from "../Organisations";

const server = serverFactory({
  collection: organisations,
  single: singleOrganisation,
  section: "organisation",
});

beforeAll(() => server.listen());
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());
// clean up once the tests are done
afterAll(() => server.close());

describe("User interacts with events table", () => {
  test("Loads Event Table", async () => {
    render(<Organisations />);
    const formOrgName = await screen.findByText("Org 1");
    const formOrgEmail = await screen.findByText("org1@hello.com");
    const formOrgPostCode = await screen.findByText("EEE1");

    expect(formOrgName).toBeInTheDocument();
    expect(formOrgEmail).toBeInTheDocument();
    expect(formOrgPostCode).toBeInTheDocument();
  });

  test("User Selects 1 Item From Table", async () => {
    render(<Organisations />);
    await userEvent.click(await screen.findByText("Org 1"));
    const selected = await screen.findByText("1 selected");

    expect(selected).toBeInTheDocument();
  });

  test("User Selects 2 Items From Table", async () => {
    render(<Organisations />);
    await userEvent.click(await screen.findByText("Org 1"));
    await userEvent.click(await screen.findByText("Org 2"));
    const selected = await screen.findByText("2 selected");

    expect(selected).toBeInTheDocument();
  });

  test("Delete a User From Table", async () => {
    render(<Organisations />);
    const user = await screen.findByText("Org 4");
    await userEvent.click(user);
    const deleteButton = await screen.findByTestId("delete-button");
    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);
    expect(deleteButton).not.toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByText("Org 4"));
    const deletedUser = screen.queryByText("Org 4");
    expect(deletedUser).not.toBeInTheDocument();
  });
});

describe("User interacts with the view / edit form modal", () => {
  test("User clicks view / edit button", async () => {
    render(<Organisations />);
    const firstRowInTable = await screen.findByTestId("Org 1");
    const viewEditButton = await within(firstRowInTable).findByTestId(
      "view-edit"
    );
    expect(viewEditButton).toBeInTheDocument();
    await userEvent.click(viewEditButton);

    const form = await screen.findByTestId("form");
    expect(form).toBeVisible();

    const formOrgName = await screen.findByText("Org 1");
    const formPostCode = await screen.findByText("EEE1");
    const formOrgEmail = await screen.findByText("org1@hello.com");

    expect(formOrgName).toBeInTheDocument();
    expect(formOrgEmail).toBeInTheDocument();
    expect(formPostCode).toBeInTheDocument();
  });

  test("User views form", async () => {
    render(<Organisations />);
    const firstRowInTable = await screen.findByTestId("Org 1");
    const viewEditButton = await within(firstRowInTable).findByTestId(
      "view-edit"
    );
    expect(viewEditButton).toBeInTheDocument();
    await userEvent.click(viewEditButton);

    const form = await screen.findByTestId("form");
    expect(form).toBeVisible();

    const formOrgName = await screen.findByDisplayValue("Org 1");
    const formPostCode = await screen.findByDisplayValue("EEE1");
    const formOrgEmail = await screen.findByDisplayValue("org1@hello.com");

    // asserts that the form fields are disabled which means we are in read only mode.
    expect(formOrgName.getAttribute("disabled")).not.toBeNull();
    expect(formPostCode.getAttribute("disabled")).not.toBeNull();
    expect(formOrgEmail.getAttribute("disabled")).not.toBeNull();
  });

  test("User edits form", async () => {
    render(<Organisations />);
    const firstRowInTable = await screen.findByTestId("Org 1");
    const viewEditButton = await within(firstRowInTable).findByTestId(
      "view-edit"
    );
    expect(viewEditButton).toBeInTheDocument();
    await userEvent.click(viewEditButton);

    const form = await screen.findByTestId("form");
    expect(form).toBeVisible();

    const formOrgName = await screen.findByDisplayValue("Org 1");
    const formPostCode = await screen.findByDisplayValue("EEE1");
    const formOrgEmail = await screen.findByDisplayValue("org1@hello.com");

    const editToggle = await within(form).findByTestId("edit-toggle");
    expect(editToggle).toBeVisible();
    await userEvent.click(editToggle);

    //asserts that the form fields are not disabled meaning we are in edit
    expect(formOrgName.getAttribute("disabled")).toBeNull();
    expect(formPostCode.getAttribute("disabled")).toBeNull();
    expect(formOrgEmail.getAttribute("disabled")).toBeNull();

    fireEvent.change(formOrgName, { target: { value: "Org 11" } });
    fireEvent.change(formPostCode, { target: { value: "EEE11" } });
    fireEvent.change(formOrgEmail, {
      target: {
        value: "org11@hello.com",
      },
    });

    await userEvent.click(form);
    const submitButton = await screen.findByTestId("submit-button");
    await userEvent.click(submitButton);

    await waitForElementToBeRemoved(() => screen.queryByTestId("form"));
    expect(form).not.toBeVisible();
  });

  test("User views updated record", async () => {
    render(<Organisations />);
    const updatedRowInTable = await screen.findByTestId("Org 11");
    const updatedViewEditButton = await within(updatedRowInTable).findByTestId(
      "view-edit"
    );

    expect(updatedViewEditButton).toBeInTheDocument();
    await userEvent.click(updatedViewEditButton);

    const updatedForm = await screen.findByTestId("form");
    expect(updatedForm).toBeVisible();

    const updatedFormOrgName = await within(updatedForm).findByDisplayValue(
      "Org 11"
    );
    const updatedFormPostCode = await within(updatedForm).findByDisplayValue(
      "EEE11"
    );
    const updatedFormOrgEmail = await within(updatedForm).findByDisplayValue(
      "org11@hello.com"
    );

    // asserts that the form fields are disabled which means we are in read only mode.
    expect(updatedFormOrgName.getAttribute("disabled")).not.toBeNull();
    expect(updatedFormPostCode.getAttribute("disabled")).not.toBeNull();
    expect(updatedFormOrgEmail.getAttribute("disabled")).not.toBeNull();
  });
});

describe("User adds an event", () => {
  test("User adds an event via modal", async () => {
    render(<Organisations />);
    const addEventButton = await screen.findByTestId("add-organisation");
    expect(addEventButton).toBeInTheDocument();

    // Silence act() error when relationships load
    await waitFor(async () => {
      await userEvent.click(addEventButton);
    });

    const addOrgForm = await screen.findByTestId("form");
    expect(addOrgForm).toBeVisible();

    const newOrgFormName = (await within(addOrgForm).findByLabelText(
      "name"
    )) as HTMLInputElement;

    const newOrgFormEmail = (await within(addOrgForm).findByLabelText(
      "email"
    )) as HTMLInputElement;

    const newOrgFormPostCode = (await within(addOrgForm).findByLabelText(
      "postCode"
    )) as HTMLInputElement;

    fireEvent.change(newOrgFormName, { target: { value: "Org" } });
    expect(newOrgFormName.value).toBe("Org");

    fireEvent.change(newOrgFormEmail, { target: { value: "org@org.com" } });
    expect(newOrgFormEmail.value).toBe("org@org.com");

    fireEvent.change(newOrgFormPostCode, {
      target: { value: "EEEF1" },
    });
    expect(newOrgFormPostCode.value).toBe("EEEF1");
  });
});

export {};
