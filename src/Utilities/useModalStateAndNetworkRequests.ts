import { useState } from "react";
import CRMDataModel from "../Models/CRMDataModel";
import { ModalStatusLabel, NetworkRequestStatus } from "../Models/Enums";
import { ISetModalStatus } from "../Models/IModalStatus";
import Relationships from "../Models/Relationships";
import { modalFactory, modalStatusFactory } from "./modalFactory";
import useNetworkRequest from "./useNetworkRequest";

const { SUCCESS, FAIL, LOADING } = NetworkRequestStatus;
const { UPDATE_FORM_MODAL_STATUS, NEW_FORM_MODAL_STATUS } = ModalStatusLabel;

const useModalStateAndNetworkRequests = (
  relationshipsToUpdate: Array<string>,
  section: string
) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [singleRecord, setSingleRecord] = useState<CRMDataModel>({});
  const [CrmRecords, setCrmRecords] = useState<Array<CRMDataModel>>([]);
  const [modalStatus, setModalStatus] = useState<ISetModalStatus>(
    modalFactory()
  );

  // Each event and organisation record contains an array of related contacts and tags, a contact record has an array of related tags.
  const [dataRelationships, setDataRelationships] = useState<Relationships>({});

  const { getItems, postItem, putItem, deleteItem, getRelationshipData } =
    useNetworkRequest();

  const ModalStateAndNetworkRequests = {
    loading,
    singleRecord,
    CrmRecords,
    dataRelationships,
    modalStatus,
    setModalStatus,
    setLoading,

    async fetchDataRelationships() {
      if (relationshipsToUpdate.length > 0) {
        const relationData = await getRelationshipData(relationshipsToUpdate);
        setDataRelationships(relationData);
      } else {
        return;
      }
    },

    async getAllRecords() {
      const response = await getItems(`/api/v1/${section}/getAll`);
      setCrmRecords(response);
      setLoading(false);
    },

    openNewRecordModal() {
      ModalStateAndNetworkRequests.fetchDataRelationships();
      setModalStatus((state) => ({
        ...state,
        NEW_FORM_MODAL_STATUS: modalStatusFactory(NEW_FORM_MODAL_STATUS),
      }));
    },

    async deleteRecords(payload: string[]) {
      const response = await deleteItem(
        `/api/v1/${section}/deleteMulti/`,
        payload
      );
      if (response.ok === true) {
        setLoading(true);
        ModalStateAndNetworkRequests.getAllRecords();
      }
    },

    async openUpdateRecordModal(itemId: string) {
      const response = await getItems(`/api/v1/${section}/getSingle/${itemId}`);
      setSingleRecord(response);
      ModalStateAndNetworkRequests.fetchDataRelationships();
      setModalStatus((state) => ({
        ...state,
        UPDATE_FORM_MODAL_STATUS: modalStatusFactory(UPDATE_FORM_MODAL_STATUS),
      }));
    },

    setModalStatusToLoading(formType: string) {
      setModalStatus((state) => ({
        ...state,
        [formType]: modalStatusFactory(formType, LOADING),
      }));
    },

    async updateRecord(formPayload: CRMDataModel) {
      let status: string = FAIL;
      ModalStateAndNetworkRequests.setModalStatusToLoading(UPDATE_FORM_MODAL_STATUS);
      const response = await putItem(
        `/api/v1/${section}/updatejson/${formPayload.id}/`,
        formPayload
      );

      if (response.ok === true) {
        status = SUCCESS;
        setLoading(true);
        ModalStateAndNetworkRequests.getAllRecords();
      }

      setModalStatus((state) => ({
        ...state,
        UPDATE_FORM_MODAL_STATUS: modalStatusFactory(
          UPDATE_FORM_MODAL_STATUS,
          status
        ),
      }));
    },

    async addRecord(formPayload: CRMDataModel) {
      let status: string = FAIL;
      ModalStateAndNetworkRequests.setModalStatusToLoading(NEW_FORM_MODAL_STATUS);
      const response = await postItem(
        `/api/v1/${section}/create/`,
        formPayload
      );

      if (response.ok === true) {
        status = SUCCESS;
        setLoading(true);
        ModalStateAndNetworkRequests.getAllRecords();
      }

      setModalStatus((state) => ({
        ...state,
        NEW_FORM_MODAL_STATUS: modalStatusFactory(
          NEW_FORM_MODAL_STATUS,
          status
        ),
      }));
    },
  };

  return ModalStateAndNetworkRequests;
};

export default useModalStateAndNetworkRequests;
