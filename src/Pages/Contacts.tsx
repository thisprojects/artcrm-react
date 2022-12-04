import "../App.css";
import NavBar from "../Components/NavBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "../Components/Table/Table";
import FormModal from "../Components/FormModal";
import BulkUploader from "../Components/BulkUploader";
import useNetworkRequest from "../Utilities/useNetworkRequest";
import CRMDataModel from "../Models/CRMDataModel";
import { ModalStatusLabel } from "../Models/Enums";
import NoData from "../Components/NoData";
import { useEffect } from "react";
import { tableCellDictionary } from "../Utilities/tableCellDictionary";
import useModalStateAndNetworkRequests from "../Utilities/useModalStateAndNetworkRequests";

const { UPDATE_FORM_MODAL_STATUS, NEW_FORM_MODAL_STATUS } = ModalStatusLabel;
const headCells = tableCellDictionary["Contact"];

const Contacts = () => {
  const {
    setModalStatus,
    setLoading,
    addRecord,
    updateRecord,
    openNewRecordModal,
    openUpdateRecordModal,
    deleteRecords,
    getAllRecords,
    loading,
    singleRecord,
    CrmRecords,
    dataRelationships,
    modalStatus,
  } = useModalStateAndNetworkRequests(["tag"], "contact");

  const { postItem } = useNetworkRequest();

  // Bulk uploads only exists in contact section so it has a unique state object here.
  const openBulkUploadModal = () => {
    setModalStatus((state) => ({
      ...state,
      bulkAddContactModalStatus: {
        open: true,
        error: false,
        loading: false,
        label: "bulkAddContactModalStatus",
      },
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
          loading: false,
          label: "bulkAddContactModalStatus",
        },
      }));
      setLoading(true);
      getAllRecords();
    } else {
      setModalStatus((state) => ({
        ...state,
        bulkAddContactModalStatus: {
          open: true,
          error: true,
          loading: false,
          label: "bulkAddContactModalStatus",
        },
      }));
    }
  };

  const uniqueItemAlreadyExists = (email: string) => {
    return CrmRecords?.find(
      (item) => item?.email?.toLowerCase() === email?.toLowerCase()
    );
  };

  useEffect(() => {
    setLoading(true);
    getAllRecords();
  }, []);

  return (
    <div className="contacts">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <FormModal
          modalStatus={modalStatus[UPDATE_FORM_MODAL_STATUS]}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Contact", buttonLabel: "Update" }}
          itemData={singleRecord}
          updateItem={updateRecord}
          contactAndTagData={dataRelationships}
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
          contactAndTagData={dataRelationships}
          updateItem={addRecord}
        />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
          <Grid item md={10}>
            {CrmRecords.length > 0 ? (
              <Table
                headCells={headCells}
                tableRowData={CrmRecords}
                openModal={openUpdateRecordModal}
                deleteItems={deleteRecords}
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
                onClick={openNewRecordModal}
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
