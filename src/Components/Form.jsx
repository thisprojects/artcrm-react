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

const hasEmailProperty = ["Contact", "Organisation"];
const hasAgeProperty = ["Contact"];
const hasDateProperty = ["Event"];

export default function Form({
  editMode,
  itemData,
  updateItem,
  itemTitle,
  updateEditMode,
  contactAndTagData,
  buttonLabel,
  emailExists,
}) {
  const [formPayload, updateFormPayload] = useState({ id: itemData?.id });
  const [formErrors, setFormErrors] = useState({
    age: false,
    email: false,
    eventDate: false,
  });
  const hasEmail = hasEmailProperty.includes(itemTitle);
  const hasAge = hasAgeProperty.includes(itemTitle);
  const shouldHaveDate = hasDateProperty.includes(itemTitle);

  const Errors = (formPayload) => {
    let ageError = false;
    let emailError = false;
    let dateError = false;

    if (
      hasAge &&
      (formPayload?.age?.length === 0 || isNaN(Number(formPayload?.age)))
    ) {
      ageError = true;
      setFormErrors((state) => ({ ...state, age: ageError }));
    } else {
      setFormErrors((state) => ({ ...state, age: ageError }));
    }

    if (hasEmail && (!formPayload?.email || emailExists(formPayload?.email))) {
      emailError = true;
      setFormErrors((state) => ({ ...state, email: emailError }));
    } else {
      setFormErrors((state) => ({ ...state, email: emailError }));
    }

    if (shouldHaveDate && !formPayload?.eventDate) {
      dateError = true;
      setFormErrors((state) => ({ ...state, eventDate: dateError }));
    } else {
      setFormErrors((state) => ({ ...state, eventDate: dateError }));
    }

    return ageError || emailError || dateError;
  };

  const handleChange = (e, type, name) => {
    const stagedPayload = formPayload;

    const setRelationships = () => {
      if (stagedPayload[name]) {
        if (!stagedPayload[name].find((item) => item.id === e.id)) {
          stagedPayload[name].push({ id: e.id });
        }
      } else {
        stagedPayload[name] = [{ id: e.id }];
      }
    };

    if (type === "relationship") {
      setRelationships();
    } else if (type === "date") {
      stagedPayload.eventDate = e;
    } else {
      stagedPayload[e.target?.name] = e.target.value;
    }
    if (!Errors(stagedPayload)) {
      updateFormPayload(stagedPayload);
    }
  };

  const handleUpdate = () => {
    if (!Errors(formPayload)) {
      updateItem(formPayload);
    }
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
                      handleChange={handleChange}
                      editMode={editMode}
                      currDate={itemData[item]}
                    />
                    {formErrors.eventDate && (
                      <p style={{ paddingLeft: "10px", color: "red" }}>
                        Event Date Required
                      </p>
                    )}
                  </>
                );
              } else {
                return (
                  <TextField
                    name={item}
                    error={formErrors[item]}
                    disabled={!editMode}
                    onChange={handleChange}
                    id="outlined-required"
                    label={item}
                    defaultValue={itemData[item] || null}
                    helperText={
                      formErrors[item] &&
                      (item === "age"
                        ? "Age must be a number"
                        : "Unique Email Required")
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
              handleChange={handleChange}
            />
          </>
        ) : (
          <div>Loading</div>
        )}
      </div>
      <Button
        variant="contained"
        disabled={!editMode}
        sx={{ margin: "8px" }}
        onClick={handleUpdate}
      >
        {buttonLabel} {itemTitle}
      </Button>
    </Box>
  );
}
