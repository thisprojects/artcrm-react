// Component from material.ui library
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ToggleSwitch from "./ToggleSwitch";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import Form from "../Components/Form";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "scroll",
  height: "500px",
};

export default function MoreDetailsModal({
  modalOpen,
  itemData,
  setModalStatus,
  updateItem,
  relationshipData,
  labels: { itemTitle, buttonLabel },
  setEditMode,
}) {
  const [editMode, updateEditMode] = useState(setEditMode);

  const handleClose = () => setModalStatus(false);
  return (
    <div>
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update {itemTitle}
          </Typography>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item md={10}>
              <Form
                editMode={editMode}
                itemData={itemData}
                updateItem={updateItem}
                itemTitle={itemTitle}
                relationshipData={relationshipData}
                buttonLabel={buttonLabel}
              />
            </Grid>
            {buttonLabel === "Update" ? (
              <Grid item md={2}>
                <ToggleSwitch
                  label="Edit"
                  updateEditMode={updateEditMode}
                  editMode={editMode}
                />
              </Grid>
            ) : null}
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
