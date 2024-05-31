import React, { useState } from "react";
import SearchInput from "@/app/components/Search";
import { searchIconSecondary } from "@/assets/icons";
import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
  GridPaginationModel,
} from "@mui/x-data-grid";
import {
  Box,
  Typography,
  IconButton,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit"; // Import the EditIcon
import {
  Button,
  DialogTitle,
  Divider,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import EditBooking from "./EditBooking";
import { DeleteForever } from "@mui/icons-material";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

interface RowData {
  [key: string]: any;
}

interface ReservationsProps {
  rowsData: RowData[];
  columns: string[];
  headers: string[];
}

const Reservations: React.FC<ReservationsProps> = ({
  rowsData,
  columns,
  headers,
}) => {
  const [search, setSearch] = useState<string>("");
  const [filteredRows, setFilteredRows] = useState<RowData[]>(rowsData);
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
    const filtered = rowsData.filter((row) =>
      Object.values(row).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredRows(filtered);
  };

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });

  const BoldHeaderCell = (props: any) => (
    <div style={{ fontWeight: "bold" }}>{props.colDef.headerName}</div>
  );

  const gridColumns: GridColDef[] = [
    ...columns.map((columnName, index) => ({
      field: columnName,
      headerName: headers[index],
      flex: index === 0 ? 0 : 1,
      width: index === 0 ? 10 : 100,
      renderHeader: (params: GridColumnHeaderParams) => (
        <span className="text-[#0D141C] font-semibold pl-3">
          {headers[index]}
        </span>
      ),
    })),
    {
      field: "edit",
      headerName: "Actions",
      sortable: false,
      align: "center",
      headerAlign: "center",
      width: 120, // Set width to accommodate both icons
      renderHeader: (params: GridColumnHeaderParams) => (
        <span
          className="text-[#0D141C] font-semibold pl-3 text-center"
          style={{ display: "block", width: "100%" }}
        >
          Actions
        </span>
      ),
      renderCell: (params) => (
        <div>
          <IconButton
            onClick={() => handleEdit(params.row.id)} // Implement your edit logic here
            style={{ marginRight: 10 }}
          >
            <EditIcon className="scale-75" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            {/* Add your delete icon component here */}
            <DeleteForever className="scale-75 text-red-700" />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleEdit = (id: any) => {
    // Handle edit action here
    setEdit(true);
    console.log("Edit clicked for ID:", id);
  };
  const handleDelete = (id: any) => {
    // Handle edit action here
    setDel(true);
    console.log("Edit clicked for ID:", id);
  };

  return (
    <>
      <div>
        <div className="mb-6">
          <Typography variant="h3" component="div" fontWeight="bold">
            Search Reservations
          </Typography>
        </div>
        <SearchInput
          value={search}
          onChange={handleSearch}
          icon={searchIconSecondary}
          placeholder="Search by guest name"
        />
        <br />
        <DataGrid
          rows={filteredRows}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 15]} // Use pageSizeOptions instead
          autoHeight
          columns={gridColumns}
          pagination
          sx={{
            borderRadius: 3, // Adjust the value to achieve the desired rounding
            overflow: "hidden",
            "& .MuiDataGrid-root": {
              borderRadius: "inherit",
            },
          }}
          getRowClassName={() => "pl-3"} // Apply Tailwind padding utility class to rows
        />
      </div>
      <Modal
        open={edit}
        onClose={() => {
          setEdit(false);
        }}
      >
        <ModalDialog size="lg">
          <ModalClose />
          <DialogTitle>
            <span className="text-2xl">Edit Booking</span>
          </DialogTitle>
          <DialogContent className="">
            <EditBooking />
          </DialogContent>
        </ModalDialog>
      </Modal>
      <Modal
        open={del}
        onClose={() => {
          setDel(false);
        }}
      >
        <ModalDialog variant="outlined" size="md">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          {/* <DialogContent></DialogContent> */}

          <div className="">Are you sure you want to delete this booking?</div>
        <DialogActions>
            <Button variant="solid" color="danger" onClick={() => setDel(false)}>
              Confirm
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setDel(false)}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default Reservations;
