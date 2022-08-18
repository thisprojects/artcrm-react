// Component from material.ui library.
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "../Components/Select";
import MultipleSelect from "./MultiSelect";
import Grid from "@mui/material/Grid";
import ToggleSwitch from "./ToggleSwitch";
import { useState } from "react";

const RelationshipList = ({
  itemData,
  itemTitle,
  editMode,
  relationshipData,
  handleChange,
}) => {
  console.log("itemData", itemData);
  return (
    <Box sx={{ display: "flex" }}>
      {Object.keys(itemData).map((item) => {
        const relations = relationshipData[item.replace("s", "")];
        const items = itemData[item];
        let removedDuplicates = [];

        if (Array.isArray(items) && Array.isArray(relations)) {
          removedDuplicates = relations.filter(
            (filterItem) =>
              !items.find((findItem) => findItem.id == filterItem.id)
          );
        }

        if (Array.isArray(itemData[item]) && item !== itemTitle.toLowerCase()) {
          return (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {editMode ? (
                <MultipleSelect
                  label={item}
                  data={removedDuplicates}
                  handleChange={handleChange}
                />
              ) : (
                <Select
                  label={item}
                  data={itemData[item]}
                  handleChange={handleChange}
                />
              )}
            </Box>
          );
        } else {
          return null;
        }
      })}
    </Box>
  );
};

export default function Form({
  editMode,
  itemData,
  updateItem,
  itemTitle,
  updateEditMode,
  relationshipData,
  buttonLabel,
}) {
  const [formPayload, updateFormPayload] = useState({ id: itemData?.id });

  console.log("FormPayload", formPayload);
  const handleChange = (e, type, name) => {
    if (type === "relationship") {
      const stagedPayload = formPayload;
      if (stagedPayload[name]) {
        stagedPayload[name].push({ id: e.id });
      } else {
        stagedPayload[name] = [{ id: e.id }];
      }
      updateFormPayload(stagedPayload);
    } else {
      const stagedPayload = formPayload;
      stagedPayload[e.target.name] = e.target.value;
      updateFormPayload(stagedPayload);
    }
  };

  const handleUpdate = () => {
    console.log("FORM PL", formPayload);
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
      <div>
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
              } else {
                return (
                  <TextField
                    name={item}
                    disabled={!editMode}
                    onChange={handleChange}
                    id="outlined-required"
                    label={item}
                    defaultValue={itemData[item] || null}
                  />
                );
              }
            })}
            <RelationshipList
              itemData={itemData}
              editMode={editMode}
              itemTitle={itemTitle}
              relationshipData={relationshipData}
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
