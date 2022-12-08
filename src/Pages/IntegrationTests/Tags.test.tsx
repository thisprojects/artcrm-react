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
import { tags, singleTag } from "../../API-Mocks/tags";
import Tags from "../Tags";

const server = serverFactory({
  collection: tags,
  single: singleTag,
  section: "tag",
});

beforeAll(() => server.listen());
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());
// clean up once the tests are done
afterAll(() => server.close());

describe("User interacts with tagss table", () => {
  test("Loads Tags Table", async () => {
    render(<Tags />);
    const formName = await screen.findByText("a tag");
    expect(formName).toBeInTheDocument();
  });

  test("User Selects 1 Item From Table", async () => {
    render(<Tags />);
    await userEvent.click(await screen.findByText("a tag"));
    const selected = await screen.findByText("1 selected");

    expect(selected).toBeInTheDocument();
  });

  test("User Selects 2 Items From Table", async () => {
    render(<Tags />);
    await userEvent.click(await screen.findByText("a tag"));
    await userEvent.click(await screen.findByText("b tag"));
    const selected = await screen.findByText("2 selected");

    expect(selected).toBeInTheDocument();
  });

  test("Delete a tag From Table", async () => {
    render(<Tags />);
    const tag = await screen.findByText("d tag");
    await userEvent.click(tag);
    const deleteButton = await screen.findByTestId("delete-button");
    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);
    expect(deleteButton).not.toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByText("d tag"));
    const deletedUser = screen.queryByText("d tag");
    expect(deletedUser).not.toBeInTheDocument();
  });
});

describe("User interacts with the view / edit form modal", () => {
  test("User clicks view / edit button", async () => {
    render(<Tags />);
    const firstRowInTable = await screen.findByTestId("a tag");
    const viewEditButton = await within(firstRowInTable).findByTestId(
      "view-edit"
    );
    expect(viewEditButton).toBeInTheDocument();
    await userEvent.click(viewEditButton);

    const form = await screen.findByTestId("form");
    expect(form).toBeVisible();

    const formTagName = await within(form).findByTestId("a tag");
    expect(formTagName).toBeInTheDocument();
  });

  test("User views form", async () => {
    render(<Tags />);
    const firstRowInTable = await screen.findByTestId("a tag");
    const viewEditButton = await within(firstRowInTable).findByTestId(
      "view-edit"
    );
    expect(viewEditButton).toBeInTheDocument();
    await userEvent.click(viewEditButton);

    const form = await screen.findByTestId("form");
    expect(form).toBeVisible();

    const formTagName = await within(form).findByDisplayValue("a tag");

    // asserts that the form fields are disabled which means we are in read only mode.
    expect(formTagName.getAttribute("disabled")).not.toBeNull();
  });

  test("User edits form", async () => {
    render(<Tags />);
    const firstRowInTable = await screen.findByTestId("a tag");
    const viewEditButton = await within(firstRowInTable).findByTestId(
      "view-edit"
    );
    expect(viewEditButton).toBeInTheDocument();
    await userEvent.click(viewEditButton);

    const form = await screen.findByTestId("form");
    expect(form).toBeVisible();

    const formTagName = await within(form).findByDisplayValue("a tag");

    const editToggle = await within(form).findByTestId("edit-toggle");
    expect(editToggle).toBeVisible();
    await userEvent.click(editToggle);

    //asserts that the form fields are not disabled meaning we are in edit
    expect(formTagName.getAttribute("disabled")).toBeNull();

    fireEvent.change(formTagName, { target: { value: "z tag" } });

    await userEvent.click(form);
    const submitButton = await screen.findByTestId("submit-button");
    await userEvent.click(submitButton);

    await waitForElementToBeRemoved(() => screen.queryByTestId("form"));
    expect(form).not.toBeVisible();
  });

  test("User views updated record", async () => {
    render(<Tags />);
    const updatedRowInTable = await screen.findByTestId("z tag");
    const updatedViewEditButton = await within(updatedRowInTable).findByTestId(
      "view-edit"
    );

    expect(updatedViewEditButton).toBeInTheDocument();
    await userEvent.click(updatedViewEditButton);

    const updatedForm = await screen.findByTestId("form");
    expect(updatedForm).toBeVisible();

    const updatedFormTagName = await within(updatedForm).findByDisplayValue(
      "z tag"
    );

    // asserts that the form fields are disabled which means we are in read only mode.
    expect(updatedFormTagName.getAttribute("disabled")).not.toBeNull();
  });
});

describe("User adds a tags", () => {
  test("User adds a tags via modal", async () => {
    render(<Tags />);
    const addUserButton = await screen.findByTestId("add-tag");
    expect(addUserButton).toBeInTheDocument();

    // Silence act() error when relationships load
    await waitFor(async () => {
      await userEvent.click(addUserButton);
    });

    const addTagsForm = await screen.findByTestId("form");
    expect(addTagsForm).toBeVisible();

    const newTagsFormFirstName = (await within(addTagsForm).findByLabelText(
      "name"
    )) as HTMLInputElement;

    fireEvent.change(newTagsFormFirstName, { target: { value: "y-tag" } });
    expect(newTagsFormFirstName.value).toBe("y-tag");
  });
});

export {};
