// Component from material.ui library.
import * as React from "react";
import Box from "@mui/material/Box";
import Select from "./Select";
import MultipleSelect from "./MultiSelect";

const personMaker = (collection) => {
  return collection?.map((item) => {
    if (item.firstName) return `${item.firstName} ${item.lastName}`;
    else if (item.name) return item.name;
    else return item;
  });
};

const FormSelectors = ({
  itemData,
  itemTitle,
  editMode,
  contactAndTagData,
  handleChange,
}) => {
  return (
    <Box sx={{ display: "flex" }}>
      {Object.keys(itemData).map((item) => {
        const eitherContactsOrTags = contactAndTagData[item.replace("s", "")];
        const isEditable = Object.keys(contactAndTagData).includes(
          item.replace("s", "")
        );

        if (Array.isArray(itemData[item]) && item !== itemTitle.toLowerCase()) {
          return (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {editMode ? (
                isEditable && (
                  <MultipleSelect
                    personMaker={personMaker}
                    label={item}
                    existingItems={personMaker(itemData[item])}
                    data={eitherContactsOrTags}
                    handleChange={handleChange}
                  />
                )
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

export default FormSelectors;
