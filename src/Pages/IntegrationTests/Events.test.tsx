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
import { events, singleEvent } from "../../API-Mocks/events";
import Events from "../Events";

const server = serverFactory({
  collection: events,
  single: singleEvent,
  section: "event",
});

beforeAll(() => {
  server.listen();
});
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());
// clean up once the tests are done
afterAll(() => server.close());

describe("User interacts with events table", () => {
  test("Loads Event Table", async () => {
    render(<Events />);
    const formEventName = await screen.findByText("Event 1");
    const formVenueName = await screen.findByText("The Venue 1");
    const formPostCode = await screen.findByText("ABC1");
    const formEventDate = await screen.findByText(
      "Mon Dec 07 2022 11:58:17 GMT+0000 (Greenwich Mean Time)"
    );

    expect(formEventName).toBeInTheDocument();
    expect(formVenueName).toBeInTheDocument();
    expect(formPostCode).toBeInTheDocument();
    expect(formEventDate).toBeInTheDocument();
  });

  test("User Selects 1 Item From Table", async () => {
    render(<Events />);
    await userEvent.click(await screen.findByText("Event 1"));
    const selected = await screen.findByText("1 selected");

    expect(selected).toBeInTheDocument();
  });

  test("User Selects 2 Items From Table", async () => {
    render(<Events />);
    await userEvent.click(await screen.findByText("Event 1"));
    await userEvent.click(await screen.findByText("Event 2"));
    const selected = await screen.findByText("2 selected");

    expect(selected).toBeInTheDocument();
  });

  test("Delete a User From Table", async () => {
    render(<Events />);
    const user = await screen.findByText("Event 4");
    await userEvent.click(user);
    const deleteButton = await screen.findByTestId("delete-button");
    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);
    expect(deleteButton).not.toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByText("Event 4"));
    const deletedUser = screen.queryByText("Event 4");
    expect(deletedUser).not.toBeInTheDocument();
  });
});

