import "../App.css";
import NavBar from "../Components/NavBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "../Components/Table";
import MoreDetailsModal from "../Components/MoreDetailsModal";
import BulkUploader from "../Components/BulkUploader";
import useNetworkRequest from "../Hooks/useNetworkRequest";
import { useState, useEffect } from "react";

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "postCode",
    numeric: true,
    disablePadding: false,
    label: "Post Code",
  },
  {
    id: "venueName",
    numeric: true,
    disablePadding: false,
    label: "Venue Name",
  },
];

const relationshipsToUpdate = ["tags", "contacts"];

const Events = () => {
  const [resp, setResponse] = useState([]);

  const [modalStatus, setModalStatus] = useState({
    updateContactModalStatus: {
      open: false,
      error: false,
      label: "updateContactModalStatus",
    },
    addContactModalStatus: {
      open: false,
      error: false,
      label: "addContactModalStatus",
    },
    bulkAddContactModalStatus: {
      open: false,
      error: false,
      label: "bulkAddContactModalStatus",
    },
  });
  const [singleContact, setSingleContact] = useState(null);
  const [relationshipData, setRelationshipData] = useState({});
  const { getItems, postItem, putItem, deleteItem } = useNetworkRequest();

  const getRelationshipData = () => {
    const relationshipNetworkEndpoints = relationshipsToUpdate.map((item) =>
      item.replace("s", "")
    );
    relationshipNetworkEndpoints.forEach(async (item) => {
      const response = await getItems(
        `http://localhost:8080/api/v1/${item}/getAll`
      );
      const relationData = relationshipData;
      relationData[item] = response;
      setRelationshipData(relationData);
    });
  };

  const handleAddContact = () => {
    getRelationshipData();
    setModalStatus((state) => ({
      ...state,
      addContactModalStatus: {
        open: true,
        error: false,
        label: "addContactModalStatus",
      },
    }));
  };

  const handleBulkAddContact = () => {
    setModalStatus((state) => ({
      ...state,
      bulkAddContactModalStatus: {
        open: true,
        error: false,
        label: "bulkAddContactModalStatus",
      },
    }));
  };

  const multiDelete = async (payload) => {
    const response = await deleteItem(
      "http://localhost:8080/api/v1/contact/deleteMulti/",
      payload
    );
    if (response.ok === true) {
      getAllContacts();
    }
  };

  const openModal = async (modalValue, itemId) => {
    const response = await getItems(
      `http://localhost:8080/api/v1/contact/getSingle/${itemId}`
    );
    setSingleContact(response);
    getRelationshipData();
    setModalStatus((state) => ({
      ...state,
      updateContactModalStatus: {
        open: modalValue,
        error: false,
        label: "updateContactModalStatus",
      },
    }));
  };

  const updateContact = async (formPayload) => {
    const response = await putItem(
      `http://localhost:8080/api/v1/contact/updatejson/${formPayload.id}/`,
      formPayload
    );
    if (response.ok === true) {
      setModalStatus((state) => ({
        ...state,
        updateContactModalStatus: {
          open: false,
          error: false,
          label: "updateContactModalStatus",
        },
      }));
      getAllContacts();
    } else {
      setModalStatus((state) => ({
        ...state,
        updateContactModalStatus: {
          open: true,
          error: true,
          label: "updateContactModalStatus",
        },
      }));
    }
  };

  const addContact = async (formPayload) => {
    const response = await postItem(
      `http://localhost:8080/api/v1/contact/create/`,
      formPayload
    );
    if (response.ok === true) {
      setModalStatus((state) => ({
        ...state,
        addContactModalStatus: {
          open: false,
          error: false,
          label: "addContactModalStatus",
        },
      }));
      getAllContacts();
    } else {
      setModalStatus((state) => ({
        ...state,
        addContactModalStatus: {
          open: true,
          error: true,
          label: "addContactModalStatus",
        },
      }));
    }
  };

  const addBulkContact = async (formPayload) => {
    const response = await postItem(
      `http://localhost:8080/api/v1/contact/createBulk/`,
      formPayload
    );

    if (response.ok === true) {
      setModalStatus((state) => ({
        ...state,
        bulkAddContactModalStatus: {
          open: false,
          error: false,
          label: "bulkAddContactModalStatus",
        },
      }));
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
    const response = await getItems(
      "http://localhost:8080/api/v1/contact/getAll"
    );
    setResponse(response);
  };

  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <div className="events">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <h1 className="section-heading">Contacts</h1>
        <MoreDetailsModal
          modalStatus={modalStatus.updateContactModalStatus}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Event", buttonLabel: "Update" }}
          itemData={singleContact}
          updateItem={updateContact}
          relationshipData={relationshipData}
          setEditMode={false}
        />
        <BulkUploader
          modalStatus={modalStatus.bulkAddContactModalStatus}
          setModalStatus={setModalStatus}
          updateItem={addBulkContact}
        />
        <MoreDetailsModal
          modalStatus={modalStatus.addContactModalStatus}
          labels={{ itemTitle: "Event", buttonLabel: "Add" }}
          setEditMode={true}
          itemData={{
            firstName: "",
            lastName: "",
            postCode: "",
            email: "",
            age: "",
            tags: [],
          }}
          addItem={addContact}
          setModalStatus={setModalStatus}
          relationshipData={relationshipData}
          updateItem={addContact}
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
              <Button onClick={handleAddContact}>Add Single Contact</Button>
              <Button onClick={handleBulkAddContact}>Add Bulk Contacts</Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Events;
