import {
  editMovement,
  searchAllGuests,
  deletePassenger,
  fetchAvailableCars,
  fetchAvailableDrivers,
} from "@/app/actions/api";
import {
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  FormHelperText,
  Modal,
  ModalClose,
  Divider,
  ModalDialog,
  Option,
  Snackbar,
  Table,
  ButtonGroup,
} from "@mui/joy";
import Reservations from "../manage-rooms/[room]/Reservations";
import { Box, Typography, IconButton, DialogActions } from "@mui/material";
import Input from "@mui/joy/Input";
import Checkbox from "@mui/joy/Checkbox";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { CheckCircle, Close, Info, Stop } from "@mui/icons-material";
import { getAuthAdmin } from "@/app/actions/cookie";
import { Select, MenuItem } from "@mui/joy";
import { Cancel, WarningRounded } from "@mui/icons-material";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { deleteMovementByMovementId } from "@/app/actions/api";
import { stopIcon } from "@/assets/icons";
import zIndex from "@mui/material/styles/zIndex";

type MovementType = {
  movement_id: string;
  pickup_time: string;
  drop_location: string;
  pickup_location: string;
  return_time: string;
  car_number: string;
  driver: string;
  car_name: string;
  passengers: {
    booking_id: string;
    passenger_id: string;
    name: string;
    phone: string;
    remark: string;
    company: string;
    external_booking: boolean;
  }[];
};

type EditMovementType = {
  movement_id: string;
  pickup_time: string;
  drop_location: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  return_time: string;
  car_number: string;
  driver: string;
  car_name: string;
  passengers: {
    booking_id: string;
    passenger_id: string;
    name: string;
    phone: string;
    remark: string;
    external_booking: boolean;
    company: string;
  }[];
};

type ReservationType = {
  additional_info: string | null;
  booking_id: string;
  breakfast: string | null;
  checkin: string;
  checkout: string;
  company: string;
  email: string;
  guest_email: string;
  meal_non_veg: number;
  meal_veg: number;
  name: string;
  phone: string;
  rank: string | null;
  remarks: string;
  room: string;
  vessel: string;
};

interface EditMovementProps {
  selectedData: MovementType;
  reload: boolean;
  setReload: React.Dispatch<SetStateAction<boolean>>;
}

type PassengerType = {
  name: string;
  phoneNumber: string;
  remark: string;
  company: string;
  external_booking: boolean;
};

type GuestType = {
  additional_info?: string | null;
  booking_id?: string;
  breakfast?: string | null;
  checkin?: string;
  checkout?: string;
  company?: string;
  email?: string;
  guest_email?: string;
  meal_non_veg?: number;
  meal_veg?: number;
  name?: string;
  phone?: string;
  rank?: string | null;
  remarks?: string;
  room?: string;
  vessel?: string;
  remark?: string;
};

type ErrorType = {
  driverName: string;
  carName: string;
  pickUpLocation: string;
  dropLocation: string;
  pickUpDate: string;
  pickUpTime: string;
  returnDate: string;
  returnTime: string;
  passengerNumber: string;
};

type Conflict = {
  movement_id: string;
  pickup_location: string;
  pickup_time: string; // Use string for ISO date strings
  return_time: string; // Use string for ISO date strings
  car_number: string;
  driver: string;
  drop_location: string;
};

