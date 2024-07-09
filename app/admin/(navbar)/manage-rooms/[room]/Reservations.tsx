import React, { SetStateAction, useEffect, useState } from "react";
import SearchInput from "@/app/components/Search";
import { searchIconSecondary } from "@/assets/icons";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridColumnHeaderParams,
  GridPaginationModel,
  useGridApiRef,
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
  Chip,
  DialogTitle,
  Divider,
  Modal,
  ModalClose,
  ModalDialog,
  Snackbar,
} from "@mui/joy";
import EditBooking from "./EditBooking";
import { Close, DeleteForever, Info } from "@mui/icons-material";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { deleteBooking } from "@/app/actions/api";
import { useRouter } from "next/navigation";
import { getAuthAdmin } from "@/app/actions/cookie";

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
  handleSearch: Function;
  loading: boolean;
  reload: boolean;
  location?: string;
  setSelectedGuest?: React.Dispatch<SetStateAction<GridRowSelectionModel[]>>;
}

interface FormDataReservation {
  booking_id: string;
  name: string;
  email: string;
  checkinDate: string;
  checkinTime: string;
  checkoutDate: string;
  checkoutTime: string;
  phoneNumber: string;
  companyName: string;
  vessel: string;
  rank: string;
  remarks: string;
  additionalInfo: string;
  breakfast: number;
  veg: number;
  nonVeg: number;
  originalEmail: string;
  room: string;
}

