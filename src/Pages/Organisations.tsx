import "../App.css";
import NavBar from "../Components/NavBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "../Components/Table/Table";
import UpdateModal from "../Components/FormModal";
import { useEffect } from "react";
import NoData from "../Components/NoData";
import { ModalStatusLabel } from "../Models/Enums";
import { tableCellDictionary } from "../Utilities/tableCellDictionary";
import useModalStateAndNetworkRequests from "../Utilities/useModalStateAndNetworkRequests";

const headCells = tableCellDictionary["Organisations"];
const { NEW_FORM_MODAL_STATUS, UPDATE_FORM_MODAL_STATUS } = ModalStatusLabel;

const Organisations = () => {
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
  } = useModalStateAndNetworkRequests(["tag", "contact"], "organisation");

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
    <div className="organisations">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <UpdateModal
          modalStatus={modalStatus[UPDATE_FORM_MODAL_STATUS]}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Organisation", buttonLabel: "Update" }}
          itemData={singleRecord}
          updateItem={updateRecord}
          contactAndTagData={dataRelationships}
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
          contactAndTagData={dataRelationships}
          updateItem={addRecord}
          uniqueItemAlreadyExists={uniqueItemAlreadyExists}
        />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item md={10}>
            {CrmRecords.length > 0 ? (
              <Table
                label="Organisations"
                headCells={headCells}
                tableRowData={CrmRecords}
                openModal={openUpdateRecordModal}
                deleteItems={deleteRecords}
              />
            ) : (
              <NoData label={"Organisation"} loading={loading} error={false} />
            )}
          </Grid>
          <Grid item md={2}>
            <Stack direction="column" spacing={2}>
              <Button
                sx={{ backgroundColor: "white" }}
                onClick={openNewRecordModal}
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
