export interface ModalStatus {
  open: boolean;
  error: boolean;
  label: string;
}

export interface ISetModalStatus {
  UPDATE_FORM_MODAL_STATUS?: ModalStatus | undefined;
  NEW_FORM_MODAL_STATUS?: ModalStatus | undefined;
  bulkAddContactModalStatus?: ModalStatus | undefined;
}

export enum ModalStatusLabel {
  UPDATE_FORM_MODAL_STATUS = "UPDATE_FORM_MODAL_STATUS",
  NEW_FORM_MODAL_STATUS = "NEW_FORM_MODAL_STATUS",
}

export enum NetworkRequestStatus {
  SUCCESS = "SUCCESS",
  FAIL = "FAIL",
}
