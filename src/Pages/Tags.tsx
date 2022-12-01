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
import { ISetModalStatus } from "../Models/IModalStatus";
import { ModalStatusLabel, NetworkRequestStatus } from "../Models/Enums";
import { tableCellDictionary } from "../Utilities/tableCellDictionary";
import { modalFactory, modalStatusFactory } from "../Utilities/modalFactory";
import CRMDataModel from "../Models/CRMDataModel";

const headCells = tableCellDictionary["Tags"];
const { NEW_FORM_MODAL_STATUS, UPDATE_FORM_MODAL_STATUS } = ModalStatusLabel;
const { SUCCESS, FAIL } = NetworkRequestStatus;

const Tags = () => {
  const [resp, setResponse] = useState<Array<CRMDataModel>>([]);
  const [modalStatus, setModalStatus] = useState<ISetModalStatus>(
    modalFactory()
  );

  const [singleTag, setSingleTag] = useState<CRMDataModel>({});
  const { getItems, postItem, putItem, deleteItem } = useNetworkRequest();
  const [loading, setLoading] = useState(true);

  const openAddTagModal = () => {
    setModalStatus((state) => ({
      ...state,
      NEW_FORM_MODAL_STATUS: modalStatusFactory(NEW_FORM_MODAL_STATUS),
    }));
  };

  const multiDelete = async (payload: CRMDataModel) => {
    const response = await deleteItem("/api/v1/tag/deleteMulti/", payload);
    if (response.ok === true) {
      setLoading(true);
      getAllTags();
    }
  };

  const openUpdateModal = async (modalValue: boolean, itemId: string) => {
    const response = await getItems(`/api/v1/tag/getSingle/${itemId}`);
    setSingleTag(response);
    setModalStatus((state) => ({
      ...state,
      UPDATE_FORM_MODAL_STATUS: modalStatusFactory(UPDATE_FORM_MODAL_STATUS),
    }));
  };

  const updateTag = async (formPayload: CRMDataModel) => {
    let status = FAIL;
    const response = await putItem(
      `/api/v1/tag/updatejson/${formPayload.id}/`,
      formPayload
    );

    if (response.ok === true) {
      status = SUCCESS;
      setLoading(true);
      getAllTags();
    }

    setModalStatus((state) => ({
      ...state,
      UPDATE_FORM_MODAL_STATUS: modalStatusFactory(
        UPDATE_FORM_MODAL_STATUS,
        status
      ),
    }));
  };

  const addTag = async (formPayload: CRMDataModel) => {
    let status = FAIL;
    const response = await postItem(`/api/v1/tag/create/`, formPayload);

    if (response.ok === true) {
      status = SUCCESS;
      setLoading(true);
      getAllTags();
    }

    setModalStatus((state) => ({
      ...state,
      NEW_FORM_MODAL_STATUS: modalStatusFactory(NEW_FORM_MODAL_STATUS, status),
    }));
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
                openModal={openUpdateModal}
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
