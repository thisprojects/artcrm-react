import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function BasicPopover({ applyFilter }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilter = (e) => {
    applyFilter(e.target.value);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <IconButton
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      >
        <FilterListIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>
          <TextField
            variant="standard"
            label="Filter"
            onChange={handleFilter}
          />
        </Typography>
      </Popover>
    </div>
  );
}