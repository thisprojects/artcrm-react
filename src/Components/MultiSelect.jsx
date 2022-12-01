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

export default function MultipleSelect({
  label,
  data,
  handleChange,
  existingItems,
  personMaker,
}) {
  const [personName, setPersonName] = React.useState(existingItems);
  const [selectList, setSelectList] = React.useState(data);

  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log("EVENT", event);
    let namesArray = value;
    const selectedObject = value.find((item) => item.id);
    const person =
      selectedObject?.name ||
      `${selectedObject?.firstName} ${selectedObject?.lastName}`;

    if (personName.includes(person)) {
      const index = namesArray.indexOf(person);
      namesArray.splice(index, 1);
      namesArray.pop();
      selectedObject.delete = true;
    }

    const names = personMaker(namesArray);
    setSelectList(selectList.filter((item) => item !== selectedObject));
    setPersonName(names);
    handleChange(selectedObject, label);
  };

  React.useEffect(() => {
    setSelectList(data);
  }, [data]);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleSelectChange}
          input={<OutlinedInput id="select-multiple-chip" label="Tag" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {data.map((dataItem) => (
            <MenuItem
              name={label}
              data-id={dataItem.id}
              id={dataItem.id}
              value={dataItem}
            >
              <Checkbox
                checked={
                  personName.indexOf(
                    dataItem.name ||
                      `${dataItem.firstName} ${dataItem.lastName}`
                  ) > -1
                }
              />
              <ListItemText primary={dataItem.name || dataItem.firstName} />
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
