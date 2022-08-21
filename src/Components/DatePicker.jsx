import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

export default function DatePicker({ handleChange, editMode, currDate }) {
  console.log("CURR DATE", currDate);
  const [value, setValue] = React.useState(
    currDate ? new Date(currDate) : new Date()
  );

  const handleDateChange = (newValue) => {
    setValue(newValue);
    handleChange(newValue, "date");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        name="eventDate"
        label="Event Date"
        disabled={!editMode}
        inputFormat="MM/dd/yyyy"
        value={value}
        onChange={handleDateChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
