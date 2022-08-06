import "../App.css";
import NavBar from "../Components/NavBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "../Components/Table";
import MoreDetailsModal from "../Components/MoreDetailsModal";
import BulkUploader from "../Components/BulkUploader";
import { useState, useEffect } from "react";

const headCells = [
  {
    id: "firstName",
    numeric: false,
    disablePadding: true,
    label: "First Name",
  },
  {
    id: "lastName",
    numeric: false,
    disablePadding: false,
    label: "Last Name",
  },
  {
    id: "postCode",
    numeric: false,
    disablePadding: false,
    label: "Post Code",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "E-Mail",
  },
  {
    id: "age",
    numeric: false,
    disablePadding: false,
    label: "Age",
  },
  {
    id: "inspect",
    numberic: false,
    disablePadding: false,
  },
];

const relationshipsToUpdate = ["tags"];

const Contacts = () => {
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
  const getRelationshipData = () => {
    const relationshipNetworkEndpoints = relationshipsToUpdate.map((item) =>
      item.replace("s", "")
    );
    relationshipNetworkEndpoints.forEach(async (item) => {
      const response = await fetch(
        `http://localhost:8080/api/v1/${item}/getAll`
      ).then((r) => r.json());

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
    const response = await fetch(
      `http://localhost:8080/api/v1/contact/deleteMulti/`,
      {
        method: "DELETE",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      }
    ).then((r) => r);
    if (response.ok === true) {
      getAllContacts();
    }
  };

  const openModal = async (modalValue, itemId) => {
    const response = await fetch(
      `http://localhost:8080/api/v1/contact/getSingle/${itemId}`
    ).then((r) => r.json());
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
    const response = await fetch(
      `http://localhost:8080/api/v1/contact/updatejson/${formPayload.id}/`,
      {
        method: "PUT",
        body: JSON.stringify(formPayload),
        headers: { "Content-Type": "application/json" },
      }
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
    const response = await fetch(
      `http://localhost:8080/api/v1/contact/create/`,
      {
        method: "POST",
        body: JSON.stringify(formPayload),
        headers: { "Content-Type": "application/json" },
      }
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
    const response = await fetch(
      `http://localhost:8080/api/v1/contact/createBulk/`,
      {
        method: "POST",
        body: JSON.stringify(formPayload),
        headers: { "Content-Type": "application/json" },
      }
    ).then((r) => r);

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
    const response = await fetch(
      "http://localhost:8080/api/v1/contact/getAll"
    ).then((r) => r.json());
    setResponse(response);
  };

  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <div className="contacts">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <h1 className="section-heading">Contacts</h1>
        <MoreDetailsModal
          modalStatus={modalStatus.updateContactModalStatus}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Contact", buttonLabel: "Update" }}
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

export default Contacts;
