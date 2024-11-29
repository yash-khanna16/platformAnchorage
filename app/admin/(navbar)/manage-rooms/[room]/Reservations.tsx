import React, { ReactEventHandler, SetStateAction, useEffect, useRef, useState } from "react";
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
import { Box, Typography, IconButton, DialogContent, DialogActions } from "@mui/material";
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
  Input,
  FormControl,
  FormLabel,
} from "@mui/joy";
import EditBooking from "./EditBooking";
import {
  AssignmentInd,
  Close,
  DeleteForever,
  Download,
  FileDownload,
  Info,
  OpenInNew,
  ReceiptLong,
} from "@mui/icons-material";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import {
  deleteBooking,
  fetchMealsByBookingId,
  fetchMovementByBookingId,
  fetchOccupancyByBookingId,
} from "@/app/actions/api";
import { useRouter } from "next/navigation";
import { getAuthAdmin } from "@/app/actions/cookie";
import CheckInForm from "@/app/admin/(navbar)/manage-rooms/[room]/CheckInForm";
import { data } from "autoprefixer";
import CheckInFormPDF from "./CheckInFormPDF";
import { saveAs } from "file-saver";
import { pdf, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import OrderFormDocument, { OrderDataType } from "./OrdersFormPDF";

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
  id: string;
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
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 100,
    page: 0,
  });
  const [editId, setEditId] = useState<FormDataReservation | null>(null);
  const [deleteId, setDeleteId] = useState("");
  const apiRef = useGridApiRef();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [generatePDF, setGeneratePDF] = useState<RowData | null>(null);
  const pdfDownloadRef = useRef<any>(null);
  const [preview, setPreview] = useState(false);
  const [previewData, setPreviewData] = useState();
  const [previewReceiptOrder, setPreviewReceiptOrder] = useState(false);
  const [previewReceiptOrderData, setPreviewReceiptOrderData] = useState<OrderDataType[]>([]);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

  async function fetchMeals(bookingId: string) {
    try {
      const res = await fetchMealsByBookingId(token, bookingId);
      return res;
    } catch (error) {
      console.log("error fetching meals for bookingID ", bookingId);
      return null;
    }
  }
  async function fetchMovement(bookingId: string) {
    try {
      const res = await fetchMovementByBookingId(token, bookingId);
      return res;
    } catch (error) {
      console.log("error fetching movement for bookingID ", bookingId);
      return null;
    }
  }
  async function fetchOccupancy(bookingId: string) {
    try {
      const res = await fetchOccupancyByBookingId(token, bookingId);
      return res;
    } catch (error) {
      console.log("error fetching occupancy for bookingID ", bookingId);
      return null;
    }
  }

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const mapToFormData = (id: any): FormDataReservation => {
    const formatDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split("-").map((part) => parseInt(part, 10));
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
      id: id.id,
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

  const downloadPdf = async (data: RowData) => {
    let guestName = data.name.split(" ");
    let filePrefix = "";
    guestName.map((word: string) => {
      filePrefix = filePrefix + word + "_";
    });
    const fileName = `${filePrefix}CheckInForm.pdf`;
    console.log("data: ", data);
    const blob = await pdf(<CheckInFormPDF data={data} />).toBlob();
    saveAs(blob, fileName);
  };

  const BoldHeaderCell = (props: any) => (
    <div style={{ fontWeight: "bold" }}>{props.colDef.headerName}</div>
  );
  let gridColumns: GridColDef[];
  const statusOrder = ["active", "upcoming", "expired"];

  const customSortComparator = (v1: string, v2: string) => {
    return statusOrder.indexOf(v1.toLowerCase()) - statusOrder.indexOf(v2.toLowerCase());
  };
  if (location === "movement") {
    gridColumns = [
      ...columns.map((columnName, index) => ({
        field: columnName,
        headerName: headers[index],
        hide: columnName === "email",
        // width: 100,
        flex:
          index === 0 || index === 11 || index === 12 || index === 13 || columnName === "status"
            ? 0
            : undefined,
        width:
          index === 11 ||
          index === 12 ||
          index === 13 ||
          columnName === "room" ||
          columnName === "status"
            ? 100
            : 160,
        sortable: columnName === "status" ? true : undefined,
        sortComparator: columnName === "status" ? customSortComparator : undefined,
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
  } else if (location === "masterList" || location === "masterMovement") {
    gridColumns = [
      ...columns.map((columnName, index) => ({
        field: columnName,
        headerName: headers[index],
        hide: columnName === "email",
        // width: 100,
        flex:
          index === 0 || index === 11 || index === 12 || index === 13 || columnName === "status"
            ? 0
            : undefined,
        width:
          index === 11 ||
          index === 12 ||
          index === 13 ||
          columnName === "room" ||
          columnName === "status" ||
          columnName === "phone" ||
          columnName === "driver" ||
          columnName === "car_name"
            ? 100
            : 160,
        sortable: columnName === "status" ? true : undefined,
        sortComparator: columnName === "status" ? customSortComparator : undefined,
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
  } else if (location === "auditLogs") {
    gridColumns = [
      ...columns.map((columnName, index) => ({
        field: columnName,
        headerName: headers[index],
        hide: columnName === "email",
        width: columnName === "time" ? 150 : 300,

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
  } else if (location === "logs") {
    gridColumns = [
      ...columns.map((columnName, index) => ({
        field: columnName,
        headerName: headers[index],
        hide: index === 7,
        flex:
          index === 0 || index === 11 || index === 12 || index === 13 || columnName === "status"
            ? 0
            : undefined,
        width:
          index === 11 ||
          index === 12 ||
          index === 13 ||
          columnName === "room" ||
          columnName === "status" ||
          columnName === "rank"
            ? 100
            : 160,
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
      {
        field: "edit",
        headerName: "Actions",
        sortable: false,
        align: "center",
        headerAlign: "center",
        width: 180,
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
              onClick={async () => {
                const meals = await fetchMeals(params.row.booking_id);
                const movements = await fetchMovement(params.row.booking_id);
                const occupancy = await fetchOccupancy(params.row.booking_id);

                console.log(movements);
                if (meals && movements && occupancy) {
                  const data = {
                    ...params.row,
                    meals: meals,
                    movements: movements,
                    occupancy: occupancy,
                  };
                  setPreview(true);
                  setPreviewData(data);
                }
              }}
            >
              <OpenInNew className="scale-75" />
            </IconButton>
            <IconButton
              style={{ marginRight: 5 }}
              onClick={async () => {
                const meals = await fetchMeals(params.row.booking_id);
                const movements = await fetchMovement(params.row.booking_id);
                const occupancy = await fetchOccupancy(params.row.booking_id);

                console.log(movements);
                if (meals && movements && occupancy) {
                  console.log("meals ", meals);
                  console.log("movements ", movements);
                  const data = {
                    ...params.row,
                    meals: meals,
                    movements: movements,
                    occupancy: occupancy,
                  };
                  downloadPdf(data);
                }
              }}
              // onClick={() => {
              //   setGeneratePDF(params.row);
              //   pdfDownloadRef.current = (
              //     <>
              //       <CheckInForm data={params.row} />
              //     </>
              //   );
              //   if (pdfDownloadRef.current) {
              //     pdfDownloadRef.current.click();
              //   }
              //   console.log("row: ", params.row);
              // }} // Implement your edit logic here
            >
              {/* <CheckInForm data={params.row} /> */}
              <FileDownload className="scale-75" />
            </IconButton>
            {/* <IconButton
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
              
              <DeleteForever className="scale-75 text-red-700" />
            </IconButton> */}
          </div>
        ),
      },
    ];
  } else {
    gridColumns = [
      ...columns.map((columnName, index) => ({
        field: columnName,
        headerName: headers[index],
        hide: index === 7,
        flex:
          index === 0 || index === 11 || index === 12 || index === 13 || columnName === "status"
            ? 0
            : undefined,
        width:
          index === 11 ||
          index === 12 ||
          index === 13 ||
          columnName === "room" ||
          columnName === "status" ||
          columnName === "rank"
            ? 100
            : 160,
        sortable: columnName === "status" ? true : undefined,
        sortComparator: columnName === "status" ? customSortComparator : undefined,
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
      {
        field: "edit",
        headerName: "Actions",
        sortable: false,
        align: "center",
        headerAlign: "center",
        width: 280,
        renderHeader: (params: GridColumnHeaderParams) => (
          <span
            className="text-[#0D141C] font-semibold pl-3 text-center"
            style={{ display: "block", width: "100%" }}
          >
            Actions
          </span>
        ),
        renderCell: (params) => (
          <div className="flex justify-end gap-x-1">
            {params.row.orders.length > 0 && (
              <IconButton
                className="w-[40px]"
                onClick={async () => {
                  console.log("orderdata: ", params.row.orders)
                  setPreviewReceiptOrderData(params.row.orders);
                  setPreviewReceiptOrder(true);
                }}
              >
                <ReceiptLong className="scale-75" />
              </IconButton>
            )}
            {params.row.document_url && (
              <IconButton
                className="w-[40px]"
                onClick={async () => {
                  const url_front = params.row.document_url;
                  const url_back = params.row.document_url_back;
                  if (url_front) {
                    try {
                      // Fetch the file as a blob
                      const response = await fetch(url_front);
                      const blob = await response.blob();

                      // Create a link and set it to download the blob
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(blob);
                      link.download = params.row.room + "_" + params.row.name; // Set a filename here if you want a specific name, e.g., 'document.pdf'
                      link.style.display = "none";

                      // Append the link, trigger click, and then remove it
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      // Revoke the blob URL after download
                      URL.revokeObjectURL(link.href);
                    } catch (error) {
                      console.error("Failed to download document:", error);
                    }
                  } else {
                    console.log("No document URL found");
                  }
                  if (url_back) {
                    try {
                      // Fetch the file as a blob
                      const response = await fetch(url_back);
                      const blob = await response.blob();
                      
                      // Create a link and set it to download the blob
                      const link = document.createElement('a');
                      link.href = URL.createObjectURL(blob);
                      link.download = params.row.room + "_" + params.row.name + "_back"; // Set a filename here if you want a specific name, e.g., 'document.pdf'
                      link.style.display = 'none';
                      
                      // Append the link, trigger click, and then remove it
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      // Revoke the blob URL after download
                      URL.revokeObjectURL(link.href);
                    } catch (error) {
                      console.error("Failed to download document:", error);
                    }
                  } else {
                    console.log("No document URL found");
                  }
                  if (url_back) {
                    try {
                      // Fetch the file as a blob
                      const response = await fetch(url_back);
                      const blob = await response.blob();
                      
                      // Create a link and set it to download the blob
                      const link = document.createElement('a');
                      link.href = URL.createObjectURL(blob);
                      link.download = params.row.room + "_" + params.row.name + "_back"; // Set a filename here if you want a specific name, e.g., 'document.pdf'
                      link.style.display = 'none';
                      
                      // Append the link, trigger click, and then remove it
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      // Revoke the blob URL after download
                      URL.revokeObjectURL(link.href);
                    } catch (error) {
                      console.error("Failed to download document:", error);
                    }
                  } else {
                    console.log("No document URL found");
                  }
                }}
              >
                <AssignmentInd className="scale-75" />
              </IconButton>
            )}
            <IconButton
              className="w-[40px]"
              onClick={async () => {
                const meals = await fetchMeals(params.row.booking_id);
                const movements = await fetchMovement(params.row.booking_id);
                const occupancy = await fetchOccupancy(params.row.booking_id);

                console.log(movements);
                if (meals && movements && occupancy) {
                  console.log("meals ", meals);
                  console.log("movements ", movements);
                  const data = {
                    ...params.row,
                    meals: meals,
                    movements: movements,
                    occupancy: occupancy,
                  };
                  setPreview(true);
                  setPreviewData(data);
                }
              }}
            >
              <OpenInNew className="scale-75" />
            </IconButton>
            <IconButton
              className="w-[40px]"
              onClick={async () => {
                const meals = await fetchMeals(params.row.booking_id);
                const movements = await fetchMovement(params.row.booking_id);
                const occupancy = await fetchOccupancy(params.row.booking_id);

                console.log(movements);
                if (meals && movements && occupancy) {
                  console.log("meals ", meals);
                  console.log("movements ", movements);
                  const data = {
                    ...params.row,
                    meals: meals,
                    movements: movements,
                    occupancy: occupancy,
                  };
                  downloadPdf(data);
                }
              }}
            >
              <FileDownload className="scale-75" />
            </IconButton>
            <IconButton
              className="w-[40px]"
              onClick={() => handleEdit(params.row)} // Implement your edit logic here
            >
              <EditIcon className="scale-75" />
            </IconButton>
            <IconButton
              className="w-[40px]"
              onClick={() => {
                setDel(true);
                setDeleteId(params.row.booking_id);
              }}
            >
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
      const res = await deleteBooking(token, deleteId, password);
      setLoadingDelete(false);
      setDel(false);
      setDeleteId("");
      setAlert(true);
      setReload(!reload);
      setMessage(res.message);
      setPassword("");
    } catch (error) {
      setLoadingDelete(false);
      setDel(false);
      setDeleteId("");
      setAlert(true);
      console.log("error: ", error);
      setMessage("Something went wrong, Please try again!");
      setPassword("");
    }
  };

  return (
    <>
      <div>
        {/* <CheckInForm data={rowsData[0]||null} /> */}
        <div className="mb-6">
          {location === "movement" && (
            <Typography className="text-4xl" component="div" fontWeight="bold">
              Search Reservations
            </Typography>
          )}
        </div>
        <SearchInput
          value={search}
          onChange={handleSearchInput}
          icon={searchIconSecondary}
          placeholder="Search by guest name, email, company..."
        />
        <br />

        {location === "movement" ? (
          <>
            <div className="my-5 w-full h-[400px]" id="datagrid-container">
              <DataGrid
                apiRef={apiRef}
                rows={rowsData}
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                rowHeight={50}
                loading={loading}
                columns={gridColumns}
                checkboxSelection
                getRowId={(row) => row.booking_id} // Specify the custom row ID
                initialState={{
                  sorting: {
                    sortModel: [{ field: "status", sort: "asc" }],
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
                  if (setSelectedGuest) {
                    const selectedBookingIds = newRowSelectionModel
                      .map((id) => {
                        const selectedRow = rowsData.find((row) => row.booking_id === id);
                        return selectedRow ? selectedRow.booking_id : null;
                      })
                      .filter((id) => id !== null);

                    setSelectedGuest(selectedBookingIds);
                  }
                }}
              />
            </div>
          </>
        ) : (
          <>
            {location === "masterMovement" ? (
              <div className="my-2 w-full h-screen" id="datagrid-container">
                <DataGrid
                  apiRef={apiRef}
                  rows={rowsData}
                  loading={loading}
                  columns={gridColumns}
                  rowHeight={70}
                  pagination
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  getRowId={(row) => row.passenger_id}
                  initialState={{
                    sorting: {
                      sortModel: [{ field: "status", sort: "asc" }],
                    },
                  }}
                  sx={{
                    borderRadius: 3,
                    "& .MuiDataGrid-root": {
                      borderRadius: "inherit",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "white",
                    },
                  }}
                />
              </div>
            ) : (
              <>
                {location === "auditLogs" ? (
                  <div className="my-2 w-full h-[72vh]" id="datagrid-container">
                    <DataGrid
                      apiRef={apiRef}
                      rows={rowsData}
                      loading={loading}
                      columns={gridColumns}
                      pagination
                      rowHeight={70}
                      getRowId={(row) => row.audit_id}
                      paginationModel={paginationModel}
                      onPaginationModelChange={setPaginationModel}
                      initialState={{
                        columns: {
                          columnVisibilityModel: {
                            email: false,
                          },
                        },
                      }}
                      sx={{
                        borderRadius: 3,
                        "& .MuiDataGrid-root": {
                          borderRadius: "inherit",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "white",
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="my-2 w-full h-[72vh]" id="datagrid-container">
                    <DataGrid
                      apiRef={apiRef}
                      rows={rowsData}
                      loading={loading}
                      columns={gridColumns}
                      pagination
                      rowHeight={70}
                      getRowId={(row) => row.booking_id}
                      paginationModel={paginationModel}
                      onPaginationModelChange={setPaginationModel}
                      initialState={{
                        sorting: {
                          sortModel: [{ field: "status", sort: "asc" }], // Will use the custom comparator for 'status'
                        },
                        columns: {
                          columnVisibilityModel: {
                            email: false,
                          },
                        },
                      }}
                      sx={{
                        borderRadius: 3,
                        "& .MuiDataGrid-root": {
                          borderRadius: "inherit",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "white",
                        },
                      }}
                    />
                    ;
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      <Modal
        open={edit}
        onClose={() => {
          setEdit(false);
        }}
      >
        <ModalDialog className="w-6/12 max-xl:w-8/12 max-lg:w-9/12 max-md:w-10/12 max-sm:w-full">
          <ModalClose style={{ zIndex: "10" }} />
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
          setPassword("");
        }}
      >
        <ModalDialog minWidth={380} variant="outlined" size="md">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <div className="">Enter your secret password to delete</div>
          <FormControl size="lg" className="space-y-1">
            <Input
              type="password"
              value={password}
              name="password"
              onChange={changePassword}
              fullWidth
              size="md"
              placeholder="Password"
            />
          </FormControl>
          <div className="flex space-x-2 justify-end w-full">
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
              onClick={() => {
                setDel(false);
                setPassword("");
              }}
            >
              Cancel
            </Button>
          </div>
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
        <span onClick={() => setAlert(false)} className="cursor-pointer hover:bg-[#f3eded]">
          <Close />
        </span>
      </Snackbar>
      <Modal open={preview} onClose={() => setPreview(false)}>
        <ModalDialog size="lg">
          <ModalClose />
          <DialogTitle>Preview PDF</DialogTitle>
          <DialogContent>
            <PDFViewer width={800} height={800}>
              <CheckInFormPDF data={previewData} />
            </PDFViewer>
          </DialogContent>
        </ModalDialog>
      </Modal>
      <Modal open={previewReceiptOrder} onClose={() => setPreviewReceiptOrder(false)}>
        <ModalDialog size="lg">
          <ModalClose />
          <DialogTitle>Preview Order</DialogTitle>
          <DialogContent className="overflow-hidden">
            <PDFViewer width={800} height={700}>
              <OrderFormDocument orderData={previewReceiptOrderData} />
            </PDFViewer>
            <div className="w-full flex justify-end">
              <PDFDownloadLink
                document={<OrderFormDocument orderData={previewReceiptOrderData} />}
                fileName={`Order_Summary_${previewReceiptOrderData[0]?.name}_${previewReceiptOrderData[0]?.room}.pdf`}
                style={{ textDecoration: "none" }}
              >
                {({ loading }) => (
                  <Button
                    className="my-4"
                    loading={loading}
                    variant="solid"
                    startDecorator={<Download fontSize="small" />}
                  >
                    Download PDF
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default Reservations;
