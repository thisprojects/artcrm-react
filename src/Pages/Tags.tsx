import "../App.css";
import NavBar from "../Components/NavBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "../Components/Table";
import UpdateModal from "../Components/FormModal";
import useNetworkRequest from "../Utilities/useNetworkRequest";
import NoData from "../Components/NoData";
import { useState, useEffect } from "react";
import { FormPayload } from "./Contacts";
import Contact from "../Models/Contacts";
import {
  ISetModalStatus,
  ModalStatusLabel,
  NetworkRequestStatus,
} from "../Models/ModalStatus";
import { ItemData } from "../Components/Form";
import { tableCellDictionary } from "../Utilities/tableCellDictionary";
import { modalFactory } from "../Utilities/modalFactory";

const headCells = tableCellDictionary["Tags"];
const { NEW_FORM_MODAL_STATUS, UPDATE_FORM_MODAL_STATUS } = ModalStatusLabel;
const { SUCCESS, FAIL } = NetworkRequestStatus;

const Tags = () => {
  const [resp, setResponse] = useState<Array<Contact>>([]);

  const [modalStatus, setModalStatus] = useState<ISetModalStatus>(
    modalFactory()
  );

  const [singleTag, setSingleTag] = useState<ItemData>({});
  const { getItems, postItem, putItem, deleteItem } = useNetworkRequest();
  const [loading, setLoading] = useState(true);

  const openAddTagModal = () => {
    setModalStatus((state) => ({
      ...state,
      addTagModalStatus: {
        open: true,
        error: false,
        label: "addTagModalStatus",
      },
    }));
  };

  const multiDelete = async (payload: FormPayload) => {
    const response = await deleteItem("/api/v1/tag/deleteMulti/", payload);
    if (response.ok === true) {
      setLoading(true);
      getAllTags();
    }
  };

  const openEditModal = async (modalValue: boolean, itemId: string) => {
    const response = await getItems(`/api/v1/tag/getSingle/${itemId}`);
    setSingleTag(response);
    setModalStatus((state) => ({
      ...state,
      updateTagModalStatus: {
        open: modalValue,
        error: false,
        label: "updateTagModalStatus",
      },
    }));
  };

  const updateTag = async (formPayload: FormPayload) => {
    const response = await putItem(
      `/api/v1/tag/updatejson/${formPayload.id}/`,
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
      setLoading(true);
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

  const addTag = async (formPayload: FormPayload) => {
    const response = await postItem(`/api/v1/tag/create/`, formPayload);
    if (response.ok === true) {
      setModalStatus((state) => ({
        ...state,
        addTagModalStatus: {
          open: false,
          error: false,
          label: "addTagModalStatus",
        },
      }));
      setLoading(true);
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
    const response = await getItems("/api/v1/tag/getAll");
    setResponse(response);
    setLoading(false);
  };

  const uniqueItemAlreadyExists = (name: string) => {
    return resp?.find(
      (item) => item?.name?.toLowerCase() === name?.toLowerCase()
    );
  };

  useEffect(() => {
    setLoading(true);
    getAllTags();
  }, []);

  return (
    <div className="Tags">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <UpdateModal
          modalStatus={modalStatus[UPDATE_FORM_MODAL_STATUS]}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Tag", buttonLabel: "Update" }}
          itemData={singleTag}
          updateItem={updateTag}
          contactAndTagData={[]}
          setEditMode={false}
          uniqueItemAlreadyExists={uniqueItemAlreadyExists}
        />
        <UpdateModal
          modalStatus={modalStatus[NEW_FORM_MODAL_STATUS]}
          labels={{ itemTitle: "Tag", buttonLabel: "Add" }}
          setEditMode={true}
          itemData={{
            name: "",
          }}
          setModalStatus={setModalStatus}
          contactAndTagData={[]}
          updateItem={addTag}
          uniqueItemAlreadyExists={uniqueItemAlreadyExists}
        />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item md={10}>
            {resp.length > 0 ? (
              <Table
                label="Tags"
                headCells={headCells}
                tableRowData={resp}
                openModal={openEditModal}
                deleteItems={multiDelete}
              />
            ) : (
              <NoData label={"Tag"} loading={loading} error={false} />
            )}
          </Grid>
          <Grid item md={2}>
            <Stack direction="column" spacing={2}>
              <Button
                sx={{ backgroundColor: "white" }}
                onClick={openAddTagModal}
              >
                Add Tags
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Tags;
