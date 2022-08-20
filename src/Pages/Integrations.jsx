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

const relationshipsToUpdate = ["tags", "contacts"];

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "inspect",
    numeric: false,
    disablePadding: false,
  },
];

const Integrations = () => {
  const [resp, setResponse] = useState([]);

  const [modalStatus, setModalStatus] = useState({
    updateIntegrationModalStatus: {
      open: false,
      error: false,
      label: "updateIntegrationModalStatus",
    },
    addIntegrationModalStatus: {
      open: false,
      error: false,
      label: "addIntegrationModalStatus",
    },
  });

  const [singleIntegration, setSingleIntegration] = useState(null);
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

  const handleAddIntegration = () => {
    getRelationshipData();
    setModalStatus((state) => ({
      ...state,
      addIntegrationModalStatus: {
        open: true,
        error: false,
        label: "addIntegrationModalStatus",
      },
    }));
  };

  const multiDelete = async (payload) => {
    const response = await deleteItem(
      "http://localhost:8080/api/v1/integration/deleteMulti/",
      payload
    );
    if (response.ok === true) {
      getAllIntegrations();
    }
  };

  const openModal = async (modalValue, itemId) => {
    const response = await getItems(
      `http://localhost:8080/api/v1/integration/getSingle/${itemId}`
    );
    setSingleIntegration(response);
    getRelationshipData();
    setModalStatus((state) => ({
      ...state,
      updateIntegrationModalStatus: {
        open: modalValue,
        error: false,
        label: "updateIntegrationModalStatus",
      },
    }));
  };

  const updateIntegration = async (formPayload) => {
    const response = await putItem(
      `http://localhost:8080/api/v1/integration/updatejson/${formPayload.id}/`,
      formPayload
    );
    if (response.ok === true) {
      setModalStatus((state) => ({
        ...state,
        updateIntegrationModalStatus: {
          open: false,
          error: false,
          label: "updateIntegrationModalStatus",
        },
      }));
      getAllIntegrations();
    } else {
      setModalStatus((state) => ({
        ...state,
        updateIntegrationModalStatus: {
          open: true,
          error: true,
          label: "updateIntegrationModalStatus",
        },
      }));
    }
  };

  const addIntegration = async (formPayload) => {
    const response = await postItem(
      `http://localhost:8080/api/v1/integration/create/`,
      formPayload
    );
    if (response.ok === true) {
      setModalStatus((state) => ({
        ...state,
        addIntegrationModalStatus: {
          open: false,
          error: false,
          label: "addIntegrationModalStatus",
        },
      }));
      getAllIntegrations();
    } else {
      setModalStatus((state) => ({
        ...state,
        addIntegrationModalStatus: {
          open: true,
          error: true,
          label: "addIntegrationModalStatus",
        },
      }));
    }
  };

  const getAllIntegrations = async () => {
    const response = await getItems(
      "http://localhost:8080/api/v1/integration/getAll"
    );
    setResponse(response);
  };

  useEffect(() => {
    getAllIntegrations();
  }, []);

  return (
    <div className="Integrations">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <h1 className="section-heading">Integrations</h1>
        <UpdateModal
          modalStatus={modalStatus.updateIntegrationModalStatus}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Integration", buttonLabel: "Update" }}
          itemData={singleIntegration}
          updateItem={updateIntegration}
          relationshipData={relationshipData}
          setEditMode={false}
        />
        <UpdateModal
          modalStatus={modalStatus.addIntegrationModalStatus}
          labels={{ itemTitle: "Integration", buttonLabel: "Add" }}
          setEditMode={true}
          itemData={{
            name: "",
            email: "",
            postCode: "",
            tags: [],
            contacts: [],
          }}
          addItem={addIntegration}
          setModalStatus={setModalStatus}
          relationshipData={relationshipData}
          updateItem={addIntegration}
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
              <Button onClick={handleAddIntegration}>Add Integrations</Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Integrations;
