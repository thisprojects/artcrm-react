// Component from material.ui
import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CRMDataModel from "../Models/CRMDataModel";

interface RelationshipSelectProps {
  label: string;
  data: Array<CRMDataModel>;
  handleChange: (
    selectedObject: CRMDataModel | undefined,
    label: string
  ) => void;
}

const RelationshipSelect: React.FC<RelationshipSelectProps> = ({
  label,
  data,
  handleChange,
}) => {
  const [item, setItem] = React.useState("");
  console.log("SELECT");
  const handleSelect = (event: Event) => {
    console.log("EVENT", event);
    const target = event?.target as HTMLButtonElement;
    setItem(target?.value);
    // handleChange(event.target.value, "relationship", label);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={item}
        label={label}
        onChange={(e) => {
          handleSelect(e as Event);
        }}
      >
        <MenuItem value="">
          <em>Add {label}</em>
        </MenuItem>
        {data &&
          data.map((dataItem) => (
            <MenuItem>{dataItem.name || dataItem.firstName}</MenuItem>
          ))}
      </Select>
      <FormHelperText>
        View {label.toLowerCase()} from the drop-down menu
      </FormHelperText>
    </FormControl>
  );
};

export default RelationshipSelect;