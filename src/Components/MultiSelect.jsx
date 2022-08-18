import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

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

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect({ label, data, handleChange }) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [selectList, setSelectList] = React.useState(data);

  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event;

    const names = value.map((item) => {
      if (item.firstName) return `${item.firstName} ${item.lastName}`;
      else return item;
    });

    const selectedObject = value.find((item) => item.id);
    setSelectList(selectList.filter((item) => item !== selectedObject));

    setPersonName(
      // On autofill we get a stringified value.
      typeof names === "string" ? names.split(",") : names
    );

    handleChange(selectedObject, "relationship", label);
  };

  React.useEffect(() => {
    setSelectList(data);
  }, data.length);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleSelectChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {selectList.map((dataItem) => (
            <MenuItem
              name={label}
              data-id={dataItem.id}
              id={dataItem.id}
              value={dataItem}
              style={getStyles(dataItem.firstName, personName, theme)}
            >
              {dataItem.name || dataItem.firstName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
