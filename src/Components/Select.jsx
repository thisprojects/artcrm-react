// Component from material.ui
import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function RelationshipSelect({ label, data, handleChange }) {
  const [item, setItem] = React.useState("");

  const handleSelect = (event) => {
    setItem(event.target.value);
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
        onChange={handleSelect}
      >
        <MenuItem value="">
          <em>Add {label}</em>
        </MenuItem>
        {data &&
          data.map((dataItem) => (
            <MenuItem
              name={label}
              data-id={dataItem.id}
              id={dataItem.id}
              value={dataItem}
            >
              {dataItem.name || dataItem.firstName}
            </MenuItem>
          ))}
      </Select>
      <FormHelperText>
        View {label.toLowerCase()} from the drop-down menu
      </FormHelperText>
    </FormControl>
  );
}
