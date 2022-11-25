import * as React from "react";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

interface ToggleSwitchProps {
  label: string;
  updateEditMode: (editMode: boolean) => void;
  editMode: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  updateEditMode,
  editMode,
}) => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event?.target?.checked);
    updateEditMode(!editMode);
  };

  React.useEffect(() => {
    setChecked(editMode);
  }, [editMode]);

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
        label={label}
      />
    </FormGroup>
  );
};

export default ToggleSwitch;