describe("User interacts with the view / edit form modal", () => {
  test("User clicks view / edit button", async () => {
    render(<Events />);
    const firstRowInTable = await screen.findByTestId("Event 1");
    const viewEditButton = await within(firstRowInTable).findByTestId(
      "view-edit"
    );
    expect(viewEditButton).toBeInTheDocument();
    await userEvent.click(viewEditButton);

    const form = await screen.findByTestId("form");
    expect(form).toBeVisible();

    const formEventName = await screen.findByText("Event 1");
    const formVenueName = await screen.findByText("The Venue 1");
    const formPostCode = await screen.findByText("ABC1");
    const formEventDate = await screen.findByText(
      "Mon Dec 07 2022 11:58:17 GMT+0000 (Greenwich Mean Time)"
    );

    expect(formEventName).toBeInTheDocument();
    expect(formVenueName).toBeInTheDocument();
    expect(formPostCode).toBeInTheDocument();
    expect(formEventDate).toBeInTheDocument();
  });

  test("User views form", async () => {
    render(<Events />);
    const firstRowInTable = await screen.findByTestId("Event 1");
    const viewEditButton = await within(firstRowInTable).findByTestId(
      "view-edit"
    );
    expect(viewEditButton).toBeInTheDocument();
    await userEvent.click(viewEditButton);

    const form = await screen.findByTestId("form");
    expect(form).toBeVisible();

    const formEventName = await screen.findByDisplayValue("Event 1");
    const formVenueName = await screen.findByDisplayValue("The Venue 1");
    const formPostCode = await screen.findByDisplayValue("ABC1");
    const formEventDate = await screen.findByDisplayValue("12/07/2022");

    // asserts that the form fields are disabled which means we are in read only mode.
    expect(formEventName.getAttribute("disabled")).not.toBeNull();
    expect(formVenueName.getAttribute("disabled")).not.toBeNull();
    expect(formPostCode.getAttribute("disabled")).not.toBeNull();
    expect(formEventDate.getAttribute("disabled")).not.toBeNull();
  });

  test("User edits form", async () => {
    render(<Events />);
    const firstRowInTable = await screen.findByTestId("Event 1");
    const viewEditButton = await within(firstRowInTable).findByTestId(
      "view-edit"
    );
    expect(viewEditButton).toBeInTheDocument();
    await userEvent.click(viewEditButton);

    const form = await screen.findByTestId("form");
    expect(form).toBeVisible();

    const formEventName = await screen.findByDisplayValue("Event 1");
    const formVenueName = await screen.findByDisplayValue("The Venue 1");
    const formPostCode = await screen.findByDisplayValue("ABC1");
    const formEventDate = await screen.findByDisplayValue("12/07/2022");

    const editToggle = await within(form).findByTestId("edit-toggle");
    expect(editToggle).toBeVisible();
    await userEvent.click(editToggle);

    //asserts that the form fields are not disabled meaning we are in edit
    expect(formEventName.getAttribute("disabled")).toBeNull();
    expect(formVenueName.getAttribute("disabled")).toBeNull();
    expect(formPostCode.getAttribute("disabled")).toBeNull();
    expect(formEventDate.getAttribute("disabled")).toBeNull();

    fireEvent.change(formEventName, { target: { value: "Event 11" } });
    fireEvent.change(formVenueName, { target: { value: "The Venue 11" } });
    fireEvent.change(formEventDate, {
      target: {
        value: "Mon Dec 11 2022 11:58:17 GMT+0000 (Greenwich Mean Time)",
      },
    });
    fireEvent.change(formPostCode, { target: { value: "CV11" } });

    await userEvent.click(form);
    const submitButton = await screen.findByTestId("submit-button");
    await userEvent.click(submitButton);

    await waitForElementToBeRemoved(() => screen.queryByTestId("form"));
    expect(form).not.toBeVisible();
  });

  test("User views updated record", async () => {
    render(<Events />);
    const updatedRowInTable = await screen.findByTestId("Event 11");
    const updatedViewEditButton = await within(updatedRowInTable).findByTestId(
      "view-edit"
    );

    expect(updatedViewEditButton).toBeInTheDocument();
    await userEvent.click(updatedViewEditButton);

    const updatedForm = await screen.findByTestId("form");
    expect(updatedForm).toBeVisible();

    const updatedFormEventName = await within(updatedForm).findByDisplayValue(
      "Event 11"
    );
    const updatedFormVenueName = await within(updatedForm).findByDisplayValue(
      "The Venue 11"
    );
    const updatedFormPostCode = await within(updatedForm).findByDisplayValue(
      "CV11"
    );
    const updatedFormEventDate = await within(updatedForm).findByDisplayValue(
      "11/20/2211"
    );

    // asserts that the form fields are disabled which means we are in read only mode.
    expect(updatedFormEventName.getAttribute("disabled")).not.toBeNull();
    expect(updatedFormVenueName.getAttribute("disabled")).not.toBeNull();
    expect(updatedFormPostCode.getAttribute("disabled")).not.toBeNull();
    expect(updatedFormEventDate.getAttribute("disabled")).not.toBeNull();
  });
});

describe("User adds an event", () => {
  test("User adds an event via modal", async () => {
    render(<Events />);
    const addEventButton = await screen.findByTestId("add-event");
    expect(addEventButton).toBeInTheDocument();

    // Silence act() error when relationships load
    await waitFor(async () => {
      await userEvent.click(addEventButton);
    });

    const addEventForm = await screen.findByTestId("form");
    expect(addEventForm).toBeVisible();

    const newEventFormEventName = (await within(addEventForm).findByLabelText(
      "name"
    )) as HTMLInputElement;

    const newEventFormVenueName = (await within(addEventForm).findByLabelText(
      "venueName"
    )) as HTMLInputElement;

    const newEventFormPostCode = (await within(addEventForm).findByLabelText(
      "postCode"
    )) as HTMLInputElement;

    const newEventFormEventDate = (await within(addEventForm).findByLabelText(
      "Event Date"
    )) as HTMLInputElement;

    fireEvent.change(newEventFormEventName, { target: { value: "Event" } });
    expect(newEventFormVenueName.value).toBe("Event");

    fireEvent.change(newEventFormEventDate, { target: { value: "11/11/11" } });
    expect(newEventFormEventDate.value).toBe("11/11/11");

    fireEvent.change(newEventFormVenueName, {
      target: { value: "Venue Name" },
    });
    expect(newEventFormVenueName.value).toBe("Venue Name");

    fireEvent.change(newEventFormPostCode, { target: { value: "bev 19p" } });
    expect(newEventFormPostCode.value).toBe("bev 19p");
  });
});

export {};
