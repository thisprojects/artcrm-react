// Component from material.ui library.
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormSelectors from "./FormSelectors";
import Grid from "@mui/material/Grid";
import ToggleSwitch from "./ToggleSwitch";
import DatePicker from "./DatePicker";
import { useState } from "react";

export default function Form({
  editMode,
  itemData,
  updateItem,
  itemTitle,
  updateEditMode,
  contactAndTagData,
  buttonLabel,
  uniqueItemAlreadyExists,
}) {
  const [formPayload, updateFormPayload] = useState({ id: itemData?.id });
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
      return formPayload[item];
    });

  const errors =
    formErrors.age.status ||
    formErrors.email.status ||
    formErrors.eventDate.status ||
    formErrors.name.status;

  const handleChange = {
    default(e) {
      updateFormPayload((state) => ({
        ...state,
        [e.target?.name]: e.target.value,
      }));
    },
    date(e) {
      updateFormPayload((state) => ({ ...state, eventDate: e }));
    },
    email(e) {
      if (uniqueItemAlreadyExists(e.target?.value)) {
        setFormErrors((state) => ({
          ...state,
          email: { ...state.email, status: true },
        }));
      } else {
        setFormErrors((state) => ({
          ...state,
          email: { ...state.email, status: false },
        }));
        updateFormPayload((state) => ({
          ...state,
          email: e.target.value,
        }));
      }
    },
    name(e) {
      if (itemTitle !== "Tag" && itemTitle !== "Integration") {
        updateFormPayload((state) => ({
          ...state,
          [e.target?.name]: e.target.value,
        }));
        return;
      }
      if (uniqueItemAlreadyExists(e.target?.value)) {
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
          name: e.target.value,
        }));
      }
    },
    age(e) {
      if (isNaN(Number(e.target.value))) {
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
          age: e.target.value,
        }));
      }
    },
    relationship(e, name) {
      if (formPayload[name]) {
        if (!formPayload[name].find((item) => item.id === e.id)) {
          updateFormPayload((state) => ({
            ...state,
            [name]: [...state[name], { id: e.id }],
          }));
        }
      } else {
        updateFormPayload((state) => ({
          ...state,
          [name]: [{ id: e.id }],
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
            <p>ID: {itemData?.id || null}</p>
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
              if (item === "id" || Array.isArray(itemData[item])) {
                return null;
              } else if (item === "eventDate") {
                return (
                  <>
                    <DatePicker
                      handleChange={handleChange.date}
                      editMode={editMode}
                      currDate={itemData[item]}
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
                    error={formErrors[item]?.status}
                    disabled={!editMode}
                    onChange={handleChange[item] || handleChange.default}
                    id="outlined-required"
                    label={item}
                    defaultValue={itemData[item] || null}
                    helperText={
                      formErrors[item]?.status && formErrors[item]?.msg
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
}
