import "../App.css";
import { useEffect } from "react";
import NavBar from "../Components/NavBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "../Components/Table/Table";
import UpdateModal from "../Components/FormModal";
import NoData from "../Components/NoData";
import { ModalStatusLabel } from "../Models/Enums";
import { tableCellDictionary } from "../Utilities/tableCellDictionary";
import useModalStateAndNetworkRequests from "../Utilities/useModalStateAndNetworkRequests";

const { NEW_FORM_MODAL_STATUS, UPDATE_FORM_MODAL_STATUS } = ModalStatusLabel;
const headCells = tableCellDictionary["Events"];

const Events = () => {
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
  } = useModalStateAndNetworkRequests(["tag", "contact"], "event");

  useEffect(() => {
    setLoading(true);
    getAllRecords();
  }, []);

  return (
    <div className="events">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <UpdateModal
          modalStatus={modalStatus[UPDATE_FORM_MODAL_STATUS]}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Event", buttonLabel: "Update" }}
          itemData={singleRecord}
          updateItem={updateRecord}
          contactAndTagData={dataRelationships}
          setEditMode={false}
          uniqueItemAlreadyExists={() => undefined}
        />
        <UpdateModal
          modalStatus={modalStatus[NEW_FORM_MODAL_STATUS]}
          labels={{ itemTitle: "Event", buttonLabel: "Add" }}
          setEditMode={true}
          itemData={{
            name: "",
            venueName: "",
            postCode: "",
            eventDate: "",
            tags: [],
            contacts: [],
          }}
          uniqueItemAlreadyExists={() => undefined}
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
                label={"Events"}
              />
            ) : (
              <NoData label={"Event"} loading={loading} error={false} />
            )}
          </Grid>
          <Grid item md={2}>
            <Stack direction="column" spacing={2}>
              <Button
                sx={{ backgroundColor: "white" }}
                onClick={openNewRecordModal}
              >
                Add Event
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Events;
