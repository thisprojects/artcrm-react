import "../App.css";
import NavBar from "../Components/NavBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "../Components/Table";
import UpdateModal from "../Components/UpdateModal";
import useNetworkRequest from "../Hooks/useNetworkRequest";
import NoData from "../Components/NoData";
import { useState, useEffect } from "react";

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
  const [loading, setLoading] = useState(true);

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
  const { getItems, postItem, putItem, deleteItem } = useNetworkRequest();

  const handleAddIntegration = () => {
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
      "/api/v1/integration/deleteMulti/",
      payload
    );
    if (response.ok === true) {
      setLoading(true);
      getAllIntegrations();
    }
  };

  const openModal = async (modalValue, itemId) => {
    const response = await getItems(`/api/v1/integration/getSingle/${itemId}`);
    setSingleIntegration(response);
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
      `/api/v1/integration/updatejson/${formPayload.id}/`,
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
      setLoading(true);
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
    const response = await postItem(`/api/v1/integration/create/`, formPayload);
    if (response.ok === true) {
      setModalStatus((state) => ({
        ...state,
        addIntegrationModalStatus: {
          open: false,
          error: false,
          label: "addIntegrationModalStatus",
        },
      }));
      setLoading(true);
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
    const response = await getItems("/api/v1/integration/getAll");
    setResponse(response);
    setLoading(false);
  };

  const uniqueItemAlreadyExists = (name) => {
    return resp?.find(
      (item) => item?.name?.toLowerCase() === name?.toLowerCase()
    );
  };

  useEffect(() => {
    setLoading(true);
    getAllIntegrations();
  }, []);

  return (
    <div className="Integrations">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <UpdateModal
          modalStatus={modalStatus.updateIntegrationModalStatus}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Integration", buttonLabel: "Update" }}
          itemData={singleIntegration}
          updateItem={updateIntegration}
          contactAndTagData={[]}
          setEditMode={false}
          uniqueItemAlreadyExists={uniqueItemAlreadyExists}
        />
        <UpdateModal
          modalStatus={modalStatus.addIntegrationModalStatus}
          labels={{ itemTitle: "Integration", buttonLabel: "Add" }}
          setEditMode={true}
          itemData={{
            name: "",
          }}
          setModalStatus={setModalStatus}
          contactAndTagData={[]}
          updateItem={addIntegration}
          uniqueItemAlreadyExists={uniqueItemAlreadyExists}
        />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item md={10}>
            {resp.length > 0 ? (
              <Table
                headCells={headCells}
                tableRowData={resp}
                openModal={openModal}
                deleteItems={multiDelete}
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
                onClick={handleAddIntegration}
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
