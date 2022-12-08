import * as React from "react";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

interface IToggleSwitch {
  label: string;
  updateEditMode: (editMode: boolean) => void;
  editMode: boolean;
}

const ToggleSwitch: React.FC<IToggleSwitch> = ({
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
            data-testid="edit-toggle"
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
