// Component from material.ui library.
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "../Components/Select";
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
  return (
    <Box sx={{ display: "flex" }}>
      {Object.keys(itemData).map((item) => {
        const selectData = editMode
          ? relationshipData[item.replace("s", "")]
          : itemData[item];

        if (Array.isArray(itemData[item]) && item !== itemTitle.toLowerCase()) {
          return (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Select
                label={item}
                data={selectData}
                handleChange={handleChange}
              />
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

  const handleChange = (e, type, name) => {
    if (type === "relationship") {
      const stagedPayload = formPayload;
      stagedPayload[name] = [{ id: e.id }];
      updateFormPayload(stagedPayload);
    } else {
      const stagedPayload = formPayload;
      stagedPayload[e.target.name] = e.target.value;
      updateFormPayload(stagedPayload);
    }
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
