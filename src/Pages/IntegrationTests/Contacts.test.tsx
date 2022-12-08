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
import { contacts, singleContact } from "../../API-Mocks/contacts";
import Contacts from "../Contacts";

const server = serverFactory({
  collection: contacts,
  single: singleContact,
  section: "contact",
});

beforeAll(() => server.listen());
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());
// clean up once the tests are done
afterAll(() => server.close());

describe("User interacts with contacts table", () => {
  test("Loads Contact Table", async () => {
    render(<Contacts />);
    const formFirstName = await screen.findByText("Katie");
    const formLastName = await screen.findByText("Oakley");
    const formPostCode = await screen.findByText("H9");
    const formEmail = await screen.findByText("KatieOakley@hello.com");
    const formAge = await screen.findByText("62");

    expect(formFirstName).toBeInTheDocument();
    expect(formLastName).toBeInTheDocument();
    expect(formPostCode).toBeInTheDocument();
    expect(formEmail).toBeInTheDocument();
    expect(formAge).toBeInTheDocument();
  });

  test("User Selects 1 Item From Table", async () => {
    render(<Contacts />);
    await userEvent.click(await screen.findByText("Katie"));
    const selected = await screen.findByText("1 selected");

    expect(selected).toBeInTheDocument();
  });

  test("User Selects 2 Items From Table", async () => {
    render(<Contacts />);
    await userEvent.click(await screen.findByText("Katie"));
    await userEvent.click(await screen.findByText("George"));
    const selected = await screen.findByText("2 selected");

    expect(selected).toBeInTheDocument();
  });

  test("Delete a User From Table", async () => {
    render(<Contacts />);
    const user = await screen.findByText("Bob");
    await userEvent.click(user);
    const deleteButton = await screen.findByTestId("delete-button");
    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);
    expect(deleteButton).not.toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByText("Bob"));
    const deletedUser = screen.queryByText("Bob");
    expect(deletedUser).not.toBeInTheDocument();
  });
});

