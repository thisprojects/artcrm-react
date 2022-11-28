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
import NoData from "../Components/NoData";
import { FormPayload } from "./Contacts";
import { ISetModalStatus } from "../Models/ModalStatus";
import Contact from "../Models/Contacts";
import { ItemData } from "../Components/Form";

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
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
    id: "inspect",
    numeric: false,
    disablePadding: false,
  },
];

const relationshipsToUpdate = ["tags", "contacts"];

const Organisations = () => {
  const [resp, setResponse] = useState<Array<Contact>>([]);

  const [modalStatus, setModalStatus] = useState<ISetModalStatus>({
    updateOrganisationModalStatus: {
      open: false,
      error: false,
      label: "updateOrganisationModalStatus",
    },
    addOrganisationModalStatus: {
      open: false,
      error: false,
      label: "addOrganisationModalStatus",
    },
  });

  const [singleOrganisation, setSingleOrganisation] = useState<ItemData>({});
  const [contactAndTagData, setContactAndTagData] = useState({});
  const { getItems, postItem, putItem, deleteItem } = useNetworkRequest();
  const [loading, setLoading] = useState(true);

  const getRelationshipData = () => {
    const relationshipNetworkEndpoints = relationshipsToUpdate.map((item) =>
      item.replace("s", "")
    );
    relationshipNetworkEndpoints.forEach(async (item) => {
      const response = await getItems(`/api/v1/${item}/getAll`);
      const relationData: Record<string, Array<object>> = contactAndTagData;
      relationData[item] = response;
      setContactAndTagData(relationData);
    });
  };

  const handleAddOrganisation = () => {
    getRelationshipData();
    setModalStatus((state) => ({
      ...state,
      addOrganisationModalStatus: {
        open: true,
        error: false,
        label: "addOrganisationModalStatus",
      },
    }));
  };

  const multiDelete = async (payload: FormPayload) => {
    const response = await deleteItem(
      "/api/v1/organisation/deleteMulti/",
      payload
    );
    if (response.ok === true) {
      setLoading(true);
      getAllOrganisations();
    }
  };

  const openModal = async (modalValue: boolean, itemId: string) => {
    const response = await getItems(`/api/v1/organisation/getSingle/${itemId}`);
    setSingleOrganisation(response);
    getRelationshipData();
    setModalStatus((state) => ({
      ...state,
      updateOrganisationModalStatus: {
        open: modalValue,
        error: false,
        label: "updateOrganisationModalStatus",
      },
    }));
  };

  const updateOrganisation = async (formPayload: FormPayload) => {
    const response = await putItem(
      `/api/v1/organisation/updatejson/${formPayload.id}/`,
      formPayload
    );
    if (response.ok === true) {
      setModalStatus((state) => ({
        ...state,
        updateOrganisationModalStatus: {
          open: false,
          error: false,
          label: "updateOrganisationModalStatus",
        },
      }));
      setLoading(true);
      getAllOrganisations();
    } else {
      setModalStatus((state) => ({
        ...state,
        updateOrganisationModalStatus: {
          open: true,
          error: true,
          label: "updateOrganisationModalStatus",
        },
      }));
    }
  };

  const addOrganisation = async (formPayload: FormPayload) => {
    const response = await postItem(
      `/api/v1/organisation/create/`,
      formPayload
    );
    if (response.ok === true) {
      setModalStatus((state) => ({
        ...state,
        addOrganisationModalStatus: {
          open: false,
          error: false,
          label: "addorganisationModalStatus",
        },
      }));
      setLoading(true);
      getAllOrganisations();
    } else {
      setModalStatus((state) => ({
        ...state,
        addOrganisationModalStatus: {
          open: true,
          error: true,
          label: "addorganisationModalStatus",
        },
      }));
    }
  };

  const getAllOrganisations = async () => {
    const response = await getItems("/api/v1/organisation/getAll");
    setResponse(response);
    setLoading(false);
  };

  const uniqueItemAlreadyExists = (email: string) => {
    return resp?.find(
      (item) => item?.GetEmail()?.toLowerCase() === email?.toLowerCase()
    );
  };

  useEffect(() => {
    setLoading(true);
    getAllOrganisations();
  }, []);

  return (
    <div className="organisations">
      <NavBar />
      <Box sx={{ padding: "10px" }}>
        <UpdateModal
          modalStatus={modalStatus.updateOrganisationModalStatus}
          setModalStatus={setModalStatus}
          labels={{ itemTitle: "Organisation", buttonLabel: "Update" }}
          itemData={singleOrganisation}
          updateItem={updateOrganisation}
          contactAndTagData={contactAndTagData}
          setEditMode={false}
          uniqueItemAlreadyExists={uniqueItemAlreadyExists}
        />
        <UpdateModal
          modalStatus={modalStatus.addOrganisationModalStatus}
          labels={{ itemTitle: "Organisation", buttonLabel: "Add" }}
          setEditMode={true}
          itemData={{
            name: "",
            email: "",
            postCode: "",
            tags: [],
            contacts: [],
          }}
          setModalStatus={setModalStatus}
          contactAndTagData={contactAndTagData}
          updateItem={addOrganisation}
          uniqueItemAlreadyExists={uniqueItemAlreadyExists}
        />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item md={10}>
            {resp.length > 0 ? (
              <Table
                label="Organisations"
                headCells={headCells}
                tableRowData={resp}
                openModal={openModal}
                deleteItems={multiDelete}
              />
            ) : (
              <NoData label={"Organisation"} loading={loading} error={false} />
            )}
          </Grid>
          <Grid item md={2}>
            <Stack direction="column" spacing={2}>
              <Button
                sx={{ backgroundColor: "white" }}
                onClick={handleAddOrganisation}
              >
                Add Organisation
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Organisations;