const Edit: React.FC<EditMovementProps> = ({ selectedData, reload, setReload }) => {
  const formatDateString = (dateString: string) => {
    const [day, month, year] = dateString.split("-");
    const date = new Date(`${year}-${month}-${day}`);
    const formattedYear = date.getFullYear();
    const formattedMonth = `0${date.getMonth() + 1}`.slice(-2); // Adding 1 because months are zero-indexed
    const formattedDay = `0${date.getDate()}`.slice(-2);
    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
  };
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  const columns = [
    "name",
    "room",
    "status",
    "checkin",
    "checkout",
    "email",
    "phone",
    "company",
    "rank",
  ];
  const headers = [
    "Name",
    "Room",
    "Status",
    "Check In",
    "Check Out",
    "Email",
    "Phone",
    "Company",
    "Rank",
  ];
  const [pickup_date, pickup_time] = selectedData.pickup_time.split(" ");
  const [return_date, return_time] = selectedData.return_time.split(" ");
  const [formData, setFormData] = useState<EditMovementType>({
    ...selectedData,
    pickup_date: formatDateString(pickup_date),
    pickup_time: pickup_time,
    return_date: formatDateString(return_date),
    return_time: return_time,
  });
  const [checkBox, setCheckBox] = useState(false);
  const [token, setToken] = useState("");
  const [driverCarLoading, setDriverCarLoading] = useState(true);
  const [errors, setErrors] = useState<Partial<ErrorType>>({
    driverName: "",
    carName: "",
    pickUpLocation: "",
    dropLocation: "",
    pickUpDate: "",
    pickUpTime: "",
    returnDate: "",
    returnTime: "",
    passengerNumber: "",
  });
  const [manualPassenger, setManualPassenger] = useState<PassengerType[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);
  const [newDriver, setNewDriver] = useState(formData.driver);
  const [newCar, setNewCar] = useState(formData.car_number);
  const [del, setDel] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [password,setPassword]=useState("")
  const [alert, setAlert] = useState(false);
  const [passengerModal, setPassengerModal] = useState(false);
  const [message, setMessage] = useState("");
  const [rows, setRows] = useState<ReservationType[]>([]);
  const [filteredRows, setFilteredRows] = useState<ReservationType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedGuest, setSelectedGuest] = useState<GridRowSelectionModel[]>([]);
  const [manually, setManually] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState<GuestType[]>([]);
  const [delId, setDelId] = useState<string | undefined>("");
  const [delPassenger, setDelPassenger] = useState(false);
  const [manualDel, setManualDel] = useState(false);
  const [delMovement, setDelMovement] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [manualDelId, setManualDelId] = useState<PassengerType>();
  const [manualErrors, setManualErrors] = useState<Partial<{ name: string; phone: string }>>({
    name: "",
    phone: "",
  });
  const [passengerDetails, setPassengerDetails] = useState({
    name: "",
    phoneNumber: "",
    remark: "",
    company: "",
    external_booking: true,
  });
  const [errorModal, setErrorModal] = useState(false);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  useEffect(() => {
    setFormData({
      ...selectedData,
      pickup_date: formatDateString(pickup_date),
      pickup_time: pickup_time,
      return_date: formatDateString(return_date),
      return_time: return_time,
    });
    setNewDriver(selectedData.driver);
    setNewCar(selectedData.car_number);
    setCheckBox(false);
    console.log(formData);
  }, [selectedData]);

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

  useEffect(() => {
    const getDriverCar = async () => {
      const pickUpDateTime = `${formData.pickup_date}T${formData.pickup_time}`;
      const returnDateTime = `${formData.return_date}T${formData.return_time}`;
      const cars = await fetchAvailableCars(token, pickUpDateTime, returnDateTime);
      const drivers = await fetchAvailableDrivers(token, pickUpDateTime, returnDateTime);
      console.log(cars, drivers);
      const carsNumber = cars.map((data: { name: string; number: string }) => data.number);
      const driverName = drivers.map((data: { name: string; phone: string }) => data.name);
      setAvailableCars(carsNumber);
      setAvailableDrivers(driverName);
      setDriverCarLoading(false);
    };

    if (checkBox) {
      setDriverCarLoading(true);
      getDriverCar();
    } else {
      setDriverCarLoading(true);
      setNewDriver(formData.driver);
      setNewCar(formData.car_number);
    }
  }, [checkBox]);

  useEffect(() => {
    setCheckBox(false);
  }, [formData.pickup_date, formData.pickup_time, formData.return_date, formData.return_time]);

  const handleChangeDriver = (event: React.SyntheticEvent | null, newValue: string | null) => {
    if (newValue) {
      setNewDriver(newValue);
    }
  };

  const changePassword = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setPassword(e.target.value);
  }

  const handleChangeCar = (event: React.SyntheticEvent | null, newValue: string | null) => {
    if (newValue) {
      setNewCar(newValue);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleChangeManually = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPassengerDetails((prevState) => ({
      ...prevState,
      [name]: name === "phoneNumber" ? value.replace(/\D/g, "").slice(0, 10) : value,
    }));
  };
  const handleChangePassenger = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    passenger_id: string
  ) => {
    const { name, value } = e.target;
    const newPassenger = formData.passengers.map(
      (data: {
        passenger_id: string;
        booking_id: string;
        name: string;
        phone: string;
        remark: string;
        company: string;
        external_booking: boolean;
      }) => {
        if (data.passenger_id === passenger_id) {
          return { ...data, [name]: value };
        } else {
          return data;
        }
      }
    );
    setFormData((prevData) => ({
      ...prevData,
      passengers: newPassenger,
    }));
  };

  const handlePassengerDelete = async () => {
    try {
      setLoadingDelete(true);
      const res = await deletePassenger(token, formData.movement_id, deleteId,password);
      setMessage(res.message);
      if (res.message === "Passenger and related records deleted successfully.") {
        const newPassengersList = formData.passengers.filter(
          (data) => data.passenger_id !== deleteId
        );
        setFormData({ ...formData, passengers: newPassengersList });
      }
      setLoadingDelete(false);
      setDel(false);
      setDeleteId("");
      setAlert(true);
      setMessage(res.message);
      setPassword("")
    } catch (error) {
      setLoadingDelete(false);
      setDel(false);
      setDeleteId("");
      setAlert(true);
      setMessage("Something went wrong, Please try again!");
      setPassword("")
    }
  };
  const handleDelete = () => {
    const updatedPassengers = selectedPassenger.filter((row) => row.booking_id !== delId);
    setSelectedPassenger(updatedPassengers);
    setDelPassenger(false);
  };
  const handleManualDelete = () => {
    const updatedPassengers = manualPassenger.filter((row) => row !== manualDelId);
    setManualPassenger(updatedPassengers);
    setManualDel(false);
  };

  const handleGuest = () => {
    const newPassengers: GuestType[] = selectedGuest
      .map((selectedUser) => {
        const newBooking = selectedUser.toString();
        const passenger = rows.find((row) => row.booking_id === newBooking);
        if (passenger) {
          return {
            ...passenger,
            remark: "",
          };
        }
        return null;
      })
      .filter((passenger) => passenger !== null) as GuestType[];

    const updatedPassengers = [...selectedPassenger];

    newPassengers.forEach((newPassenger) => {
      const existingPassengerIndex = updatedPassengers.findIndex(
        (passenger) => passenger.booking_id === newPassenger.booking_id
      );
      if (existingPassengerIndex !== -1) {
        updatedPassengers[existingPassengerIndex] = {
          ...updatedPassengers[existingPassengerIndex],
          ...newPassenger,
        };
      } else {
        updatedPassengers.push(newPassenger);
      }
    });

    setSelectedPassenger(updatedPassengers);
    setPassengerModal(false);
  };

  useEffect(() => {
    if (token !== "") {
      getGuests();
    }
  }, [reload, token]);

  async function getGuests() {
    try {
      let fetchedRows = await searchAllGuests(token);
      console.log(fetchedRows);

      const currentTime = new Date();

      fetchedRows = fetchedRows.map((row: ReservationType) => {
        const checkinTime = new Date(row.checkin);
        const checkoutTime = new Date(row.checkout);

        let status;
        if (checkoutTime < currentTime) {
          status = "Expired";
        } else if (checkinTime > currentTime) {
          status = "Upcoming";
        } else {
          status = "Active";
        }

        return {
          ...row,
          checkin: formatDate(row.checkin),
          checkout: formatDate(row.checkout),
          status: status,
        };
      });

      setRows(fetchedRows);
      setFilteredRows(fetchedRows);
    } catch (error) {
      console.log(error);
    }
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Partial<ErrorType> = {};
    if (formData.pickup_location === "") {
      newErrors.pickUpLocation = "Please choose a Pick Up Location";
    }
    const pickUpDateTime = new Date(`${formData.pickup_date}T${formData.pickup_time}`);
    const returnDateTime = new Date(`${formData.return_date}T${formData.return_time}`);
    if (pickUpDateTime > returnDateTime) {
      newErrors.returnDate = "Return Date and Time is smaller than Pick Up";
      newErrors.returnTime = "Return Date and Time is smaller than Pick Up";
    }
    const newManualPassenger = manualPassenger.map((entry: PassengerType) => {
      return {
        passenger_id: null,
        booking_id: null,
        name: entry.name,
        phone: entry.phoneNumber,
        remark: entry.remark,
        company: entry.company,
      };
    });
    const newSelectedPassenger = selectedPassenger.map((entry: GuestType) => {
      return {
        passenger_id: null,
        booking_id: entry.booking_id,
        name: entry.name,
        phone: entry.phone,
        remark: entry.remark,
        company: entry.company,
      };
    });
    const allPassengerList = [
      ...newManualPassenger,
      ...newSelectedPassenger,
      ...formData.passengers,
    ];
    if (allPassengerList.length === 0) {
      newErrors.passengerNumber = "Add atleast one passenger to continue";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setErrors({
        driverName: "",
        carName: "",
        pickUpLocation: "",
        dropLocation: "",
        pickUpDate: "",
        pickUpTime: "",
        returnDate: "",
        returnTime: "",
        passengerNumber: "",
      });
    }
    setSubmitLoading(true);
    const dataSend = {
      movement_id: formData.movement_id,
      pickup_location: formData.pickup_location,
      pickup_time: pickUpDateTime,
      return_time: returnDateTime,
      drop_location: formData.drop_location,
      driver: newDriver,
      car_number: newCar,
      passengers: allPassengerList,
    };
    console.log(dataSend)
    try {
      const res = await editMovement(token, dataSend);
      setMessage(res.message);
      setAlert(true);
      setMessage(res.message);
      console.log("res: ", res);
      if (res.message === "Conflicting Movements!") {
        setErrorModal(true);
        setConflicts(res.conflicts);
      } else {
        setReload(!reload);
        setOpenConfirm(true);
      }
      setManualPassenger([]);
      setSelectedPassenger([]);
      setSubmitLoading(false);
    } catch (error) {
      setSubmitLoading(false);
      setAlert(true);
      setMessage("Something went wrong, Please try again later!");
      console.log("error: ", error);
    }
    console.log("Form submitted: ", dataSend);
  };

  const handleManually = () => {
    const manualError: Partial<{ name: string; phone: string }> = {};
    if (passengerDetails.name === "" && passengerDetails.phoneNumber === "") {
      manualError.name = "Enter name to continue";
      manualError.phone = "Enter phone number to continue";
    } else if (passengerDetails.name === "") {
      manualError.name = "Enter name to continue";
    } else if (passengerDetails.phoneNumber === "") {
      manualError.phone = "Enter phone number to continue";
    }
    if (Object.keys(manualError).length > 0) {
      setManualErrors(manualError);
      return;
    }
    setManualErrors({ name: "", phone: "" });
    setManualPassenger([...manualPassenger, passengerDetails]);
    console.log(manualPassenger);
    setManually(false);
    setPassengerDetails({
      name: "",
      phoneNumber: "",
      remark: "",
      company: "",
      external_booking: true,
    });
  };
  const handlePassengerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    bookingId: string | undefined
  ) => {
    console.log(bookingId);
    setSelectedPassenger((prevSelectedPassenger) =>
      prevSelectedPassenger.map((guest) =>
        guest.booking_id === bookingId ? { ...guest, remark: e.target.value } : guest
      )
    );
  };

  const handleSearch = () => {
    if (search.trim() === "") {
      setFilteredRows(rows);
    } else {
      const lowercasedSearch = search.toLowerCase();
      const filtered = rows.filter((row) =>
        columns.some((column) =>
          row[column as keyof ReservationType]?.toString().toLowerCase().includes(lowercasedSearch)
        )
      );
      setFilteredRows(filtered);
    }
  };

  const handleStop = async () => {
    const currentTime = new Date();
    const pickUpTime = `${formData.pickup_date}T${formData.pickup_time}`;
    const pickupDateTime = new Date(pickUpTime);
    if (pickupDateTime < currentTime) {
      const currentStringTime = formatDate(currentTime.toString());
      const [newReturnDate, newReturnTime] = currentStringTime.split(" ");
      const dataSend = {
        movement_id: formData.movement_id,
        pickup_location: formData.pickup_location,
        pickup_time: new Date(pickUpTime),
        return_time: new Date(`${formatDateString(newReturnDate)}T${newReturnTime}`),
        drop_location: formData.drop_location,
        driver: newDriver,
        car_number: newCar,
        passengers: formData.passengers,
      };
      try {
        console.log("datasend: ", dataSend);
        const res = await editMovement(token, dataSend);
        setMessage(res.message);
        setAlert(true);
        setMessage(res.message);
        console.log("res: ", res);
        if (res.message === "Conflicting Movements!") {
          setErrorModal(true);
          setConflicts(res.conflicts);
        } else {
          setReload(!reload);
          setOpenConfirm(true);
        }
        setSubmitLoading(false);
      } catch (error) {
        setSubmitLoading(false);
        setAlert(true);
        setMessage("Something went wrong, Please try again later!");
        console.log("error: ", error);
      }
    } else {
      setMessage("Can't stop an upcoming movement");
      setAlert(true);
    }
  };

  const handleDelay = async (delay: number) => {
    const returnTime = `${formData.return_date}T${formData.return_time}`;
    let returnDateTime = new Date(returnTime);
    returnDateTime.setHours(returnDateTime.getHours() + delay);
    const pickUpTime = `${formData.pickup_date}T${formData.pickup_time}`;
    const newReturnDateTime = formatDate(returnDateTime.toString());
    const [newReturnDate, newReturnTime] = newReturnDateTime.split(" ");
    const dataSend = {
      movement_id: formData.movement_id,
      pickup_location: formData.pickup_location,
      pickup_time: new Date(pickUpTime),
      return_time: new Date(`${formatDateString(newReturnDate)}T${newReturnTime}`),
      drop_location: formData.drop_location,
      driver: newDriver,
      car_number: newCar,
      passengers: formData.passengers,
    };
    try {
      const res = await editMovement(token, dataSend);
      setMessage(res.message);
      setAlert(true);
      setMessage(res.message);
      console.log("res: ", res);
      if (res.message === "Conflicting Movements!") {
        setErrorModal(true);
        setConflicts(res.conflicts);
      } else {
        setReload(!reload);
        setOpenConfirm(true);
      }
      setSubmitLoading(false);
    } catch (error) {
      setSubmitLoading(false);
      setMessage("Something went wrong, Please try again later!");
      setAlert(true);
      console.log("error: ", error);
    }
  };
  const deleteMovement = async () => {
    setDelMovement(false);
    try {
      const res = await deleteMovementByMovementId(token, formData.movement_id,password);
      if (res.message === "Movement and related data deleted successfully!") {
        setDeleteConfirm(true);
      }
      setMessage(res.message);
      setAlert(true);
      setReload(!reload);
      console.log("res: ", res);
      setSubmitLoading(false);
      setPassword("")
    } catch (error) {
      setSubmitLoading(false);
      setMessage("Something went wrong, Please try again later!");
      setAlert(true);
      setPassword("")
      console.log("error: ", error);
    }
  };

  return (
    <div className="mt-10 border p-5 rounded-md relative">
      <div
        onClick={(event) => {
          event.stopPropagation();
          setDelMovement(true);
        }}
        className="absolute -right-[18px] rounded-full z-20 -top-[20px] text-slate-400  hover:bg-red-50 p-2 "
      >
        <Cancel />
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-lg:grid-cols-1">
        <Typography
          className="text-4xl  mb-2 max-[960px]:text-3xl"
          component="div"
          fontWeight="bold"
        >
          Movement Details
        </Typography>
        <div className="flex justify-end w-full max-sm:justify-normal">
          <button
            onClick={handleStop}
            type="button"
            className="border-red-500 flex items-center text-red-600 border rounded-s-md p-3 hover:bg-red-100"
          >
            {stopIcon}
            <div className="pl-2">Stop</div>
          </button>
          <button
            onClick={() => handleDelay(1)}
            type="button"
            className="border-green-500 flex items-center text-green-600 border-t border-b  p-3 hover:bg-green-100"
          >
            +1 hr
          </button>
          <button
            onClick={() => handleDelay(6)}
            type="button"
            className="border-green-500 flex items-center text-green-600 border p-3 hover:bg-green-100"
          >
            +6 hr
          </button>
          <button
            onClick={() => handleDelay(12)}
            type="button"
            className="border-green-500 flex items-center text-green-600 border-t border-b  p-3 hover:bg-green-100"
          >
            +12 hr
          </button>
          <button
            onClick={() => handleDelay(24)}
            type="button"
            className="border-green-500 flex items-center text-green-600 border rounded-e-md  p-3 hover:bg-green-100"
          >
            +24 hr
          </button>
        </div>
      </div>
      <form onSubmit={submitForm}>
        <div className="grid grid-cols-2 gap-4 w-full max-lg:grid-cols-1">
          <FormControl size="lg" className="my-1">
            <FormLabel className="text-[#0D141C] font-medium">Pick Up Location</FormLabel>
            <Input
              name="pickup_location"
              onChange={handleChange}
              value={formData.pickup_location}
              required
              fullWidth
              size="lg"
              placeholder="Enter Pick Up Location"
            />
          </FormControl>
          <FormControl size="lg" className="my-1">
            <FormLabel className="text-[#0D141C] font-medium">Drop Location</FormLabel>
            <Input
              name="drop_location"
              onChange={handleChange}
              value={formData.drop_location}
              required
              fullWidth
              size="lg"
              placeholder="Enter Drop Location"
            />
          </FormControl>

          <FormControl size="lg" className="my-1">
            <FormLabel className="text-[#0D141C] font-medium">Pick Up Date</FormLabel>
            <Input
              required
              type="date"
              fullWidth
              name="pickup_date"
              size="lg"
              value={formData.pickup_date}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl size="lg" className="my-1">
            <FormLabel className="text-[#0D141C] font-medium">Pick Up Time</FormLabel>
            <Input
              required
              type="time"
              fullWidth
              size="lg"
              name="pickup_time"
              value={formData.pickup_time}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl size="lg" className="my-1">
            <FormLabel className="text-[#0D141C] font-medium">Return Date</FormLabel>
            <Input
              required
              type="date"
              fullWidth
              name="return_date"
              size="lg"
              value={formData.return_date}
              onChange={handleChange}
            />

            {errors.returnDate && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.returnDate}</FormHelperText>
              </FormControl>
            )}
          </FormControl>
          <FormControl size="lg" className="my-1">
            <FormLabel className="text-[#0D141C] font-medium">Expected Return Time</FormLabel>
            <Input
              required
              type="time"
              fullWidth
              size="lg"
              name="return_time"
              value={formData.return_time}
              onChange={handleChange}
            />
            {errors.returnTime && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.returnTime}</FormHelperText>
              </FormControl>
            )}
          </FormControl>
        </div>
        <FormControl>
          <div className="flex space-x-5 mb-2 mt-5 ">
            <FormLabel>Want to update driver or car ?</FormLabel>
            <Checkbox
              checked={checkBox}
              onChange={() => {
                setCheckBox(!checkBox);
              }}
            />
          </div>
        </FormControl>
        <div className="grid grid-cols-2 gap-4 w-full max-lg:grid-cols-1">
          <FormControl
            sx={{ m: 1, minWidth: 120 }}
            className={`${driverCarLoading ? "hover:cursor-not-allowed" : ""}`}
          >
            <FormLabel id="demo-simple-select-helper-label">Driver</FormLabel>
            <Select
              value={newDriver}
              onChange={handleChangeDriver}
              disabled={driverCarLoading}
              slotProps={{
                listbox: {
                  sx: {
                    maxHeight: 150,
                    overflowY: "auto", // Enable vertical scrolling
                  },
                },
              }}
            >
              <Option value={formData.driver}>{formData.driver}</Option>
              {availableDrivers.map((data: string) => (
                <Option key={data} value={data}>
                  {data}
                </Option>
              ))}
            </Select>
          </FormControl>
          <FormControl
            sx={{ m: 1, minWidth: 120 }}
            className={`${driverCarLoading ? "hover:cursor-not-allowed" : ""}`}
          >
            <FormLabel id="demo-simple-select-helper-label">Car</FormLabel>
            <Select
              value={newCar}
              onChange={handleChangeCar}
              disabled={driverCarLoading}
              slotProps={{
                listbox: {
                  sx: {
                    maxHeight: 200,
                    overflowY: "auto", // Enable vertical scrolling
                  },
                },
              }}
            >
              <Option value={formData.car_number}>{formData.car_number}</Option>
              {availableCars.map((data: string) => (
                <Option key={data} value={data}>
                  {data}
                </Option>
              ))}
            </Select>
          </FormControl>
        </div>
        <Typography
          className="text-4xl text-center my-5 max-[960px]:text-3xl"
          component="div"
          fontWeight="bold"
        >
          Passenger Details
        </Typography>

        {errors.passengerNumber && (
          <FormControl error>
            {" "}
            <div className="text-center mb-5 text-red-500 font-semibold text-2xl">
              {errors.passengerNumber}
            </div>
          </FormControl>
        )}
        {formData.passengers.map(
          (
            data: {
              passenger_id: string;
              name: string;
              phone: string;
              remark: string;
              external_booking: boolean;
              company: string;
            },
            index
          ) => (
            <div key={index} className="relative border-2 p-5 rounded-lg my-3">
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  setDel(true);
                  setDeleteId(data.passenger_id);
                }}
                className="absolute -right-[18px] rounded-full z-20 -top-[20px] text-slate-400  hover:bg-red-50 p-2 "
              >
                <Cancel />
              </div>
              <div className="grid grid-cols-2 gap-4 w-full max-lg:grid-cols-1">
                <FormControl size="lg" className="my-1">
                  <FormLabel className="text-[#0D141C] font-medium">Passenger Name</FormLabel>
                  <Input
                    name="name"
                    value={data.name}
                    disabled={!data.external_booking}
                    required
                    onChange={(e) => {
                      handleChangePassenger(e, data.passenger_id);
                    }}
                    fullWidth
                    size="lg"
                  />
                </FormControl>
                <FormControl size="lg" className="my-1 ">
                  <FormLabel className="text-[#0D141C] font-medium">Phone Number</FormLabel>
                  <Input
                    fullWidth
                    name="phone"
                    type="tel"
                    size="lg"
                    required
                    disabled={!data.external_booking}
                    value={data.phone}
                    onChange={(e) => {
                      handleChangePassenger(e, data.passenger_id);
                    }}
                    slotProps={{
                      input: {
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        maxLength: 10,
                      },
                    }}
                  />
                </FormControl>

                <FormControl size="lg" className="my-1 ">
                  <FormLabel className="text-[#0D141C] font-medium">Company</FormLabel>
                  <Input
                    name="company"
                    disabled={!data.external_booking}
                    value={data.company}
                    onChange={(e) => {
                      handleChangePassenger(e, data.passenger_id);
                    }}
                    fullWidth
                    size="lg"
                    placeholder="Enter Company"
                  />
                </FormControl>
                <FormControl size="lg" className="my-1">
                  <FormLabel className="text-[#0D141C] font-medium">Remark</FormLabel>
                  <Input
                    name="remark"
                    value={data.remark}
                    onChange={(e) => {
                      handleChangePassenger(e, data.passenger_id);
                    }}
                    fullWidth
                    size="lg"
                    placeholder="Enter Remark"
                  />
                </FormControl>
              </div>
            </div>
          )
        )}
        {selectedPassenger.map((data: GuestType, index) => (
          <div key={index} className="relative border-2 p-5 rounded-lg my-3">
            <div
              onClick={(event) => {
                event.stopPropagation();
                setDelPassenger(true);
                setDelId(data.booking_id);
              }}
              className="absolute -right-[18px] rounded-full z-20 -top-[20px] text-slate-400  hover:bg-red-50 p-2 "
            >
              <Cancel />
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-lg:grid-cols-1">
              <FormControl size="lg" className="my-1 hover:cursor-not-allowed">
                <FormLabel className="text-[#0D141C] font-medium">Passenger Name</FormLabel>
                <Input name="passangerName" value={data.name} fullWidth size="lg" disabled />
              </FormControl>
              <FormControl size="lg" className="my-1 hover:cursor-not-allowed">
                <FormLabel className="text-[#0D141C] font-medium">Phone Number</FormLabel>
                <Input
                  fullWidth
                  name="phoneNumber"
                  type="tel"
                  size="lg"
                  value={data.phone}
                  disabled
                  slotProps={{
                    input: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      maxLength: 10,
                    },
                  }}
                />
              </FormControl>

              <FormControl size="lg" className="my-1 hover:cursor-not-allowed">
                <FormLabel className="text-[#0D141C] font-medium">Company</FormLabel>
                <Input
                  name="company"
                  value={data.company}
                  disabled
                  fullWidth
                  size="lg"
                  placeholder="Enter Remark"
                />
              </FormControl>
              <FormControl size="lg" className="my-1">
                <FormLabel className="text-[#0D141C] font-medium">Remark</FormLabel>
                <Input
                  name="remark"
                  value={data.remark}
                  onChange={(event) => {
                    handlePassengerChange(event, data.booking_id);
                  }}
                  fullWidth
                  size="lg"
                  placeholder="Enter Remark"
                />
              </FormControl>
            </div>
          </div>
        ))}
        {manualPassenger.map((data: PassengerType, index) => (
          <div key={index} className="relative border-2 p-5 rounded-lg my-3">
            <div
              onClick={(event) => {
                event.stopPropagation();
                setManualDel(true);
                setManualDelId(data);
              }}
              className="absolute -right-[18px] rounded-full z-20 -top-[20px] text-slate-400  hover:bg-red-50 p-2 "
            >
              <Cancel />
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-lg:grid-cols-1">
              <FormControl size="lg" className="my-1 hover:cursor-not-allowed">
                <FormLabel className="text-[#0D141C] font-medium">Passenger Name</FormLabel>
                <Input
                  name="passangerName"
                  value={data.name}
                  required
                  fullWidth
                  size="lg"
                  disabled
                />
              </FormControl>
              <FormControl size="lg" className="my-1 hover:cursor-not-allowed">
                <FormLabel className="text-[#0D141C] font-medium">Phone Number</FormLabel>
                <Input
                  required
                  fullWidth
                  name="phoneNumber"
                  type="tel"
                  size="lg"
                  value={data.phoneNumber}
                  disabled
                  slotProps={{
                    input: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      maxLength: 10,
                    },
                  }}
                />
              </FormControl>

              <FormControl size="lg" className="my-1 hover:cursor-not-allowed">
                <FormLabel className="text-[#0D141C] font-medium">Company</FormLabel>
                <Input
                  name="Pick Up"
                  onChange={handleChange}
                  value={data.company}
                  required
                  disabled
                  fullWidth
                  size="lg"
                  placeholder="Enter Remark"
                />
              </FormControl>
              <FormControl size="lg" className="my-1 hover:cursor-not-allowed">
                <FormLabel className="text-[#0D141C] font-medium">Remark</FormLabel>
                <Input
                  name="Pick Up"
                  onChange={handleChange}
                  value={data.remark}
                  required
                  disabled
                  fullWidth
                  size="lg"
                  placeholder="Enter Remark"
                />
              </FormControl>
            </div>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4 w-full max-lg:grid-cols-1">
          <Button
            onClick={() => {
              setPassengerModal(true);
            }}
            type="button"
            size="lg"
            fullWidth
          >
            Add Passenger
          </Button>
          <Button className="editBookingButton" type="submit" size="lg" fullWidth>
            Edit Booking
          </Button>
        </div>
      </form>
      <Modal
        open={manually}
        onClose={() => {
          setManually(false);
          setPassengerDetails({
            company: "",
            name: "",
            phoneNumber: "",
            remark: "",
            external_booking: true,
          });
        }}
      >
        <ModalDialog style={{ width: "50vw" }}>
          <ModalClose style={{zIndex:"10"}}/>
          <DialogContent className="h-fit">
            <Typography className="text-4xl mb-5" component="div" fontWeight="bold">
              Add Details
            </Typography>
            <div className="grid grid-cols-2 gap-4 w-full max-lg:grid-cols-1">
              <FormControl size="lg" className="my-1">
                <FormLabel className="text-[#0D141C] font-medium">Passenger Name</FormLabel>
                <Input
                  name="name" // Ensure this matches the state property
                  value={passengerDetails.name}
                  onChange={handleChangeManually}
                  required
                  fullWidth
                  size="lg"
                  placeholder="Enter Passenger Name"
                />
                {manualErrors.name && (
                  <FormControl error>
                    {" "}
                    <FormHelperText>{manualErrors.name}</FormHelperText>
                  </FormControl>
                )}
              </FormControl>

              <FormControl size="lg" className="my-1">
                <FormLabel className="text-[#0D141C] font-medium">Phone Number</FormLabel>
                <Input
                  name="phoneNumber" // Ensure this matches the state property
                  value={passengerDetails.phoneNumber}
                  onChange={handleChangeManually}
                  required
                  fullWidth
                  size="lg"
                  type="tel"
                  placeholder="Phone Number"
                  slotProps={{
                    input: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      maxLength: 10,
                    },
                  }}
                />
                {manualErrors.name && (
                  <FormControl error>
                    {" "}
                    <FormHelperText>{manualErrors.name}</FormHelperText>
                  </FormControl>
                )}
              </FormControl>
              <FormControl size="lg" className="my-1">
                <FormLabel className="text-[#0D141C] font-medium">Company</FormLabel>
                <Input
                  name="company" // Ensure this matches the state property
                  value={passengerDetails.company}
                  onChange={handleChangeManually}
                  required
                  fullWidth
                  size="lg"
                  placeholder="Enter Company"
                />
              </FormControl>
              <FormControl size="lg" className="my-1">
                <FormLabel className="text-[#0D141C] font-medium">Remark</FormLabel>
                <Input
                  name="remark" // Ensure this matches the state property
                  value={passengerDetails.remark}
                  onChange={handleChangeManually}
                  required
                  fullWidth
                  size="lg"
                  placeholder="Enter Remark"
                />
              </FormControl>
            </div>
            <div className="flex mt-2 justify-end">
              <Button
                onClick={() => {
                  setManually(false);
                  setPassengerModal(true);
                }}
                type="button"
                size="lg"
                className="mx-2"
              >
                Add From Table
              </Button>
              <Button
                onClick={() => {
                  handleManually();
                }}
                type="button"
                size="lg"
                className="ml-2"
              >
                Confirm
              </Button>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>
      <Modal
        open={passengerModal}
        onClose={() => {
          setPassengerModal(false);
        }}
      >
        <ModalDialog style={{ width: "75vw" }}>
          <ModalClose style={{zIndex:"10"}}/>
          <DialogContent className="h-fit">
            <Reservations
              reload={reload}
              location="movement"
              setSelectedGuest={setSelectedGuest}
              setReload={setReload}
              loading={loading}
              handleSearch={handleSearch}
              search={search}
              setSearch={setSearch}
              rowsData={filteredRows}
              columns={columns}
              headers={headers}
            />
            <div className="flex mt-2 justify-end">
              <Button
                onClick={() => {
                  setPassengerModal(false);
                  setManually(true);
                }}
                type="button"
                className="mx-2"
              >
                Add Manually
              </Button>
              <Button onClick={handleGuest} type="button" className="ml-2">
                Confirm
              </Button>
            </div>
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
        <ModalDialog variant="outlined" size="md">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            <div className="text-2xl my-4">Enter your secret password to delete</div>
            <FormControl size="lg" className="space-y-1">
              <FormLabel>Password</FormLabel>
              <Input
                value={password}
                name="password"
                onChange={changePassword}
                fullWidth
                size="lg"
                placeholder="Enter Password"
              />
            </FormControl>
            </DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              color="danger"
              loading={loadingDelete}
              onClick={handlePassengerDelete}
            >
              Confirm
            </Button>
            <Button variant="plain" color="neutral" onClick={() => {setDel(false);setPassword("");}}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      <Modal
        open={manualDel}
        onClose={() => {
          setManualDel(false);
        }}
      >
        <ModalDialog variant="outlined" size="md">
          <DialogTitle>
            <WarningRounded />
            Confirmation
          </DialogTitle>
          <Divider />
          <div>Are you sure you want to delete Passenger ?</div>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={handleManualDelete}>
              Confirm
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setManualDel(false)}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      <Modal
        open={delPassenger}
        onClose={() => {
          setDelPassenger(false);
        }}
      >
        <ModalDialog variant="outlined" size="md">
          <DialogTitle>
            <WarningRounded />
            Confirmation
          </DialogTitle>
          <Divider />
          <div>Are you sure you want to delete Passenger ?</div>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={handleDelete}>
              Confirm
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setDelPassenger(false)}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      <Modal
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
        }}
      >
        <ModalDialog size="lg">
          <ModalClose style={{zIndex:"10"}}/>
          <DialogTitle className="">Movement Confirmation</DialogTitle>
          <DialogContent className="h-fit">
            <div className="flex flex-col h-56 items-center overflow-hidden ">
              <CheckCircle className="h-40 scale-[500%] text-green-600" />
              <div className="font-semibold text-2xl text-center">
                Movement Edited Successfully!
              </div>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>
      <Modal
        open={errorModal}
        onClose={() => {
          setErrorModal(false);
        }}
      >
        <ModalDialog size="lg">
          <ModalClose style={{zIndex:"10"}}/>
          <DialogTitle className="">Edit Movement Error</DialogTitle>
          <DialogContent className="h-fit">
            <div className="flex flex-col h-56 items-center overflow-hidden ">
              <div className="font-semibold text-xl w-full">
                Conflicting Entries found while editing with the following movements:
              </div>
              <div className="my-5">
                <Table borderAxis="both">
                  <thead>
                    <tr>
                      <th>Pickup Time</th>
                      <th>Return Time</th>
                      <th>Car Number</th>
                      <th>Driver</th>
                      <th>Pickup Location</th>
                      <th>Drop Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conflicts.map((conflict, index) => (
                      <tr key={index}>
                        <td>{formatDate(conflict.pickup_time)}</td>
                        <td>{formatDate(conflict.return_time)}</td>
                        <td>{conflict.car_number}</td>
                        <td>{conflict.driver}</td>
                        <td>{conflict.pickup_location}</td>
                        <td>{conflict.drop_location}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>
      <Modal
        open={deleteConfirm}
        onClose={() => {
          setDeleteConfirm(false);
        }}
      >
        <ModalDialog size="lg">
          <ModalClose style={{zIndex:"10"}}/>
          <DialogTitle className="">Movement Confirmation</DialogTitle>
          <DialogContent className="h-fit">
            <div className="flex flex-col h-56 items-center overflow-hidden ">
              <CheckCircle className="h-40 scale-[500%] text-green-600" />
              <div className="font-semibold text-2xl text-center">
                Movement Deleted Successfully!
              </div>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>
      <Modal
        open={delMovement}
        onClose={() => {
          setDelMovement(false);
          setPassword("")
        }}
      >
        <ModalDialog variant="outlined" size="md">
          <DialogTitle>
            <WarningRounded />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            <div className="text-2xl my-4">Enter your secret password to delete</div>
            <FormControl size="lg" className="space-y-1">
              <FormLabel>Password</FormLabel>
              <Input
                value={password}
                name="password"
                onChange={changePassword}
                fullWidth
                size="lg"
                placeholder="Enter Password"
              />
            </FormControl>
            </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={deleteMovement}>
              Confirm
            </Button>
            <Button variant="plain" color="neutral" onClick={() => {setDelMovement(false);setPassword("")}}>
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
    </div>
  );
};

export default Edit;