const Reservations: React.FC<ReservationsProps> = ({
  rowsData,
  columns,
  headers,
  search,
  setSearch,
  handleSearch,
  loading,
  setReload,
  reload,
  location,
  setSelectedGuest,
}) => {
  // const [filteredRows, setFilteredRows] = useState<RowData[]>(rowsData);
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);
  const [editId, setEditId] = useState<FormDataReservation | null>(null);
  const [deleteId, setDeleteId] = useState("");
  const apiRef = useGridApiRef();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

  const mapToFormData = (id: any): FormDataReservation => {
    const formatDate = (dateStr: string) => {
      const [day, month, year] = dateStr
        .split("-")
        .map((part) => parseInt(part, 10));
      return `${year}-${month}-${day}`;
    };

    const [checkinDate, checkinTime] = id.checkin.split(" ");
    const [checkoutDate, checkoutTime] = id.checkout.split(" ");
    console.log(checkinDate);
    console.log(checkinTime);
    console.log(checkoutDate);
    console.log(checkoutTime);
    return {
      booking_id: id.booking_id,
      name: id.name,
      email: id.email,
      checkinDate: formatDate(checkinDate),
      checkinTime: checkinTime,
      checkoutDate: formatDate(checkoutDate),
      checkoutTime: checkoutTime,
      phoneNumber: id.phone,
      companyName: id.company,
      vessel: id.vessel,
      rank: id.rank,
      remarks: id.remarks,
      additionalInfo: id.additional_info,
      breakfast: parseInt(id.breakfast),
      veg: parseInt(id.meal_veg),
      nonVeg: parseInt(id.meal_non_veg),
      originalEmail: id.email,
      room: id.room,
    };
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
    handleSearch(value);
    // const filtered = rowsData.filter((row) =>
    //   Object.values(row).some(
    //     (val) =>
    //       typeof val === "string" &&
    //       val.toLowerCase().includes(value.toLowerCase())
    //   )
    // );
    // setFilteredRows(filtered);
  };
  // useEffect(() => {
  //   apiRef.current.autosizeColumns({
  //     // columns: columns.slice(1),
  //     includeHeaders: true,
  //     includeOutliers: true,
  //   })
  // },[rowsData])

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });

  const BoldHeaderCell = (props: any) => (
    <div style={{ fontWeight: "bold" }}>{props.colDef.headerName}</div>
  );
  let gridColumns: GridColDef[];
  if (location === "movement") {
    gridColumns = [
      ...columns.map((columnName, index) => ({
        field: columnName,
        headerName: headers[index],
        // flex: index===,
        // width: 100,
        flex:
          index === 0 ||
          index === 11 ||
          index === 12 ||
          index === 13 ||
          columnName === "status"
            ? 0
            : undefined,
        width:
          index === 0 ||
          index === 11 ||
          index === 12 ||
          index === 13 ||
          columnName === "status"
            ? 120
            : 200,
        renderHeader: (params: GridColumnHeaderParams) => (
          <span className="text-[#0D141C] font-semibold pl-3">
            {headers[index]}
          </span>
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
  } else {
    gridColumns = [
      ...columns.map((columnName, index) => ({
        field: columnName,
        headerName: headers[index],
        // flex: index===,
        // width: 100,
        flex:
          index === 0 ||
          index === 11 ||
          index === 12 ||
          index === 13 ||
          columnName === "status"
            ? 0
            : undefined,
        width:
          index === 0 ||
          index === 11 ||
          index === 12 ||
          index === 13 ||
          columnName === "status"
            ? 120
            : 200,
        renderHeader: (params: GridColumnHeaderParams) => (
          <span className="text-[#0D141C] font-semibold pl-3">
            {headers[index]}
          </span>
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
      {
        field: "edit",
        headerName: "Actions",
        sortable: false,
        align: "center",
        headerAlign: "center",
        // flex: 1,
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
              onClick={() => handleEdit(params.row)} // Implement your edit logic here
              style={{ marginRight: 10 }}
            >
              <EditIcon className="scale-75" />
            </IconButton>
            <IconButton
              onClick={() => {
                setDel(true);
                setDeleteId(params.row.booking_id);
              }}
            >
              {/* Add your delete icon component here */}
              <DeleteForever className="scale-75 text-red-700" />
            </IconButton>
          </div>
        ),
      },
    ];
  }

  const handleEdit = (id: any) => {
    // Handle edit action here
    setEdit(true);
    const formData: FormDataReservation = mapToFormData(id);

    console.log("formdata: ", formData);
    setEditId(formData);
  };
  const handleDelete = async () => {
    // Handle edit action here
    // console.log("Delete clicked for ID:", deleteId);
    try {
      setLoadingDelete(true);
      // console.log(first)
      const res = await deleteBooking(token, deleteId);
      setLoadingDelete(false);
      setDel(false);
      setDeleteId("");
      setAlert(true);
      setReload(!reload);
      setMessage(res.message);
    } catch (error) {
      setLoadingDelete(false);
      setDel(false);
      setDeleteId("");
      setAlert(true);
      console.log("error: ", error);
      setMessage("Something went wrong, Please try again!");
    }
  };

  return (
    <>
      <div>
        <div className="mb-6">
          {location==="movement"?(<Typography
            className="text-4xl"
            component="div"
            fontWeight="bold"
          >
            Search Reservations
          </Typography>):(<Typography
            className="text-5xl max-[960px]:text-4xl"
            component="div"
            fontWeight="bold"
          >
            Search Reservations
          </Typography>)}
          
        </div>
        <SearchInput
          value={search}
          onChange={handleSearchInput}
          icon={searchIconSecondary}
          placeholder="Search by guest name, email, company..."
        />
        <br />
        {location === "movement" ? (<>
            <DataGrid
              apiRef={apiRef}
              rows={rowsData}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              loading={loading}
              pageSizeOptions={[5, 10, 15]} // Use pageSizeOptions instead
              autoHeight
              columns={gridColumns}
              pagination
              checkboxSelection
              getRowId={(row) => row.booking_id} // Specify the custom row ID
              sx={{
                borderRadius: 3, // Adjust the value to achieve the desired rounding
                // overflow: "scroll",
                "& .MuiDataGrid-root": {
                  borderRadius: "inherit",
                },
              }}
              getRowClassName={() => "pl-3"} // Apply Tailwind padding utility class to rows
              onRowSelectionModelChange={(newRowSelectionModel) => {
                if (setSelectedGuest) {
                  const selectedBookingIds = newRowSelectionModel.map((id) => {
                    const selectedRow = rowsData.find((row) => row.booking_id === id);
                    return selectedRow ? selectedRow.booking_id : null;
                  }).filter((id) => id !== null);
                  
                  setSelectedGuest(selectedBookingIds);
                }
              }}
            />
            </>
        ) : (
          
          <DataGrid
          apiRef={apiRef}
          rows={rowsData}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={loading}
          pageSizeOptions={[5, 10, 15]} // Use pageSizeOptions instead
          autoHeight
          columns={gridColumns}
          pagination

          getRowId={(row) => row.booking_id} // Specify the custom row ID
          sx={{
            borderRadius: 3, // Adjust the value to achieve the desired rounding
            // overflow: "scroll",
            "& .MuiDataGrid-root": {
              borderRadius: "inherit",
            },
          }}
          getRowClassName={() => "pl-3"}  // Apply Tailwind padding utility class to rows
          />
          
        )}
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
          <DialogContent className="">
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
          {/* <DialogContent></DialogContent> */}

          <div className="">Are you sure you want to delete this booking?</div>
          <DialogActions>
            <Button
              variant="solid"
              color="danger"
              loading={loadingDelete}
              onClick={() => {
                handleDelete();
              }}
            >
              Confirm
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setDel(false)}
            >
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
        {" "}
        <Info /> {message}
        <span
          onClick={() => setAlert(false)}
          className="cursor-pointer hover:bg-[#f3eded]"
        >
          <Close />
        </span>
      </Snackbar>
    </>
  );
};

export default Reservations;
