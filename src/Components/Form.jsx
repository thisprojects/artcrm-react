// Component from material.ui library.
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "../Components/Select";
import { useState } from "react";

const RelationshipList = ({
  itemData,
  editMode,
  itemTitle,
  relationshipData,
  handleChange,
}) => {
  const flexType = editMode ? "row" : "column";
  const relationshipsToUpdate = Object.keys(relationshipData);
  const allowUpdate = (item) =>
    relationshipsToUpdate.includes(item.replace("s", ""));

  return (
    <Box sx={{ display: "flex", flexDirection: flexType }}>
      {Object.keys(itemData).map((item) => {
        if (Array.isArray(itemData[item]) && item !== itemTitle.toLowerCase()) {
          return (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {(editMode && allowUpdate(item) && (
                <Select
                  label={item}
                  data={relationshipData[item.replace("s", "")]}
                  handleChange={handleChange}
                />
              )) ||
                (!editMode && (
                  <>
                    <p>{item}</p>
                    <ul>
                      {itemData[item].length > 0 &&
                        itemData[item].map((item) => (
                          <li data-org-id={itemData.id}>{item.name}</li>
                        ))}
                    </ul>
                  </>
                ))}
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
        <p>ID: {itemData?.id || null}</p>
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
