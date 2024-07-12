import React, { SetStateAction, useEffect, useState } from "react";
import SearchInput from "@/app/components/Search";
import { searchIconSecondary } from "@/assets/icons";
import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
  GridPaginationModel,
  useGridApiRef,
} from "@mui/x-data-grid";
import { Chip } from "@mui/joy";
import { GridRowSelectionModel } from "@mui/x-data-grid";

interface RowData {
  [key: string]: any;
}

interface ReservationsProps {
  rowsData: RowData[];
  columns: string[];
  headers: string[];
  search: string;
  setSearch: React.Dispatch<SetStateAction<string>>;
  setReload: React.Dispatch<SetStateAction<boolean>>;
  handleSearch: (value: string) => void;
  loading: boolean;
  reload: boolean;
  setSeletedMovement: React.Dispatch<SetStateAction<GridRowSelectionModel | undefined>>;
}

interface Movement {
  movement_id: string;
  pickup_time: string;
  drop_location: string;
  company: string;
  pickup_location: string;
  return_time: string;
  passenger_name: string;
  phone: string;
  remark: string;
  car_number: string;
  driver: string;
  pickup_date: string;
  return_date: string;
  passenger_id: string;
}

const MovementReservations: React.FC<ReservationsProps> = ({
  rowsData,
  columns,
  headers,
  search,
  setSearch,
  handleSearch,
  loading,
  setReload,
  reload,
  setSeletedMovement,
}) => {
  const apiRef = useGridApiRef();

  const mapToFormData = (id: any): Movement => {
    const formatDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split("-").map((part) => parseInt(part, 10));
      return `${year}-${month}-${day}`;
    };

    const [pickUpDate, pickUpTime] = id.pickup_time.split(" ");
    const [returnDate, returnTime] = id.return_time.split(" ");
    return {
      movement_id: id.movement_id,
      pickup_time: pickUpTime,
      pickup_date: formatDate(pickUpDate),
      return_date: formatDate(returnDate),
      drop_location: id.drop_location,
      company: id.company,
      pickup_location: id.pickup_location,
      return_time: returnTime,
      passenger_name: id.passenger_name,
      phone: id.phone,
      remark: id.remark,
      car_number: id.car_number,
      driver: id.driver,
      passenger_id: id.passenger_id,
    };
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
    handleSearch(value);
  };

  const gridColumns: GridColDef[] = [
    ...columns.map((columnName, index) => ({
      field: columnName,
      headerName: headers[index],
      flex:
        index === 0 || index === 11 || index === 12 || index === 13 || columnName === "status"
          ? 0
          : undefined,
      width:
        index === 0 ||
        columnName === "car_name" ||
        columnName === "driver" ||
        columnName === "status"
          ? 150
          : 240,
      renderHeader: (params: GridColumnHeaderParams) => (
        <span className="text-[#0D141C] font-semibold pl-3">{headers[index]}</span>
      ),
      renderCell: (params: any) => {
        return (
          <div>
            {columnName === "status" ? (
              <Chip
                size="sm"
                variant="outlined"
                color={
                  params.row[columnName] === "Expired"
                    ? "danger"
                    : params.row[columnName] === "Active"
                    ? "success"
                    : "warning"
                }
              >
                {params.row[columnName]}
              </Chip>
            ) : (
              <>{params.row[columnName]}</>
            )}
          </div>
        );
      },
    })),
    
  ];

  
 

  return (
    <>
      <div>
        <SearchInput
          value={search}
          onChange={handleSearchInput}
          icon={searchIconSecondary}
          placeholder="Search by guest name, email, company..."
        />
        <br />
        <div className="my-5 w-full " style={{ height: "400px" }} id="datagrid-container">
          <DataGrid
            apiRef={apiRef}
            rows={rowsData}
            loading={loading}
            rowHeight={70}
            paginationModel={{ pageSize: rowsData.length, page: 0 }}
            columns={gridColumns}
            checkboxSelection
            disableMultipleRowSelection
            getRowId={(row) => row.movement_id}
            initialState={{
              sorting: {
                sortModel: [{ field: "status", sort: "asc" }], // Adjust 'asc' to 'desc' if needed
              },
            }}
            sx={{
              borderRadius: 3, // Adjust the value to achieve the desired rounding
              "& .MuiDataGrid-root": {
                borderRadius: "inherit",
              },
              // "& .MuiDataGrid-cell": {
              //   border: "1px solid gray", // Add border to each cell
              // },
              // "& .MuiDataGrid-columnHeaders": {
              //   borderBottom: "1px solid gray", // Add border to column headers
              // },
            }}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setSeletedMovement(newRowSelectionModel);
            }}
          />
        </div>
      </div>
      {/* <Modal
        open={edit}
        onClose={() => {
          setEdit(false);
        }}
      >
        <ModalDialog className="w-6/12 max-xl:w-8/12 max-lg:w-9/12 max-md:w-10/12 max-sm:w-full">
          <ModalClose />
          <DialogTitle>
            <span className="text-2xl">Edit Booking</span>
          </DialogTitle>
          <DialogContent>
            {editId && (
              <EditBooking
                setReload={setReload}
                reload={reload}
                setOpenModal={setEdit}
                initialData={editId}
              />
            )}
          </DialogContent>
        </ModalDialog>
      </Modal> */}
      {/* <Modal
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
          <DialogContent>Are you sure you want to delete this Movement?</DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" loading={loadingDelete} onClick={handleDelete}>
              Confirm
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setDel(false)}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal> */}
      {/* <Snackbar
        open={alert}
        autoHideDuration={5000}
        onClose={() => {
          setAlert(false);
        }}
      >
        <Box display="flex" alignItems="center">
          <Info /> {message}
          <IconButton onClick={() => setAlert(false)}>
            <Close />
          </IconButton>
        </Box>
      </Snackbar> */}
    </>
  );
};

export default MovementReservations;
