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

const headCells = tableCellDictionary["Integrations"];

const { NEW_FORM_MODAL_STATUS, UPDATE_FORM_MODAL_STATUS } = ModalStatusLabel;
const { SUCCESS, FAIL } = NetworkRequestStatus;

const Integrations = () => {
  const [resp, setResponse] = useState<Array<CRMDataModel>>([]);
  const [loading, setLoading] = useState(true);

  const [modalStatus, setModalStatus] = useState<ISetModalStatus>(
    modalFactory()
  );

  const [singleIntegration, setSingleIntegration] = useState<CRMDataModel>({});
  const { getItems, postItem, putItem, deleteItem } = useNetworkRequest();

  const openAddIntegrationModal = () => {
    setModalStatus((state) => ({
      ...state,
      NEW_FORM_MODAL_STATUS: modalStatusFactory(NEW_FORM_MODAL_STATUS),
    }));
  };

  const multiDelete = async (payload: CRMDataModel) => {
    const response = await deleteItem(
      "/api/v1/integration/deleteMulti/",
      payload
    );
    if (response.ok === true) {
      setLoading(true);
      getAllIntegrations();
    }
  };

  const openUpdateModal = async (modalValue: boolean, itemId: string) => {
    const response = await getItems(`/api/v1/integration/getSingle/${itemId}`);
    setSingleIntegration(response);
    setModalStatus((state) => ({
      ...state,
      UPDATE_FORM_MODAL_STATUS: modalStatusFactory(UPDATE_FORM_MODAL_STATUS),
    }));
  };

  const updateIntegration = async (formPayload: CRMDataModel) => {
    let status = FAIL;
    const response = await putItem(
      `/api/v1/integration/updatejson/${formPayload.id}/`,
      formPayload
    );
    if (response.ok === true) {
      status = SUCCESS;
      setLoading(true);
      getAllIntegrations();
    }

    setModalStatus((state) => ({
      ...state,
      UPDATE_FORM_MODAL_STATUS: modalStatusFactory(
        UPDATE_FORM_MODAL_STATUS,
        status
      ),
    }));
  };

  const addIntegration = async (formPayload: CRMDataModel) => {
    let status = FAIL;
    const response = await postItem(`/api/v1/integration/create/`, formPayload);
    if (response.ok === true) {
      status = SUCCESS;
      setLoading(true);
      getAllIntegrations();
    }

    setModalStatus((state) => ({
      ...state,
      UPDATE_FORM_MODAL_STATUS: modalStatusFactory(
        UPDATE_FORM_MODAL_STATUS,
        status
      ),
    }));
  };

  const getAllIntegrations = async () => {
    const response = await getItems("/api/v1/integration/getAll");
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
    getAllIntegrations();
  }, []);

  return (
    <div className="Integrations">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <UpdateModal
          modalStatus={modalStatus[UPDATE_FORM_MODAL_STATUS]}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Integration", buttonLabel: "Update" }}
          itemData={singleIntegration}
          updateItem={updateIntegration}
          contactAndTagData={[]}
          setEditMode={false}
          uniqueItemAlreadyExists={uniqueItemAlreadyExists}
        />
        <UpdateModal
          modalStatus={modalStatus[NEW_FORM_MODAL_STATUS]}
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
                openModal={openUpdateModal}
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
                onClick={openAddIntegrationModal}
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
