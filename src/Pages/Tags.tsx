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
import { ModalStatusLabel } from "../Models/Enums";
import { tableCellDictionary } from "../Utilities/tableCellDictionary";
import useModalStateAndNetworkRequests from "../Utilities/useModalStateAndNetworkRequests";

const headCells = tableCellDictionary["Tags"];
const { NEW_FORM_MODAL_STATUS, UPDATE_FORM_MODAL_STATUS } = ModalStatusLabel;

const Tags = () => {
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
  } = useModalStateAndNetworkRequests([], "tag");

  const uniqueItemAlreadyExists = (name: string) => {
    return CrmRecords?.find(
      (item) => item?.name?.toLowerCase() === name?.toLowerCase()
    );
  };

  useEffect(() => {
    setLoading(true);
    getAllRecords();
  }, []);

  return (
    <div className="Tags">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <UpdateModal
          modalStatus={modalStatus[UPDATE_FORM_MODAL_STATUS]}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Tag", buttonLabel: "Update" }}
          itemData={singleRecord}
          updateItem={updateRecord}
          contactAndTagData={[]}
          setEditMode={false}
          uniqueItemAlreadyExists={uniqueItemAlreadyExists}
        />
        <UpdateModal
          modalStatus={modalStatus[NEW_FORM_MODAL_STATUS]}
          labels={{ itemTitle: "Tag", buttonLabel: "Add" }}
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
                label="Tags"
                headCells={headCells}
                tableRowData={CrmRecords}
                openModal={openUpdateRecordModal}
                deleteItems={deleteRecords}
              />
            ) : (
              <NoData label={"Tag"} loading={loading} error={false} />
            )}
          </Grid>
          <Grid item md={2}>
            <Stack direction="column" spacing={2}>
              <Button
                data-testid="add-tag"
                sx={{ backgroundColor: "white" }}
                onClick={openNewRecordModal}
              >
                Add Tags
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Tags;
