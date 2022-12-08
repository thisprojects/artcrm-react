// Component from material.ui library.
import * as React from "react";
import Box from "@mui/material/Box";
import ReadOnlySelect from "./ReadOnlySelect";
import EditableSelect from "./EditableSelect";
import CRMDataModel from "../Models/CRMDataModel";
import Relationships from "../Models/Relationships";

interface IFormSelectors {
  itemData: CRMDataModel;
  itemTitle: string;
  editMode: boolean;
  contactAndTagData: Relationships | [];
  handleChange: (
    selectedObject: CRMDataModel | undefined,
    label: string
  ) => void;
}

// Select options are either events, organisations, contacts or tags.
const optionItemFactory = (
  collection: Array<CRMDataModel>
): Array<string | CRMDataModel> | undefined => {
  return collection?.map((item) => {
    if (item.firstName) return `${item.firstName} ${item.lastName}`;
    else if (item.name) return item.name;
    else return item;
  });
};

// This component represents the forms selector dropdown elements. They contain related items, such as the contacts related to an event
// or the tags related to a contact.
const FormSelectors: React.FC<IFormSelectors> = ({
  itemData,
  itemTitle,
  editMode,
  contactAndTagData,
  handleChange,
}) => {
  return (
    <Box sx={{ display: "flex" }}>
      {Object.keys(itemData).map((item, index) => {
        // Represents the contact and tag relationships owned by events, organisations and contacts.
        const eitherContactsOrTags =
          contactAndTagData[item.replace("s", "") as keyof object];

        const isEditable = Object.keys(contactAndTagData).includes(
          item.replace("s", "")
        );

        // EG dont display a contacts select dropdown if we are currently viewing a contact, dont display an events drop down if we
        // are viewing an event Etc.
        const relatedDataIsNotPrimarySection =
          Array.isArray(itemData[item as keyof object]) &&
          item !== itemTitle.toLowerCase();

        // If we are in editmode then display editable select, otherwise display ReadOnly select.
        if (relatedDataIsNotPrimarySection) {
          return (
            <Box
              key={item + index}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              {editMode ? (
                isEditable && (
                  <EditableSelect
                    optionItemFactory={optionItemFactory}
                    label={item}
                    activeOptions={optionItemFactory(
                      itemData[item as keyof object]
                    )}
                    allOptions={eitherContactsOrTags}
                    handleChange={handleChange}
                  />
                )
              ) : (
                <ReadOnlySelect
                  label={item}
                  data={itemData[item as keyof object]}
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
