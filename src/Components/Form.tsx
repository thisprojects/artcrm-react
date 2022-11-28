// Component from material.ui library.
import * as React from "react";
import { Dispatch, SetStateAction } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormSelectors, { Collection } from "./FormSelectors";
import Grid from "@mui/material/Grid";
import ToggleSwitch from "./ToggleSwitch";
import DatePicker from "./DatePicker";
import { useState } from "react";
import { FormPayload } from "../Pages/Contacts";
import Contact from "../Models/Contacts";

interface Items {
  age?: number;
  email?: string;
  eventDate?: Date;
  name?: string;
  id: string;
}

export interface ItemData {
  [key: string]: unknown | Items[];
}

interface FormProps {
  editMode: boolean;
  itemData: ItemData;
  updateItem: (formData: FormPayload) => void;
  itemTitle: string;
  updateEditMode: Dispatch<SetStateAction<boolean>>;
  contactAndTagData: object;
  buttonLabel: string;
  uniqueItemAlreadyExists: (event: string) => Contact | undefined;
}

interface FormErrorStatus {
  status: boolean;
  msg: string;
}

interface FormErrors {
  age: FormErrorStatus;
  email: FormErrorStatus;
  eventDate: FormErrorStatus;
  name: FormErrorStatus;
}

interface HandleChange {
  default: (e: React.ChangeEvent<HTMLInputElement>) => void;
  date: (e: React.ChangeEvent<HTMLInputElement> | Date | null) => void;
  email: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: (e: React.ChangeEvent<HTMLInputElement>) => void;
  age: (e: React.ChangeEvent<HTMLInputElement>) => void;
  relationship: (selectedObject: Collection | undefined, label: string) => void;
}

