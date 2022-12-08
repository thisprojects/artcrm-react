import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// This component was copy pasted from MUI website, implementation is a little janky for this usecase.
// Refactoring to typescript breaks the handleSelectChange method.
// TODO: Refactor handleChange so it works with typescript.
export default function EditableSelect({
  label,
  allOptions,
  handleChange,
  activeOptions,
  optionItemFactory,
}) {
  // Selected options are those that have already been chosen (represented by ticked checkbox)
  const [listOfSelectedOptions, setlistOfSelectedOptions] =
    React.useState(activeOptions);

  // Available options are those that are not currently selected (un-ticked checkbox)
  const [availableOptions, setAvailableOptions] = React.useState(allOptions);

  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event;

    // the whole options array is passed through with the event.
    let optionsArray = value;

    // Only objects with an id property have been selected by the user as part of the change event.
    const selectedObject = value.find((item) => item.id);

    // Create a string to represent the selected item.
    const selectedOption =
      selectedObject?.name ||
      `${selectedObject?.firstName} ${selectedObject?.lastName}`;

    // If selected option is already in the list.
    if (listOfSelectedOptions.includes(selectedOption)) {
      const index = optionsArray.indexOf(selectedOption);
      // Remove the existing item from the options array.
      optionsArray.splice(index, 1);
      // Remove the newly added duplicate (will have been added as part of change event)
      optionsArray.pop();
      // Flag the selected item to be deleted as part of the network request which will now be made.
      selectedObject.delete = true;
    }

    // Create a new string array of options (will remove all properties except names)
    const options = optionItemFactory(optionsArray);
    // Remove the selected item from the available list.
    setAvailableOptions(
      availableOptions.filter((item) => item !== selectedObject)
    );
    // Set new selected item list.
    setlistOfSelectedOptions(options);
    // Forward the selected object up to a network request so that the allOptions can be changed via API.
    handleChange(selectedObject, label);
  };

  React.useEffect(() => {
    setAvailableOptions(allOptions);
  }, []);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={listOfSelectedOptions}
          onChange={handleSelectChange}
          input={<OutlinedInput id="select-multiple-chip" label="Tag" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {allOptions.map((option) => (
            <MenuItem
              name={label}
              data-id={option.id}
              id={option.id}
              value={option}
            >
              <Checkbox
                checked={
                  listOfSelectedOptions.indexOf(
                    option.name || `${option.firstName} ${option.lastName}`
                  ) > -1
                }
              />
              <ListItemText
                primary={
                  option.name || `${option.firstName} ${option.lastName}`
                }
              />
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          Add {label.toLowerCase()} from the drop-down menu
        </FormHelperText>
      </FormControl>
    </div>
  );
}