describe("User interacts with the view / edit form modal", () => {
  test("User clicks view / edit button", async () => {
    render(<Contacts />);
    const firstRowInTable = await screen.findByTestId("Katie");
    const viewEditButton = await within(firstRowInTable).findByTestId(
      "view-edit"
    );
    expect(viewEditButton).toBeInTheDocument();
    await userEvent.click(viewEditButton);

    const form = await screen.findByTestId("form");
    expect(form).toBeVisible();

    const formFirstName = await within(form).findByTestId("Katie");
    const formLastName = await within(form).findByTestId("Oakley");
    const formPostCode = await within(form).findByTestId("H9");
    const formEmail = await within(form).findByTestId("KatieOakley@hello.com");
    const formAge = await within(form).findByTestId("62");

    expect(formFirstName).toBeInTheDocument();
    expect(formLastName).toBeInTheDocument();
    expect(formPostCode).toBeInTheDocument();
    expect(formEmail).toBeInTheDocument();
    expect(formAge).toBeInTheDocument();
  });

  test("User views form", async () => {
    render(<Contacts />);
    const firstRowInTable = await screen.findByTestId("Katie");
    const viewEditButton = await within(firstRowInTable).findByTestId(
      "view-edit"
    );
    expect(viewEditButton).toBeInTheDocument();
    await userEvent.click(viewEditButton);

    const form = await screen.findByTestId("form");
    expect(form).toBeVisible();

    const formFirstName = await within(form).findByDisplayValue("Katie");
    const formLastName = await within(form).findByDisplayValue("Oakley");
    const formPostCode = await within(form).findByDisplayValue("H9");
    const formEmail = await within(form).findByDisplayValue(
      "KatieOakley@hello.com"
    );
    const formAge = await within(form).findByDisplayValue("62");

    // asserts that the form fields are disabled which means we are in read only mode.
    expect(formFirstName.getAttribute("disabled")).not.toBeNull();
    expect(formLastName.getAttribute("disabled")).not.toBeNull();
    expect(formPostCode.getAttribute("disabled")).not.toBeNull();
    expect(formEmail.getAttribute("disabled")).not.toBeNull();
    expect(formAge.getAttribute("disabled")).not.toBeNull();
  });

  test("User edits form", async () => {
    render(<Contacts />);
    const firstRowInTable = await screen.findByTestId("Katie");
    const viewEditButton = await within(firstRowInTable).findByTestId(
      "view-edit"
    );
    expect(viewEditButton).toBeInTheDocument();
    await userEvent.click(viewEditButton);

    const form = await screen.findByTestId("form");
    expect(form).toBeVisible();

    const formFirstName = await within(form).findByDisplayValue("Katie");
    const formLastName = await within(form).findByDisplayValue("Oakley");
    const formPostCode = await within(form).findByDisplayValue("H9");
    const formEmail = await within(form).findByDisplayValue(
      "KatieOakley@hello.com"
    );
    const formAge = await within(form).findByDisplayValue("62");

    const editToggle = await within(form).findByTestId("edit-toggle");
    expect(editToggle).toBeVisible();
    await userEvent.click(editToggle);

    //asserts that the form fields are not disabled meaning we are in edit
    expect(formFirstName.getAttribute("disabled")).toBeNull();
    expect(formLastName.getAttribute("disabled")).toBeNull();
    expect(formPostCode.getAttribute("disabled")).toBeNull();
    expect(formEmail.getAttribute("disabled")).toBeNull();
    expect(formAge.getAttribute("disabled")).toBeNull();

    fireEvent.change(formFirstName, { target: { value: "bert" } });
    fireEvent.change(formLastName, { target: { value: "smith" } });
    fireEvent.change(formAge, { target: { value: "22" } });
    fireEvent.change(formEmail, { target: { value: "bert@smith.com" } });
    fireEvent.change(formPostCode, { target: { value: "bhv 14x" } });

    await userEvent.click(form);
    const submitButton = await screen.findByTestId("submit-button");
    await userEvent.click(submitButton);

    await waitForElementToBeRemoved(() => screen.queryByTestId("form"));
    expect(form).not.toBeVisible();
  });

  test("User views updated record", async () => {
    render(<Contacts />);
    const updatedRowInTable = await screen.findByTestId("bert");
    const updatedViewEditButton = await within(updatedRowInTable).findByTestId(
      "view-edit"
    );

    expect(updatedViewEditButton).toBeInTheDocument();
    await userEvent.click(updatedViewEditButton);

    const updatedForm = await screen.findByTestId("form");
    expect(updatedForm).toBeVisible();

    const updatedFormFirstName = await within(updatedForm).findByDisplayValue(
      "bert"
    );
    const updatedFormLastName = await within(updatedForm).findByDisplayValue(
      "smith"
    );
    const updatedFormPostCode = await within(updatedForm).findByDisplayValue(
      "bhv 14x"
    );
    const updatedFormEmail = await within(updatedForm).findByDisplayValue(
      "bert@smith.com"
    );
    const updatedFormAge = await within(updatedForm).findByDisplayValue("22");

    // asserts that the form fields are disabled which means we are in read only mode.
    expect(updatedFormFirstName.getAttribute("disabled")).not.toBeNull();
    expect(updatedFormLastName.getAttribute("disabled")).not.toBeNull();
    expect(updatedFormPostCode.getAttribute("disabled")).not.toBeNull();
    expect(updatedFormEmail.getAttribute("disabled")).not.toBeNull();
    expect(updatedFormAge.getAttribute("disabled")).not.toBeNull();
  });
});

describe("User adds a contact", () => {
  test("User adds a contact via modal", async () => {
    render(<Contacts />);
    const addUserButton = await screen.findByTestId("add-contact");
    expect(addUserButton).toBeInTheDocument();

    // Silence act() error when relationships load
    await waitFor(async () => {
      await userEvent.click(addUserButton);
    });

    const addContactForm = await screen.findByTestId("form");
    expect(addContactForm).toBeVisible();

    const newContactFormFirstName = (await within(
      addContactForm
    ).findByLabelText("firstName")) as HTMLInputElement;

    const newContactFormLastName = (await within(
      addContactForm
    ).findByLabelText("lastName")) as HTMLInputElement;

    const newContactFormAge = (await within(addContactForm).findByLabelText(
      "age"
    )) as HTMLInputElement;

    const newContactFormPostCode = (await within(
      addContactForm
    ).findByLabelText("postCode")) as HTMLInputElement;

    const newContactFormEmail = (await within(addContactForm).findByLabelText(
      "email"
    )) as HTMLInputElement;

    fireEvent.change(newContactFormFirstName, { target: { value: "Dave" } });
    expect(newContactFormFirstName.value).toBe("Dave");

    fireEvent.change(newContactFormLastName, { target: { value: "Jones" } });
    expect(newContactFormLastName.value).toBe("Jones");

    fireEvent.change(newContactFormAge, { target: { value: 55 } });
    expect(newContactFormAge.value).toBe("55");

    fireEvent.change(newContactFormEmail, {
      target: { value: "Dave@Jones.com" },
    });
    expect(newContactFormEmail.value).toBe("Dave@Jones.com");

    fireEvent.change(newContactFormPostCode, { target: { value: "bev 19p" } });
    expect(newContactFormPostCode.value).toBe("bev 19p");
  });
});

export {};