const Form: React.FC<FormProps> = ({
  editMode,
  itemData,
  updateItem,
  itemTitle,
  updateEditMode,
  contactAndTagData,
  buttonLabel,
  uniqueItemAlreadyExists,
}) => {
  const [formPayload, updateFormPayload] = useState<FormPayload>({
    id: itemData?.id as string,
  });

  const [formErrors, setFormErrors] = useState({
    age: { status: false, msg: "Age must be a number" },
    email: { status: false, msg: "Email must be unique" },
    eventDate: { status: false, msg: "Event date required" },
    name: { status: false, msg: "Name must be unique" },
  });

  const formTitleNames = Object.keys(itemData).filter(
    (item) =>
      item !== "tags" &&
      item !== "contacts" &&
      item !== "events" &&
      item !== "organisations"
  );

  const formIsEmpty =
    buttonLabel !== "Update" &&
    !formTitleNames.every((item) => {
      return formPayload[item as keyof FormPayload];
    });

  const errors =
    formErrors.age.status ||
    formErrors.email.status ||
    formErrors.eventDate.status ||
    formErrors.name.status;

  const handleChange: HandleChange = {
    default(e: React.ChangeEvent<HTMLInputElement>) {
      const target = e.target as HTMLButtonElement;
      updateFormPayload((state) => ({
        ...state,
        [target?.name]: target?.value,
      }));
    },
    date(e: Date | null | React.ChangeEvent<HTMLInputElement>) {
      updateFormPayload((state) => ({ ...state, eventDate: e }));
    },
    email(e: React.ChangeEvent<HTMLInputElement>) {
      const target = e?.target as HTMLButtonElement;
      if (uniqueItemAlreadyExists(target?.value)) {
        setFormErrors((state) => ({
          ...state,
          email: { ...state?.email, status: true },
        }));
      } else {
        setFormErrors((state) => ({
          ...state,
          email: { ...state?.email, status: false },
        }));
        updateFormPayload((state) => ({
          ...state,
          email: target?.value,
        }));
      }
    },
    name(e: React.ChangeEvent<HTMLInputElement>) {
      const target = e?.target as HTMLButtonElement;
      if (itemTitle !== "Tag" && itemTitle !== "Integration") {
        updateFormPayload((state) => ({
          ...state,
          [target?.name]: target?.value,
        }));
        return;
      }
      if (uniqueItemAlreadyExists(target?.value)) {
        setFormErrors((state) => ({
          ...state,
          name: { ...state.name, status: true },
        }));
      } else {
        setFormErrors((state) => ({
          ...state,
          name: { ...state.name, status: false },
        }));
        updateFormPayload((state) => ({
          ...state,
          name: target?.value,
        }));
      }
    },
    age(e: React.ChangeEvent<HTMLInputElement>) {
      const target = e?.target as HTMLButtonElement;
      if (isNaN(Number(target?.value))) {
        setFormErrors((state) => ({
          ...state,
          age: { ...state.age, status: true },
        }));
      } else {
        setFormErrors((state) => ({
          ...state,
          age: { ...state.age, status: false },
        }));
        updateFormPayload((state) => ({
          ...state,
          age: target?.value,
        }));
      }
    },
    relationship(e, name) {
      if (formPayload[name as keyof FormPayload]) {
        if (
          !(
            formPayload[name as keyof FormPayload] as unknown as Array<Items>
          )?.find((item) => item.id === e?.id)
        ) {
          updateFormPayload((state) => ({
            ...state,
            [name as string]: [
              ...(state[name as keyof FormPayload] as unknown as Array<Items>),
              { id: e?.id },
            ],
          }));
        }
      } else {
        updateFormPayload((state) => ({
          ...state,
          [name]: [{ id: e?.id }],
        }));
      }
    },
  };

  const handleUpdate = () => {
    updateItem(formPayload);
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <div id="form-component">
        <Grid container spacing={7}>
          <Grid item md={10}>
            <p>ID: {itemData?.id as React.ReactNode}</p>
          </Grid>
          <Grid item md={2}>
            {buttonLabel === "Update" ? (
              <ToggleSwitch
                label="Edit"
                updateEditMode={updateEditMode}
                editMode={editMode}
              />
            ) : null}
            as keyof FormErrors
          </Grid>
        </Grid>
        {itemData ? (
          <>
            {Object.keys(itemData).map((item, index) => {
              if (item === "id" || Array.isArray(itemData[item])) {
                return null;
              } else if (item === "eventDate") {
                return (
                  <>
                    <DatePicker
                      handleChange={handleChange.date}
                      editMode={editMode}
                      currDate={itemData[item] as Date}
                    />
                    {formErrors.eventDate.status && (
                      <p style={{ paddingLeft: "10px", color: "red" }}>
                        {formErrors.eventDate.msg}
                      </p>
                    )}
                  </>
                );
              } else {
                return (
                  <TextField
                    name={item}
                    error={formErrors[item as keyof FormErrors]?.status}
                    disabled={!editMode}
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement>,
                      n?: string
                    ): void => {
                      if (item === "relationship") {
                        return;
                      } else if (item === "date") {
                        handleChange.date(e);
                      } else if (item === "name") {
                        handleChange.name(e);
                      } else if (item === "age") {
                        handleChange.age(e);
                      } else if (item === "email") {
                        handleChange.email(e);
                      } else {
                        handleChange.default(e);
                      }
                    }}
                    id="outlined-required"
                    label={item}
                    defaultValue={itemData[item] || null}
                    helperText={
                      formErrors[item as keyof FormErrors]?.status &&
                      formErrors[item as keyof FormErrors]?.msg
                    }
                  />
                );
              }
            })}
            <FormSelectors
              itemData={itemData}
              editMode={editMode}
              itemTitle={itemTitle}
              contactAndTagData={contactAndTagData}
              handleChange={handleChange.relationship}
            />
          </>
        ) : (
          <div>Loading</div>
        )}
      </div>
      <Button
        variant="contained"
        disabled={!editMode || errors || formIsEmpty}
        sx={{ margin: "8px" }}
        onClick={handleUpdate}
      >
        {buttonLabel} {itemTitle}
      </Button>
      {formIsEmpty && <p className="fill-form">Please fill in the form</p>}
    </Box>
  );
};

export default Form;
