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
import { Box, Typography, IconButton, DialogContent, DialogActions } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Chip,
  DialogTitle,
  Divider,
  Modal,
  ModalClose,
  ModalDialog,
  Snackbar,
} from "@mui/joy";
import EditBooking from "./EditMovement";
import { Close, DeleteForever, Info } from "@mui/icons-material";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { deleteMovement } from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
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
  setSeletedMovement:React.Dispatch<SetStateAction<GridRowSelectionModel | undefined>>;
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
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);
  const [editId, setEditId] = useState<Movement | null>(null);
  const [deleteId, setDeleteId] = useState<{ movementId: string; passengerId: string }>({
    movementId: "",
    passengerId: "",
  });
  const apiRef = useGridApiRef();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

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

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });

  const gridColumns: GridColDef[] = [
    ...columns.map((columnName, index) => ({
      field: columnName,
      headerName: headers[index],
      flex:
        index === 0 || index === 11 || index === 12 || index === 13 || columnName === "status"
          ? 0
          : undefined,
      width:
        index === 0 || index === 11 || index === 12 || index === 13 || columnName === "status"
          ? 120
          : 200,
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
    // {
    //   field: "edit",
    //   headerName: "Actions",
    //   sortable: false,
    //   align: "center",
    //   headerAlign: "center",
    //   width: 120,
    //   renderHeader: (params: GridColumnHeaderParams) => (
    //     <span className="text-[#0D141C] font-semibold pl-3 text-center">Actions</span>
    //   ),
    //   renderCell: (params) => (
    //     <div>
    //       <IconButton onClick={() => handleEdit(params.row)} style={{ marginRight: 10 }}>
    //         <EditIcon className="scale-75" />
    //       </IconButton>
    //       <IconButton
    //         onClick={() => {
    //           setDel(true);
    //           setDeleteId({movementId:params.row.movement_id,passengerId:params.row.passenger_id});
    //         }}
    //       >
    //         <DeleteForever className="scale-75 text-red-700" />
    //       </IconButton>
    //     </div>
    //   ),
    // },
  ];

  const handleEdit = (id: any) => {
    setEdit(true);
    const formData: Movement = mapToFormData(id);
    setEditId(formData);
  };

  const handleDelete = async () => {
    try {
      setLoadingDelete(true);
      const res = await deleteMovement(token,deleteId.movementId,deleteId.passengerId);
      setMessage(res.message);
      setLoadingDelete(false);
      setDel(false);
      setDeleteId({
        movementId: "",
        passengerId: "",
      });
      setAlert(true);
      setReload(!reload);
      // setMessage(res.message);
    } catch (error) {
      setLoadingDelete(false);
      setDel(false);
      setDeleteId({
        movementId: "",
        passengerId: "",
      });
      setAlert(true);
      setMessage("Something went wrong, Please try again!");
    }
  };

  return (
    <>
      <div >
        <div className="mb-6">
          <Typography className="text-5xl max-[960px]:text-4xl" component="div" fontWeight="bold">
            Search Movement
          </Typography>
        </div>
        <SearchInput
          value={search}
          onChange={handleSearchInput}
          icon={searchIconSecondary}
          placeholder="Search by guest name, email, company..."
        />
        <br />
        <DataGrid
          apiRef={apiRef}
          rows={rowsData}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={loading}
          pageSizeOptions={[5, 10, 15]}
          autoHeight
          columns={gridColumns}
          pagination
          checkboxSelection
          disableMultipleRowSelection
          getRowId={(row) => row.movement_id}
          sx={{
            borderRadius: 3,
            "& .MuiDataGrid-root": {
              borderRadius: "inherit",
            },
          }}
          getRowClassName={() => "pl-3"}
          onRowSelectionModelChange={(newRowSelectionModel) => {
              setSeletedMovement(newRowSelectionModel);
          }}
        />
      </div>
      <Modal
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
      </Modal>
      <Snackbar
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
      </Snackbar>
    </>
  );
};

export default MovementReservations;
