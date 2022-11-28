export interface ContactModalStatus {
  open: boolean;
  error: boolean;
  label: string;
}

export interface ISetModalStatus {
  updateContactModalStatus?: ContactModalStatus | undefined;
  addContactModalStatus?: ContactModalStatus | undefined;
  bulkAddContactModalStatus?: ContactModalStatus | undefined;
  updateEventModalStatus?: ContactModalStatus | undefined;
  addEventModalStatus?: ContactModalStatus | undefined;
  updateIntegrationModalStatus?: ContactModalStatus | undefined;
  addIntegrationModalStatus?: ContactModalStatus | undefined;
  updateOrganisationModalStatus?: ContactModalStatus | undefined;
  addOrganisationModalStatus?: ContactModalStatus | undefined;
  updateTagModalStatus?: ContactModalStatus | undefined;
  addTagModalStatus?: ContactModalStatus | undefined;
}
