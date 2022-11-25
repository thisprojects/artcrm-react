import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

interface DatePicker {
  handleChange: (e: Date | null) => void;
  editMode: boolean;
  currDate: Date;
}

const DatePicker: React.FC<DatePicker> = ({
  handleChange,
  editMode,
  currDate,
}) => {
  const [value, setValue] = React.useState<Date | null>(
    currDate ? new Date(currDate) : new Date()
  );

  const handleDateChange = (newValue: Date | null) => {
    setValue(newValue);
    handleChange(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label="Event Date"
        disabled={!editMode}
        inputFormat="MM/dd/yyyy"
        value={value}
        onChange={handleDateChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
