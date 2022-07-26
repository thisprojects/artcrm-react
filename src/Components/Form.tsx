// Component from material.ui library.
import * as React from "react";
import { Dispatch, SetStateAction } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormSelectors from "./FormSelectors";
import Grid from "@mui/material/Grid";
import ToggleSwitch from "./ToggleSwitch";
import DatePicker from "./DatePicker";
import { useState } from "react";
import CRMDataModel from "../Models/CRMDataModel";
import Relationships from "../Models/Relationships";

interface IForm {
  editMode: boolean;
  itemData: CRMDataModel;
  updateItem: (formData: CRMDataModel) => void;
  itemTitle: string;
  updateEditMode: Dispatch<SetStateAction<boolean>>;
  contactAndTagData: Relationships | [];
  buttonLabel: string;
  uniqueItemAlreadyExists: (event: string) => CRMDataModel | undefined;
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
  date: (e: React.ChangeEvent<HTMLInputElement>) => void;
  email: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: (e: React.ChangeEvent<HTMLInputElement>) => void;
  age: (e: React.ChangeEvent<HTMLInputElement>) => void;
  relationship: (
    selectedObject: CRMDataModel | undefined,
    label: string
  ) => void;
}

const Form: React.FC<IForm> = ({
  editMode,
  itemData,
  updateItem,
  itemTitle,
  updateEditMode,
  contactAndTagData,
  buttonLabel,
  uniqueItemAlreadyExists,
}) => {
  const [formPayload, updateFormPayload] = useState<CRMDataModel>({
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
      return formPayload[item as keyof CRMDataModel];
    });

  const errors =
    formErrors.age.status ||
    formErrors.email.status ||
    formErrors.eventDate.status ||
    formErrors.name.status;

  // Handle form errors and format payload for network request.
  const handleChange: HandleChange = {
    default(e: React.ChangeEvent<HTMLInputElement>) {
      const target = e.target as HTMLButtonElement;
      updateFormPayload((state) => ({
        ...state,
        [target?.name]: target?.value,
      }));
    },

    date(e: React.ChangeEvent<HTMLInputElement>) {
      updateFormPayload((state) => ({
        ...state,
        eventDate: e as unknown as string,
      }));
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
      if (formPayload[name as keyof CRMDataModel]) {
        if (
          !(
            formPayload[name as keyof CRMDataModel] as Array<CRMDataModel>
          )?.find((item) => item.id === e?.id)
        ) {
          updateFormPayload((state) => ({
            ...state,
            [name as string]: [
              ...(state[name as keyof CRMDataModel] as Array<CRMDataModel>),
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
      <div id="form-component" data-testid="form">
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
          </Grid>
        </Grid>
        {itemData ? (
          <>
            {Object.keys(itemData).map((item, index) => {
              if (
                item === "id" ||
                Array.isArray(itemData[item as keyof CRMDataModel])
              ) {
                return null;
              } else if (item === "eventDate") {
                return (
                  <React.Fragment key={item + index}>
                    <DatePicker
                      handleChange={handleChange.date}
                      editMode={editMode}
                      currDate={itemData[item] as unknown as string}
                    />
                    {formErrors.eventDate.status && (
                      <p style={{ paddingLeft: "10px", color: "red" }}>
                        {formErrors.eventDate.msg}
                      </p>
                    )}
                  </React.Fragment>
                );
              } else {
                return (
                  <TextField
                    key={item + index}
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
                    data-testid={itemData[item as keyof CRMDataModel] || null}
                    defaultValue={itemData[item as keyof CRMDataModel] || null}
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
        data-testid="submit-button"
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
