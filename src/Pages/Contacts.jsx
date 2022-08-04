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
    label: "Inspect",
  },
];

const relationshipsToUpdate = ["tags"];

const Contacts = () => {
  const [resp, setResponse] = useState([]);
  const [updateContactModalStatus, setUpdateContactModalStatus] = useState({
    open: false,
    error: false,
  });
  const [singleContact, setSingleContact] = useState(null);
  const [relationshipData, setRelationshipData] = useState({});
  const [addContactModalStatus, setAddContactModalStatus] = useState({
    open: false,
    error: false,
  });
  const [bulkAddContactModalStatus, setBulkAddContactModalStatus] = useState({
    open: false,
    error: false,
  });

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
    setAddContactModalStatus({ open: true, error: false });
  };

  const handleBulkAddContact = () => {
    setBulkAddContactModalStatus({ open: true, error: false });
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
    setUpdateContactModalStatus({ open: modalValue, error: false });
  };

  const updateContact = async (formPayload) => {
    console.log("FORM PAYLOAD", formPayload);
    const response = await fetch(
      `http://localhost:8080/api/v1/contact/updatejson/${formPayload.id}/`,
      {
        method: "PUT",
        body: JSON.stringify(formPayload),
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok === true) {
      setUpdateContactModalStatus({ open: false, error: false });
      getAllContacts();
    } else {
      setUpdateContactModalStatus({ open: true, error: true });
    }
  };

  const addContact = async (formPayload) => {
    console.log("FORM PAYLOAD", formPayload);
    const response = await fetch(
      `http://localhost:8080/api/v1/contact/create/`,
      {
        method: "POST",
        body: JSON.stringify(formPayload),
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok === true) {
      setAddContactModalStatus({ open: false, error: false });
      getAllContacts();
    } else {
      setAddContactModalStatus({ open: true, error: true });
    }
  };

  const addBulkContact = async (formPayload) => {
    console.log("FORM PAYLOAD", formPayload);
    const response = await fetch(
      `http://localhost:8080/api/v1/contact/createBulk/`,
      {
        method: "POST",
        body: JSON.stringify(formPayload),
        headers: { "Content-Type": "application/json" },
      }
    ).then((r) => r);
    console.log("BULK RESP", response);
    if (response.ok === true) {
      setBulkAddContactModalStatus({ open: false, error: false });
      getAllContacts();
    } else {
      setBulkAddContactModalStatus({ open: true, error: true });
    }
  };

  const getAllContacts = async () => {
    const response = await fetch(
      "http://localhost:8080/api/v1/contact/getAll"
    ).then((r) => r.json());
    console.log("resp", response);
    setResponse(response);
  };

  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <div className="contacts">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <h1>Contacts</h1>
        <MoreDetailsModal
          modalStatus={updateContactModalStatus}
          setModalStatus={setUpdateContactModalStatus}
          labels={{ itemTitle: "Contact", buttonLabel: "Update" }}
          itemData={singleContact}
          updateItem={updateContact}
          relationshipData={relationshipData}
          setEditMode={false}
        />
        <BulkUploader
          modalStatus={bulkAddContactModalStatus}
          setModalStatus={setBulkAddContactModalStatus}
          updateItem={addBulkContact}
        />
        <MoreDetailsModal
          modalStatus={addContactModalStatus}
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
          setModalStatus={setAddContactModalStatus}
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
