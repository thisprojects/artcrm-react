import "../App.css";
import NavBar from "../Components/NavBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "../Components/Table";
import UpdateModal from "../Components/UpdateModal";
import useNetworkRequest from "../Hooks/useNetworkRequest";
import { useState, useEffect } from "react";

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "postCode",
    numeric: false,
    disablePadding: false,
    label: "Post Code",
  },
  {
    id: "venueName",
    numeric: false,
    disablePadding: false,
    label: "Venue Name",
  },
  {
    id: "inspect",
    numberic: false,
    disablePadding: false,
  },
];

const relationshipsToUpdate = ["tags", "contacts"];

const Events = () => {
  const [resp, setResponse] = useState([]);

  const [modalStatus, setModalStatus] = useState({
    updateEventModalStatus: {
      open: false,
      error: false,
      label: "updateEventModalStatus",
    },
    addEventModalStatus: {
      open: false,
      error: false,
      label: "addEventModalStatus",
    },
  });

  const [singleEvent, setSingleEvent] = useState(null);
  const [contactAndTagData, setContactAndTagData] = useState({});
  const { getItems, postItem, putItem, deleteItem } = useNetworkRequest();

  const getRelationshipData = () => {
    const relationshipNetworkEndpoints = relationshipsToUpdate.map((item) =>
      item.replace("s", "")
    );
    relationshipNetworkEndpoints.forEach(async (item) => {
      const response = await getItems(
        `http://localhost:8080/api/v1/${item}/getAll`
      );
      const relationData = contactAndTagData;
      relationData[item] = response;
      setContactAndTagData(relationData);
    });
  };

  const handleAddEvent = () => {
    getRelationshipData();
    setModalStatus((state) => ({
      ...state,
      addEventModalStatus: {
        open: true,
        error: false,
        label: "addEventModalStatus",
      },
    }));
  };

  const multiDelete = async (payload) => {
    const response = await deleteItem(
      "http://localhost:8080/api/v1/event/deleteMulti/",
      payload
    );
    if (response.ok === true) {
      getAllEvents();
    }
  };

  const openModal = async (modalValue, itemId) => {
    const response = await getItems(
      `http://localhost:8080/api/v1/event/getSingle/${itemId}`
    );
    setSingleEvent(response);
    getRelationshipData();
    setModalStatus((state) => ({
      ...state,
      updateEventModalStatus: {
        open: modalValue,
        error: false,
        label: "updateEventModalStatus",
      },
    }));
  };

  const updateEvent = async (formPayload) => {
    const response = await putItem(
      `http://localhost:8080/api/v1/event/updatejson/${formPayload.id}/`,
      formPayload
    );
    if (response.ok === true) {
      setModalStatus((state) => ({
        ...state,
        updateEventModalStatus: {
          open: false,
          error: false,
          label: "updateEventModalStatus",
        },
      }));
      getAllEvents();
    } else {
      setModalStatus((state) => ({
        ...state,
        updateEventModalStatus: {
          open: true,
          error: true,
          label: "updateEventModalStatus",
        },
      }));
    }
  };

  const addEvent = async (formPayload) => {
    const response = await postItem(
      `http://localhost:8080/api/v1/event/create/`,
      formPayload
    );
    if (response.ok === true) {
      setModalStatus((state) => ({
        ...state,
        addEventModalStatus: {
          open: false,
          error: false,
          label: "addEventModalStatus",
        },
      }));
      getAllEvents();
    } else {
      setModalStatus((state) => ({
        ...state,
        addEventModalStatus: {
          open: true,
          error: true,
          label: "addEventModalStatus",
        },
      }));
    }
  };

  const getAllEvents = async () => {
    const response = await getItems(
      "http://localhost:8080/api/v1/event/getAll"
    );
    setResponse(response);
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  return (
    <div className="events">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <h1 className="section-heading">Events</h1>
        <UpdateModal
          modalStatus={modalStatus.updateEventModalStatus}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Event", buttonLabel: "Update" }}
          itemData={singleEvent}
          updateItem={updateEvent}
          contactAndTagData={contactAndTagData}
          setEditMode={false}
        />
        <UpdateModal
          modalStatus={modalStatus.addEventModalStatus}
          labels={{ itemTitle: "Event", buttonLabel: "Add" }}
          setEditMode={true}
          itemData={{
            name: "",
            venueName: "",
            postCode: "",
            tags: [],
            contacts: [],
          }}
          addItem={addEvent}
          setModalStatus={setModalStatus}
          contactAndTagData={contactAndTagData}
          updateItem={addEvent}
        />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item md={10}>
            {resp.length > 0 && (
              <Table
                headCells={headCells}
                tableRowData={resp}
                openModal={openModal}
                deleteItems={multiDelete}
              />
            )}
          </Grid>
          <Grid item md={2}>
            <Stack direction="column" spacing={2}>
              <Button onClick={handleAddEvent}>Add Event</Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Events;
