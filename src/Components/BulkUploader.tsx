import "../App.css";
import { useState } from "react";
import Papa from "papaparse";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { ContactModalStatus } from "../Models/ModalStatus";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "1px solid gray",
  boxShadow: 24,
  p: 4,
  overflow: "scroll",
  height: "570px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

interface BulkUploaderProps {
  modalStatus: ContactModalStatus;
  setModalStatus: React.Dispatch<React.SetStateAction<ContactModalStatus>>;
  updateItem: (formPayload: string) => void;
}

function BulkUploader({
  modalStatus,
  setModalStatus,
  updateItem,
}: BulkUploaderProps) {
  // State to store parsed data
  const [parsedData, setParsedData] = useState([]);

  //State to store table Column name
  const [tableRows, setTableRows] = useState([]);

  //State to store the values
  const [values, setValues] = useState([]);

  const handleClose = () => {
    setParsedData([]);
    setTableRows([]);
    setValues([]);
    setModalStatus((state) => ({
      ...state,
      [modalStatus.label]: {
        open: false,
        error: false,
        label: modalStatus.label,
      },
    }));
  };

  const handleUpload = () => updateItem(parsedData);

  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });
        // Parsed Data Response in array format
        setParsedData(results.data);

        // Filtered Column Names
        setTableRows(rowsArray[0]);

        // Filtered Values
        setValues(valuesArray);
      },
    });
  };

  return (
    <Modal
      open={modalStatus.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {modalStatus.error ? (
          <p>Error</p>
        ) : (
          <>
            {tableRows.length === 0 && (
              <>
                <UploadFileIcon sx={{ fontSize: "350px", color: "#1976d2" }} />

                <label htmlFor="file">Choose CSV file to upload</label>
                <input
                  type="file"
                  name="file"
                  onChange={changeHandler}
                  accept=".csv"
                  style={{ display: "block", margin: "10px auto" }}
                />
                <span style={{ margin: "30px" }}>
                  CSV columns must be in format: "firstName, lastName, postCode,
                  email, age"
                </span>
                <br />
                <br />
              </>
            )}
            <table>
              <thead>
                <tr>
                  {tableRows.map((rows, index) => {
                    return <th key={index}>{rows}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {values.map((value, index) => {
                  return (
                    <tr key={index}>
                      {value.map((val, i) => {
                        return <td key={i}>{val}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {tableRows.length > 0 && (
              <Button sx={{ padding: "20px" }} onClick={handleUpload}>
                Upload Data
              </Button>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
}

export default BulkUploader;
