import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

interface IDatePicker {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editMode: boolean;
  currDate: string;
}

const DatePicker: React.FC<IDatePicker> = ({
  handleChange,
  editMode,
  currDate,
}) => {
  const [value, setValue] = React.useState<Date>(
    currDate ? new Date(currDate) : new Date()
  );

  const handleDateChange = (newValue: React.ChangeEvent<HTMLInputElement>) => {
    setValue(newValue as unknown as Date);
    handleChange(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label="Event Date"
        disabled={!editMode}
        inputFormat="MM/dd/yyyy"
        value={value}
        onChange={(e) =>
          handleDateChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
        }
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
