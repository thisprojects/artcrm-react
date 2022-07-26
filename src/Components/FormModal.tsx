// Component from material.ui library
import * as React from "react";
import { Dispatch, SetStateAction } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import Form from "./Form";
import NoData from "./NoData";
import { ISetModalStatus, IModalStatus } from "../Models/IModalStatus";
import CRMDataModel from "../Models/CRMDataModel";
import Relationships from "../Models/Relationships";

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

interface IFormModal {
  modalStatus: IModalStatus | undefined;
  itemData: CRMDataModel;
  setModalStatus: Dispatch<SetStateAction<ISetModalStatus>>;
  updateItem: (formPayload: CRMDataModel) => void;
  contactAndTagData: Relationships | [];
  labels: { itemTitle: string; buttonLabel: string };
  setEditMode: boolean;
  uniqueItemAlreadyExists: (item: string) => CRMDataModel | undefined;
}

const FormModal: React.FC<IFormModal> = ({
  modalStatus,
  itemData,
  setModalStatus,
  updateItem,
  contactAndTagData,
  labels: { itemTitle, buttonLabel },
  setEditMode,
  uniqueItemAlreadyExists,
}) => {
  const [editMode, updateEditMode] = useState(setEditMode);

  const handleClose = () => {
    setModalStatus((state: object) => ({
      ...state,
      [modalStatus?.label as string]: {
        open: false,
        error: false,
        label: modalStatus?.label,
      },
    }));
    updateEditMode(false);
  };

  React.useEffect(() => {
    if (modalStatus?.error) {
      updateEditMode(false);
    }
  }, [modalStatus?.error]);

  React.useEffect(() => {
    updateEditMode(setEditMode);
  }, [modalStatus?.open]);

  return (
    <div>
      <Modal
        open={modalStatus?.open || false}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {modalStatus?.error ? (
            <NoData
              error={modalStatus.error}
              label={itemTitle}
              loading={modalStatus?.loading}
            />
          ) : (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {buttonLabel} {itemTitle}
              </Typography>
              <Form
                uniqueItemAlreadyExists={uniqueItemAlreadyExists}
                editMode={editMode}
                itemData={itemData}
                updateItem={updateItem}
                itemTitle={itemTitle}
                contactAndTagData={contactAndTagData}
                buttonLabel={buttonLabel}
                updateEditMode={updateEditMode}
              />
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default FormModal;
