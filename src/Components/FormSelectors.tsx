// Component from material.ui library.
import * as React from "react";
import Box from "@mui/material/Box";
import Select from "./Select";
import MultipleSelect from "./MultiSelect";
import CRMDataModel from "../Models/CRMDataModel";

interface FormSelectorsProps {
  itemData: CRMDataModel;
  itemTitle: string;
  editMode: boolean;
  contactAndTagData: object;
  handleChange: (
    selectedObject: CRMDataModel | undefined,
    label: string
  ) => void;
}

const personMaker = (
  collection: Array<CRMDataModel>
): Array<string | CRMDataModel> | undefined => {
  return collection?.map((item) => {
    if (item.firstName) return `${item.firstName} ${item.lastName}`;
    else if (item.name) return item.name;
    else return item;
  });
};

const FormSelectors: React.FC<FormSelectorsProps> = ({
  itemData,
  itemTitle,
  editMode,
  contactAndTagData,
  handleChange,
}) => {
  return (
    <Box sx={{ display: "flex" }}>
      {Object.keys(itemData).map((item) => {
        const eitherContactsOrTags =
          contactAndTagData[item.replace("s", "") as keyof object];

        const isEditable = Object.keys(contactAndTagData).includes(
          item.replace("s", "")
        );

        if (
          Array.isArray(itemData[item as keyof object]) &&
          item !== itemTitle.toLowerCase()
        ) {
          return (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {editMode ? (
                isEditable && (
                  <MultipleSelect
                    personMaker={personMaker}
                    label={item}
                    existingItems={personMaker(itemData[item as keyof object])}
                    data={eitherContactsOrTags}
                    handleChange={handleChange}
                  />
                )
              ) : (
                <Select
                  label={item}
                  data={itemData[item as keyof object]}
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
