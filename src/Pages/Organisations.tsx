import "../App.css";
import NavBar from "../Components/NavBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "../Components/Table";
import UpdateModal from "../Components/FormModal";
import useNetworkRequest from "../Utilities/useNetworkRequest";
import { useState, useEffect } from "react";
import NoData from "../Components/NoData";
import { FormPayload } from "./Contacts";
import {
  ISetModalStatus,
  ModalStatusLabel,
  NetworkRequestStatus,
} from "../Models/ModalStatus";
import Contact from "../Models/Contacts";
import { ItemData } from "../Components/Form";
import { tableCellDictionary } from "../Utilities/tableCellDictionary";
import { modalFactory, modalStatusFactory } from "../Utilities/modalFactory";

const headCells = tableCellDictionary["Organisations"];
const { NEW_FORM_MODAL_STATUS, UPDATE_FORM_MODAL_STATUS } = ModalStatusLabel;
const { SUCCESS, FAIL } = NetworkRequestStatus;
const relationshipsToUpdate = ["tags", "contacts"];

const Organisations = () => {
  const [resp, setResponse] = useState<Array<Contact>>([]);
  const [modalStatus, setModalStatus] = useState<ISetModalStatus>(
    modalFactory()
  );

  const [loading, setLoading] = useState(true);
  const [singleOrganisation, setSingleOrganisation] = useState<ItemData>({});
  const [contactAndTagData, setContactAndTagData] = useState({});
  const { getItems, postItem, putItem, deleteItem, getRelationshipData } =
    useNetworkRequest();

  const fetchContactAndTagRelationships = () => {
    const relationData = getRelationshipData(relationshipsToUpdate);
    setContactAndTagData(relationData);
  };

  const openAddOrganisationModal = () => {
    fetchContactAndTagRelationships();
    setModalStatus((state) => ({
      ...state,
      NEW_FORM_MODAL_STATUS: modalStatusFactory(NEW_FORM_MODAL_STATUS),
    }));
  };

  const multiDelete = async (payload: FormPayload) => {
    const response = await deleteItem(
      "/api/v1/organisation/deleteMulti/",
      payload
    );
    if (response.ok === true) {
      setLoading(true);
      getAllOrganisations();
    }
  };

  const openUpdateModal = async (modalValue: boolean, itemId: string) => {
    const response = await getItems(`/api/v1/organisation/getSingle/${itemId}`);
    setSingleOrganisation(response);
    fetchContactAndTagRelationships();
    setModalStatus((state) => ({
      ...state,
      UPDATE_FORM_MODAL_STATUS: modalStatusFactory(UPDATE_FORM_MODAL_STATUS),
    }));
  };

  const updateOrganisation = async (formPayload: FormPayload) => {
    let status = FAIL;
    const response = await putItem(
      `/api/v1/organisation/updatejson/${formPayload.id}/`,
      formPayload
    );

    if (response.ok === true) {
      status = SUCCESS;
      setLoading(true);
      getAllOrganisations();
    }

    setModalStatus((state) => ({
      ...state,
      UPDATE_FORM_MODAL_STATUS: modalStatusFactory(
        UPDATE_FORM_MODAL_STATUS,
        status
      ),
    }));
  };

  const addOrganisation = async (formPayload: FormPayload) => {
    let status = FAIL;
    const response = await postItem(
      `/api/v1/organisation/create/`,
      formPayload
    );

    if (response.ok === true) {
      status = SUCCESS;
      setLoading(true);
      getAllOrganisations();
    }

    setModalStatus((state) => ({
      ...state,
      NEW_FORM_MODAL_STATUS: modalStatusFactory(NEW_FORM_MODAL_STATUS, status),
    }));
  };

  const getAllOrganisations = async () => {
    const response = await getItems("/api/v1/organisation/getAll");
    setResponse(response);
    setLoading(false);
  };

  const uniqueItemAlreadyExists = (email: string) => {
    return resp?.find(
      (item) => item?.GetEmail()?.toLowerCase() === email?.toLowerCase()
    );
  };

  useEffect(() => {
    setLoading(true);
    getAllOrganisations();
  }, []);

  return (
    <div className="organisations">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <UpdateModal
          modalStatus={modalStatus[UPDATE_FORM_MODAL_STATUS]}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Organisation", buttonLabel: "Update" }}
          itemData={singleOrganisation}
          updateItem={updateOrganisation}
          contactAndTagData={contactAndTagData}
          setEditMode={false}
          uniqueItemAlreadyExists={uniqueItemAlreadyExists}
        />
        <UpdateModal
          modalStatus={modalStatus[NEW_FORM_MODAL_STATUS]}
          labels={{ itemTitle: "Organisation", buttonLabel: "Add" }}
          setEditMode={true}
          itemData={{
            name: "",
            email: "",
            postCode: "",
            tags: [],
            contacts: [],
          }}
          setModalStatus={setModalStatus}
          contactAndTagData={contactAndTagData}
          updateItem={addOrganisation}
          uniqueItemAlreadyExists={uniqueItemAlreadyExists}
        />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item md={10}>
            {resp.length > 0 ? (
              <Table
                label="Organisations"
                headCells={headCells}
                tableRowData={resp}
                openModal={openUpdateModal}
                deleteItems={multiDelete}
              />
            ) : (
              <NoData label={"Organisation"} loading={loading} error={false} />
            )}
          </Grid>
          <Grid item md={2}>
            <Stack direction="column" spacing={2}>
              <Button
                sx={{ backgroundColor: "white" }}
                onClick={openAddOrganisationModal}
              >
                Add Organisation
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Organisations;
