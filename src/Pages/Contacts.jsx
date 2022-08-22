import "../App.css";
import NavBar from "../Components/NavBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "../Components/Table";
import UpdateModal from "../Components/UpdateModal";
import BulkUploader from "../Components/BulkUploader";
import useNetworkRequest from "../Hooks/useNetworkRequest";
import NoData from "../Components/NoData";
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
  const [contactAndTagData, setContatAndTagData] = useState({});
  const { getItems, postItem, putItem, deleteItem } = useNetworkRequest();
  const [loading, setLoading] = useState(true);

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
      console.log("relationData", relationData);
      setContatAndTagData(relationData);
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
      setLoading(true);
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
      setLoading(true);
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
      setLoading(true);
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
      setLoading(true);
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
    setLoading(false);
  };

  const emailExists = (email) => {
    return resp?.find((item) => item.email === email);
  };

  useEffect(() => {
    setLoading(true);
    getAllContacts();
  }, []);

  return (
    <div className="contacts">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <UpdateModal
          modalStatus={modalStatus.updateContactModalStatus}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Contact", buttonLabel: "Update" }}
          itemData={singleContact}
          updateItem={updateContact}
          contactAndTagData={contactAndTagData}
          setEditMode={false}
          emailExists={emailExists}
        />
        <BulkUploader
          modalStatus={modalStatus.bulkAddContactModalStatus}
          setModalStatus={setModalStatus}
          updateItem={addBulkContact}
        />
        <UpdateModal
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
          emailExists={emailExists}
          addItem={addContact}
          setModalStatus={setModalStatus}
          contactAndTagData={contactAndTagData}
          updateItem={addContact}
        />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
          <Grid item md={10}>
            {resp.length > 0 ? (
              <Table
                headCells={headCells}
                tableRowData={resp}
                openModal={openModal}
                deleteItems={multiDelete}
                label={"Contacts"}
              />
            ) : (
              <NoData label={"Contact"} loading={loading} />
            )}
          </Grid>
          <Grid item md={2}>
            <Stack direction="column" spacing={2}>
              <Button
                sx={{ backgroundColor: "white" }}
                onClick={handleAddContact}
              >
                Add Single Contact
              </Button>
              <Button
                sx={{ backgroundColor: "white" }}
                onClick={handleBulkAddContact}
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
