export interface IModalStatus {
  open: boolean;
  error: boolean;
  label: string;
  loading: boolean;
}

export interface ISetModalStatus {
  UPDATE_FORM_MODAL_STATUS?: IModalStatus | undefined;
  NEW_FORM_MODAL_STATUS?: IModalStatus | undefined;
  bulkAddContactModalStatus?: IModalStatus | undefined;
}
