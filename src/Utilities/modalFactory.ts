import { ModalStatusLabel, NetworkRequestStatus } from "../Models/ModalStatus";

const { SUCCESS, FAIL } = NetworkRequestStatus;
const { NEW_FORM_MODAL_STATUS, UPDATE_FORM_MODAL_STATUS } = ModalStatusLabel;

export const modalFactory = () => ({
  UPDATE_FORM_MODAL_STATUS: {
    open: false,
    error: false,
    label: UPDATE_FORM_MODAL_STATUS,
  },
  NEW_FORM_MODAL_STATUS: {
    open: false,
    error: false,
    label: NEW_FORM_MODAL_STATUS,
  },
  // Only required for contacts, havent added an ENUM.
  bulkAddContactModalStatus: {
    open: false,
    error: false,
    label: "bulkAddContactModalStatus",
  },
});

export const modalStatusFactory = (
  label: string,
  status?: string
  // Status will be either SUCCESS or FAIL
) => {
  const modalStatusDictionary = {
    [`${label}_${SUCCESS}`]: {
      open: false,
      error: false,
      label: label,
    },
    [`${label}_${FAIL}`]: {
      open: true,
      error: true,
      label: label,
    },
    OPEN_MODAL: {
      open: true,
      error: false,
      label: label,
    },
  };

  // Dynamically looking up modal status prevents duplication of success and fail objects for both NEW_FORM and UPDATE_FORM
  // Calls made with the "label" argument (exclusively) result in the return of the OPEN_MODAL object
  return status
    ? modalStatusDictionary[`${label}_${status}`]
    : modalStatusDictionary.OPEN_MODAL;
};
