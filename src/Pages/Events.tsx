import "../App.css";
import NavBar from "../Components/NavBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "../Components/Table";
import UpdateModal from "../Components/FormModal";
import NoData from "../Components/NoData";
import useNetworkRequest from "../Utilities/useNetworkRequest";
import { useState, useEffect } from "react";
import { FormPayload } from "./Contacts";
import {
  ISetModalStatus,
  ModalStatusLabel,
  NetworkRequestStatus,
} from "../Models/ModalStatus";
import { ItemData } from "../Components/Form";
import { tableCellDictionary } from "../Utilities/tableCellDictionary";
import { modalFactory, modalStatusFactory } from "../Utilities/modalFactory";

const { NEW_FORM_MODAL_STATUS, UPDATE_FORM_MODAL_STATUS } = ModalStatusLabel;
const { FAIL, SUCCESS } = NetworkRequestStatus;

const headCells = tableCellDictionary["Events"];

const relationshipsToUpdate = ["tags", "contacts"];

const Events = () => {
  const [resp, setResponse] = useState([]);

  const [modalStatus, setModalStatus] = useState<ISetModalStatus>(
    modalFactory()
  );

  const [singleEvent, setSingleEvent] = useState<ItemData>({});
  const [contactAndTagData, setContactAndTagData] = useState({});
  const { getItems, postItem, putItem, deleteItem } = useNetworkRequest();
  const [loading, setLoading] = useState(true);

  const getRelationshipData = () => {
    const relationshipNetworkEndpoints = relationshipsToUpdate.map((item) =>
      item.replace("s", "")
    );
    relationshipNetworkEndpoints.forEach(async (item) => {
      const response = await getItems(`/api/v1/${item}/getAll`);
      const relationData: Record<string, Array<object>> = contactAndTagData;
      relationData[item] = response;
      setContactAndTagData(relationData);
    });
  };

  const openAddEventModal = () => {
    setModalStatus((state) => ({
      ...state,
      NEW_FORM_MODAL_STATUS: modalStatusFactory(NEW_FORM_MODAL_STATUS),
    }));
  };

  const multiDelete = async (payload: FormPayload) => {
    const response = await deleteItem("/api/v1/event/deleteMulti/", payload);
    if (response.ok === true) {
      setLoading(true);
      getAllEvents();
    }
  };

  const openUpdateModal = async (modalValue: boolean, itemId: string) => {
    const response = await getItems(`/api/v1/event/getSingle/${itemId}`);

    setSingleEvent(response);
    getRelationshipData();
    setModalStatus((state) => ({
      ...state,
      UPDATE_FORM_MODAL_STATUS: modalStatusFactory(UPDATE_FORM_MODAL_STATUS),
    }));
  };

  const updateEvent = async (formPayload: FormPayload) => {
    let status: string = FAIL;
    const response = await putItem(
      `/api/v1/event/updatejson/${formPayload.id}/`,
      formPayload
    );

    if (response.ok === true) {
      status = SUCCESS;
      setLoading(true);
      getAllEvents();
    }

    setModalStatus((state) => ({
      ...state,
      UPDATE_FORM_MODAL_STATUS: modalStatusFactory(
        UPDATE_FORM_MODAL_STATUS,
        status
      ),
    }));
  };

  const addEvent = async (formPayload: FormPayload) => {
    let status: string = FAIL;
    const response = await postItem(`/api/v1/event/create/`, formPayload);

    if (response.ok === true) {
      status = SUCCESS;
      setLoading(true);
      getAllEvents();
    }

    setModalStatus((state) => ({
      ...state,
      NEW_FORM_MODAL_STATUS: modalStatusFactory(NEW_FORM_MODAL_STATUS, status),
    }));
  };

  const getAllEvents = async () => {
    const response = await getItems("/api/v1/event/getAll");
    setResponse(response);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getRelationshipData();
    getAllEvents();
  }, []);

  return (
    <div className="events">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <UpdateModal
          modalStatus={modalStatus[UPDATE_FORM_MODAL_STATUS]}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Event", buttonLabel: "Update" }}
          itemData={singleEvent}
          updateItem={updateEvent}
          contactAndTagData={contactAndTagData}
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
          contactAndTagData={contactAndTagData}
          updateItem={addEvent}
        />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
          <Grid item md={10}>
            {resp.length > 0 ? (
              <Table
                headCells={headCells}
                tableRowData={resp}
                openModal={openUpdateModal}
                deleteItems={multiDelete}
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
                onClick={openAddEventModal}
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
