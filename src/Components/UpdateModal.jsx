// Component from material.ui library
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import Form from "./Form";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "65%",
  bgcolor: "background.paper",
  border: "1px solid gray",
  boxShadow: 24,
  padding: "70px",
  p: 4,
  overflow: "scroll",
};

export default function MoreDetailsModal({
  modalStatus,
  itemData,
  setModalStatus,
  updateItem,
  contactAndTagData,
  labels: { itemTitle, buttonLabel },
  setEditMode,
}) {
  const [editMode, updateEditMode] = useState(setEditMode);

  const handleClose = () => {
    setModalStatus((state) => ({
      ...state,
      [modalStatus.label]: {
        open: false,
        error: false,
        label: modalStatus.label,
      },
    }));
    updateEditMode(false);
  };

  React.useEffect(() => {
    if (modalStatus.error) {
      updateEditMode(false);
    }
  }, [modalStatus.error]);

  React.useEffect(() => {
    updateEditMode(setEditMode);
  }, [modalStatus.open]);

  return (
    <div>
      <Modal
        open={modalStatus.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {buttonLabel} {itemTitle}
          </Typography>
          <Form
            editMode={editMode}
            itemData={itemData}
            updateItem={updateItem}
            itemTitle={itemTitle}
            contactAndTagData={contactAndTagData}
            buttonLabel={buttonLabel}
            updateEditMode={updateEditMode}
          />
        </Box>
      </Modal>
    </div>
  );
}
