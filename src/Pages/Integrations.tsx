import "../App.css";
import NavBar from "../Components/NavBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "../Components/Table/Table";
import UpdateModal from "../Components/FormModal";
import NoData from "../Components/NoData";
import { useEffect } from "react";
import { ModalStatusLabel} from "../Models/Enums";
import { tableCellDictionary } from "../Utilities/tableCellDictionary";
import useModalStateAndNetworkRequests from "../Utilities/useModalStateAndNetworkRequests";

const headCells = tableCellDictionary["Integrations"];
const { NEW_FORM_MODAL_STATUS, UPDATE_FORM_MODAL_STATUS } = ModalStatusLabel;

const Integrations = () => {
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
    modalStatus,
  } = useModalStateAndNetworkRequests([], "integration");

  const uniqueItemAlreadyExists = (name: string) => {
    return CrmRecords?.find(
      (item) => item?.name?.toLowerCase() === name?.toLowerCase()
    );
  };

  console.log("RENDER");

  useEffect(() => {
    setLoading(true);
    getAllRecords();
  }, []);

  return (
    <div className="Integrations">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <UpdateModal
          modalStatus={modalStatus[UPDATE_FORM_MODAL_STATUS]}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Integration", buttonLabel: "Update" }}
          itemData={singleRecord}
          updateItem={updateRecord}
          contactAndTagData={[]}
          setEditMode={false}
          uniqueItemAlreadyExists={uniqueItemAlreadyExists}
        />
        <UpdateModal
          modalStatus={modalStatus[NEW_FORM_MODAL_STATUS]}
          labels={{ itemTitle: "Integration", buttonLabel: "Add" }}
          setEditMode={true}
          itemData={{
            name: "",
          }}
          setModalStatus={setModalStatus}
          contactAndTagData={[]}
          updateItem={addRecord}
          uniqueItemAlreadyExists={uniqueItemAlreadyExists}
        />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item md={10}>
            {CrmRecords.length > 0 ? (
              <Table
                headCells={headCells}
                tableRowData={CrmRecords}
                openModal={openUpdateRecordModal}
                deleteItems={deleteRecords}
                label="Integrations"
              />
            ) : (
              <NoData label={"Integration"} loading={loading} error={false} />
            )}
          </Grid>
          <Grid item md={2}>
            <Stack direction="column" spacing={2}>
              <Button
                sx={{ backgroundColor: "white" }}
                onClick={openNewRecordModal}
              >
                Add Integrations
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Integrations;
