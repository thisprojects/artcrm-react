import "../App.css";
import NavBar from "../Components/NavBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "../Components/Table";
import MoreDetailsModal from "../Components/MoreDetailsModal";
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

const Tags = () => {
  const [resp, setResponse] = useState([]);

  const [modalStatus, setModalStatus] = useState({
    updateTagModalStatus: {
      open: false,
      error: false,
      label: "updateTagModalStatus",
    },
    addTagModalStatus: {
      open: false,
      error: false,
      label: "addTagModalStatus",
    },
  });

  const [singleTag, setSingleTag] = useState(null);
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

  const handleAddTag = () => {
    getRelationshipData();
    setModalStatus((state) => ({
      ...state,
      addTagModalStatus: {
        open: true,
        error: false,
        label: "addTagModalStatus",
      },
    }));
  };

  const multiDelete = async (payload) => {
    const response = await deleteItem(
      "http://localhost:8080/api/v1/tag/deleteMulti/",
      payload
    );
    if (response.ok === true) {
      getAllTags();
    }
  };

  const openModal = async (modalValue, itemId) => {
    const response = await getItems(
      `http://localhost:8080/api/v1/tag/getSingle/${itemId}`
    );
    setSingleTag(response);
    getRelationshipData();
    setModalStatus((state) => ({
      ...state,
      updateTagModalStatus: {
        open: modalValue,
        error: false,
        label: "updateTagModalStatus",
      },
    }));
  };

  const updateTag = async (formPayload) => {
    const response = await putItem(
      `http://localhost:8080/api/v1/tag/updatejson/${formPayload.id}/`,
      formPayload
    );
    if (response.ok === true) {
      setModalStatus((state) => ({
        ...state,
        updateTagModalStatus: {
          open: false,
          error: false,
          label: "updateTagModalStatus",
        },
      }));
      getAllTags();
    } else {
      setModalStatus((state) => ({
        ...state,
        updateTagModalStatus: {
          open: true,
          error: true,
          label: "updateTagModalStatus",
        },
      }));
    }
  };

  const addTag = async (formPayload) => {
    const response = await postItem(
      `http://localhost:8080/api/v1/tag/create/`,
      formPayload
    );
    if (response.ok === true) {
      setModalStatus((state) => ({
        ...state,
        addTagModalStatus: {
          open: false,
          error: false,
          label: "addTagModalStatus",
        },
      }));
      getAllTags();
    } else {
      setModalStatus((state) => ({
        ...state,
        addTagModalStatus: {
          open: true,
          error: true,
          label: "addTagModalStatus",
        },
      }));
    }
  };

  const getAllTags = async () => {
    const response = await getItems("http://localhost:8080/api/v1/tag/getAll");
    setResponse(response);
  };

  useEffect(() => {
    getAllTags();
  }, []);

  return (
    <div className="Tags">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <h1 className="section-heading">Tags</h1>
        <MoreDetailsModal
          modalStatus={modalStatus.updateTagModalStatus}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Tag", buttonLabel: "Update" }}
          itemData={singleTag}
          updateItem={updateTag}
          relationshipData={relationshipData}
          setEditMode={false}
        />
        <MoreDetailsModal
          modalStatus={modalStatus.addTagModalStatus}
          labels={{ itemTitle: "Tag", buttonLabel: "Add" }}
          setEditMode={true}
          itemData={{
            name: "",
            email: "",
            postCode: "",
            tags: [],
            contacts: [],
          }}
          addItem={addTag}
          setModalStatus={setModalStatus}
          relationshipData={relationshipData}
          updateItem={addTag}
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
              <Button onClick={handleAddTag}>Add Tags</Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Tags;
