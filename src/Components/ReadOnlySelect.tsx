// Component from material.ui
import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CRMDataModel from "../Models/CRMDataModel";

interface IReadOnlySelect {
  label: string;
  data: Array<CRMDataModel>;
}

const ReadOnlySelect: React.FC<IReadOnlySelect> = ({
  label,
  data,
}) => {

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        label={label}
        value={""}
      >
        <MenuItem value="">
          <em>Toggle edit to add {label}</em>
        </MenuItem>
        {data &&
          data.map((dataItem) => (
            <MenuItem>{dataItem.name || `${dataItem.firstName} ${dataItem.lastName}`}</MenuItem>
          ))}
      </Select>
      <FormHelperText>
        View {label.toLowerCase()} from the drop-down menu
      </FormHelperText>
    </FormControl>
  );
};

export default ReadOnlySelect;
