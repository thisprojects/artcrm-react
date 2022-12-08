// Component from material.ui library
import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import { Order, IHeadCell } from "../../Models/TableInterfaces";
import CRMDataModel from "../../Models/CRMDataModel";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: string }, b: { [key in Key]: string }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: CRMDataModel[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface IEnhancedTable {
  headCells: Array<IHeadCell>;
  tableRowData: CRMDataModel[];
  openModal(itemId: string | null): Promise<void>;
  deleteItems(payload: Array<string>): Promise<void>;
  label: string;
}

const EnhancedTable: React.FC<IEnhancedTable> = ({
  headCells,
  tableRowData,
  openModal,
  deleteItems,
  label,
}) => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState<Array<string>>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState<Array<CRMDataModel>>([]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown, MouseEvent>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDelete = () => {
    deleteItems(selected);
    setSelected([]);
  };

  React.useEffect(() => {
    setRows(tableRowData);
  }, [tableRowData]);

  const applyFilter = (filterText: string) => {
    const filteredRows = tableRowData.filter(
      (item) =>
        (filterText?.length > 0 &&
          item?.firstName?.toLowerCase().includes(filterText?.toLowerCase())) ||
        item?.lastName?.toLowerCase().includes(filterText?.toLowerCase()) ||
        item?.postCode?.toLowerCase().includes(filterText?.toLowerCase()) ||
        item?.name?.toLowerCase().includes(filterText?.toLowerCase()) ||
        item?.venueName?.toLowerCase().includes(filterText?.toLowerCase()) ||
        item?.email?.toLowerCase().includes(filterText?.toLowerCase())
    );
    if (filteredRows.length > 0) {
      setRows(filteredRows);
    } else {
      setRows(tableRowData);
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id) as Array<string>;
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  interface ICustomEvent extends Element {
    parentElement: HTMLElement;
    value: string;
  }

  const handleClick = (event: MouseEvent, id: string) => {
    const target = event?.target as ICustomEvent;
    const viewMoreButtonIsTarget = target!
      .getAttribute("class")!
      .includes("viewMoreButton");
    const parentOfViewMoreButtonIsTarget = target!
      .parentElement!.getAttribute("class")!
      .includes("viewMoreButton");

    // Discount clicks to the button, we only want to handle background clicks to table rows (so they can be selected).
    if (viewMoreButtonIsTarget || parentOfViewMoreButtonIsTarget) {
      return null;
    }

    const selectedIndex = selected.indexOf(id);
    let newSelected: Array<string> = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleEdit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const target = event?.target as ICustomEvent;
    const itemId = target!.getAttribute("data-id");
    openModal(itemId);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event!.target!.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          applyFilter={applyFilter}
          handleDelete={handleDelete}
          label={label}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            {rows.length > 0 && (
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id as string);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) =>
                          handleClick(event as unknown as MouseEvent, row.id)
                        }
                        role="checkbox"
                        key={row.id}
                        data-testid={row.name || row.firstName}
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        {Object.keys(row).map((item, index) => {
                          return index === 1 ? (
                            <TableCell
                              component="th"
                              id={labelId}
                              key={row.id + index}
                              scope="row"
                              padding="none"
                            >
                              {row[item]}
                            </TableCell>
                          ) : index !== 0 ? (
                            <TableCell key={row.id + index} align="left">
                              {row[item]}
                            </TableCell>
                          ) : null;
                        })}
                        <TableCell className="viewMoreButton">
                          <Button
                            variant="outlined"
                            data-testid="view-edit"
                            data-id={row.id}
                            className="viewMoreButton"
                            onClick={handleEdit}
                          >
                            View / Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default EnhancedTable;
