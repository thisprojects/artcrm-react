import "../App.css";
import NavBar from "../Components/NavBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "../Components/Table";
import FormModal from "../Components/FormModal";
import BulkUploader from "../Components/BulkUploader";
import useNetworkRequest from "../Utilities/useNetworkRequest";
import CRMDataModel from "../Models/CRMDataModel";
import { ISetModalStatus } from "../Models/IModalStatus";
import { ModalStatusLabel, NetworkRequestStatus } from "../Models/Enums";
import NoData from "../Components/NoData";
import { useState, useEffect } from "react";
import { modalFactory, modalStatusFactory } from "../Utilities/modalFactory";
import { tableCellDictionary } from "../Utilities/tableCellDictionary";

const { SUCCESS, FAIL } = NetworkRequestStatus;
const { UPDATE_FORM_MODAL_STATUS, NEW_FORM_MODAL_STATUS } = ModalStatusLabel;
const headCells = tableCellDictionary["Contact"];
const relationshipsToUpdate = ["tag"];

const Contacts = () => {
  const [resp, setResponse] = useState<Array<CRMDataModel>>([]);
  const [modalStatus, setModalStatus] = useState<ISetModalStatus>(
    modalFactory()
  );

  const [loading, setLoading] = useState(true);
  const [singleContact, setSingleContact] = useState<CRMDataModel>({});
  const [TagRelationships, setTagRelationships] = useState({});

  const { getItems, postItem, putItem, deleteItem, getRelationshipData } =
    useNetworkRequest();

  const fetchTagRelationships = async () => {
    const relationData = await getRelationshipData(relationshipsToUpdate);
    setTagRelationships(relationData);
  };

  const openAddContactModal = () => {
    fetchTagRelationships();
    setModalStatus((state) => ({
      ...state,
      NEW_FORM_MODAL_STATUS: modalStatusFactory(NEW_FORM_MODAL_STATUS),
    }));
  };

  // Bulk uploads only exists in contact section so it has a unique state object here.
  const openBulkUploadModal = () => {
    setModalStatus((state) => ({
      ...state,
      bulkAddContactModalStatus: {
        open: true,
        error: false,
        label: "bulkAddContactModalStatus",
      },
    }));
  };

  const multiDelete = async (payload: CRMDataModel) => {
    const response = await deleteItem("/api/v1/contact/deleteMulti/", payload);
    if (response.ok === true) {
      setLoading(true);
      getAllContacts();
    }
  };

  const openUpdateModal = async (itemId: string) => {
    const response = await getItems(`/api/v1/contact/getSingle/${itemId}`);
    setSingleContact(response);
    fetchTagRelationships();
    setModalStatus((state) => ({
      ...state,
      UPDATE_FORM_MODAL_STATUS: modalStatusFactory(UPDATE_FORM_MODAL_STATUS),
    }));
  };

  const updateContact = async (formPayload: CRMDataModel) => {
    let status: string = FAIL;
    const response = await putItem(
      `/api/v1/contact/updatejson/${formPayload.id}/`,
      formPayload
    );

    if (response.ok === true) {
      status = SUCCESS;
      setLoading(true);
      getAllContacts();
    }

    setModalStatus((state) => ({
      ...state,
      UPDATE_FORM_MODAL_STATUS: modalStatusFactory(
        UPDATE_FORM_MODAL_STATUS,
        status
      ),
    }));
  };

  const addContact = async (formPayload: CRMDataModel) => {
    let status: string = FAIL;
    const response = await postItem(`/api/v1/contact/create/`, formPayload);

    if (response.ok === true) {
      status = SUCCESS;
      setLoading(true);
      getAllContacts();
    }

    setModalStatus((state) => ({
      ...state,
      NEW_FORM_MODAL_STATUS: modalStatusFactory(NEW_FORM_MODAL_STATUS, status),
    }));
  };

  // Add bulk contact is unique to contact section.
  const addBulkContact = async (formPayload: CRMDataModel) => {
    const response = await postItem(`/api/v1/contact/createBulk/`, formPayload);

    if (response.ok === true) {
      setModalStatus((state) => ({
        ...state,
        bulkAddContactModalStatus: {
          open: false,
          error: false,
          label: "bulkAddContactModalStatus",
        },
      }));
      setLoading(true);
      getAllContacts();
    } else {
      setModalStatus((state) => ({
        ...state,
        bulkAddContactModalStatus: {
          open: true,
          error: true,
          label: "bulkAddContactModalStatus",
        },
      }));
    }
  };

  const getAllContacts = async () => {
    const response = await getItems(`/api/v1/contact/getAll`);
    setResponse(response);
    setLoading(false);
  };

  const uniqueItemAlreadyExists = (email: string) => {
    return resp?.find(
      (item) => item?.email?.toLowerCase() === email?.toLowerCase()
    );
  };

  useEffect(() => {
    setLoading(true);
    getAllContacts();
  }, []);

  return (
    <div className="contacts">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <FormModal
          modalStatus={modalStatus[UPDATE_FORM_MODAL_STATUS]}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Contact", buttonLabel: "Update" }}
          itemData={singleContact}
          updateItem={updateContact}
          contactAndTagData={TagRelationships}
          setEditMode={false}
          uniqueItemAlreadyExists={uniqueItemAlreadyExists}
        />
        <BulkUploader
          modalStatus={modalStatus.bulkAddContactModalStatus}
          setModalStatus={setModalStatus}
          updateItem={addBulkContact}
        />
        <FormModal
          modalStatus={modalStatus[NEW_FORM_MODAL_STATUS]}
          labels={{ itemTitle: "Contact", buttonLabel: "Add" }}
          setEditMode={true}
          itemData={{
            firstName: "",
            lastName: "",
            postCode: "",
            email: "",
            age: "",
            tags: [],
          }}
          uniqueItemAlreadyExists={uniqueItemAlreadyExists}
          setModalStatus={setModalStatus}
          contactAndTagData={TagRelationships}
          updateItem={addContact}
        />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
          <Grid item md={10}>
            {resp.length > 0 ? (
              <Table
                headCells={headCells}
                tableRowData={resp}
                openModal={openUpdateModal}
                deleteItems={multiDelete}
                label={"Contacts"}
              />
            ) : (
              <NoData label={"Contact"} loading={loading} error={null} />
            )}
          </Grid>
          <Grid item md={2}>
            <Stack direction="column" spacing={2}>
              <Button
                sx={{ backgroundColor: "white" }}
                onClick={openAddContactModal}
              >
                Add Single Contact
              </Button>
              <Button
                sx={{ backgroundColor: "white" }}
                onClick={openBulkUploadModal}
              >
                Add Bulk Contacts
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Contacts;
