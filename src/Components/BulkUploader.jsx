import "../App.css";
import { useState } from "react";
import Papa from "papaparse";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  border: "1px solid gray",
  boxShadow: 24,
  p: 4,
  overflow: "scroll",
  height: "500px",
};

function BulkUploader({ modalStatus, setModalStatus, updateItem }) {
  // State to store parsed data
  const [parsedData, setParsedData] = useState([]);

  console.log("modal status - bulk upload", modalStatus);

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
            <input
              type="file"
              name="file"
              onChange={changeHandler}
              accept=".csv"
              style={{ display: "block", margin: "10px auto" }}
            />
            <br />
            <br />

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
            <Button onClick={handleUpload}>Upload Data</Button>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default BulkUploader;
