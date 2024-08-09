"use client";
import React, { useEffect, useState } from "react";
import Reservations from "../manage-rooms/[room]/Reservations";
import {
  searchAllGuests,
  addMovement,
  fetchAvailableCars,
  fetchAvailableDrivers,
} from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { useRouter } from "next/navigation";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import {
  DialogActions,
  FormHelperText,
  Divider,
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Select,
  Option,
  Input,
  Modal,
  ModalClose,
  Snackbar,
  ModalDialog,
} from "@mui/joy";
import { Typography } from "@mui/material";
import { Cancel, WarningRounded } from "@mui/icons-material";
import { CheckCircle, Close, Info } from "@mui/icons-material";

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
type GuestType = {
  booking_id?: string;
  company?: string;
  name?: string;
  phone?: string;
  vessel?: string;
  remark?: string;
};

type PassengerType = {
  name: string;
  phoneNumber: string;
  remark: string;
  company: string;
};
type FormDataType = {
  driverName: string;
  carName: string;
  pickUpLocation: string;
  dropLocation: string;
  pickUpDate: string;
  pickUpTime: string;
  returnDate: string;
  returnTime: string;
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

function AddMovement() {
  const router = useRouter();
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
    "Room No.",
    "Status",
    "Check In",
    "Check Out",
    "Email",
    "Phone No.",
    "Company",
    "Rank",
  ];
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ReservationType[]>([]);
  const [reload, setReload] = useState(false);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [driverCar, setDriverCar] = useState(true);
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [manually, setManually] = useState(false);
  const [token, setToken] = useState("");
  const [filteredRows, setFilteredRows] = useState<ReservationType[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<GridRowSelectionModel[]>([]);
  const [selectedPassenger, setSelectedPassenger] = useState<GuestType[]>([]);
  const [manualPassenger, setManualPassenger] = useState<PassengerType[]>([]);
  const [formData, setFormData] = useState<FormDataType>({
    driverName: "",
    carName: "",
    pickUpLocation: "",
    dropLocation: "",
    pickUpDate: "",
    pickUpTime: "",
    returnDate: "",
    returnTime: "",
  });
  const [del, setDel] = useState(false);
  const [delId, setDelId] = useState<string | undefined>("");
  const [manualDel, setManualDel] = useState(false);
  const [manualDelId, setManualDelId] = useState<PassengerType>();
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
  const [manualErrors, setManualErrors] = useState<Partial<{ name: string; phone: string }>>({
    name: "",
    phone: "",
  });
  const [passengerDetails, setPassengerDetails] = useState({
    name: "",
    phoneNumber: "",
    remark: "",
    company: "",
  });
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);

  useEffect(() => {
    const getValues = async () => {
      if (
        formData.pickUpDate !== "" &&
        formData.returnDate !== "" &&
        formData.returnTime !== "" &&
        formData.pickUpTime !== ""
      ) {
        const pickUpDateTime = `${formData.pickUpDate}T${formData.pickUpTime}`;
        const returnDateTime = `${formData.returnDate}T${formData.returnTime}`;
        if (pickUpDateTime < returnDateTime) {
          const newErrors: Partial<ErrorType> = {};
          setErrors(newErrors);
          try {
            const cars = await fetchAvailableCars(token, pickUpDateTime, returnDateTime);
            const drivers = await fetchAvailableDrivers(token, pickUpDateTime, returnDateTime);
            console.log(cars, drivers);
            const carsNumber = cars.map((data: { name: string; number: string }) => data.number);
            const driverName = drivers.map((data: { name: string; phone: string }) => data.name);
            setAvailableCars(carsNumber);
            setAvailableDrivers(driverName);
            setDriverCar(false);
          } catch {
            setDriverCar(true);
          }
        } else {
          const newErrors: Partial<ErrorType> = {};
          newErrors.pickUpTime = "Return Time is smaller than Pick Up";
          newErrors.returnTime = "Return Time is smaller than Pick Up";
          setErrors(newErrors);
        }
      }
    };
    setDriverCar(true);
    getValues();
  }, [formData.pickUpDate, formData.returnDate, formData.returnTime, formData.pickUpTime]);

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

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

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Partial<ErrorType> = {};
    if (formData.driverName === "") {
      newErrors.driverName = "Please select a driver";
    }
    if (formData.carName === "") {
      newErrors.carName = "Please select a car";
    }
    const pickUpDateTime = new Date(`${formData.pickUpDate}T${formData.pickUpTime}`);
    const returnDateTime = new Date(`${formData.returnDate}T${formData.returnTime}`);
    if (pickUpDateTime > returnDateTime) {
      newErrors.returnDate = "Return Date and Time is smaller than Pick Up";
      newErrors.returnTime = "Return Date and Time is smaller than Pick Up";
    }
    if (selectedPassenger.length === 0 && manualPassenger.length === 0) {
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
    setLoading(true);
    if (selectedPassenger.length === 0) {
      const newManualPassenger = manualPassenger.map((entry: PassengerType) => {
        return {
          booking_id: null,
          name: entry.name,
          phone: entry.phoneNumber,
          remark: entry.remark,
          company: entry.company,
        };
      });
      const dataSend = {
        pickup_location: formData.pickUpLocation,
        pickup_time: pickUpDateTime,
        return_time: returnDateTime,
        drop_location: formData.dropLocation,
        driver: formData.driverName,
        car_number: formData.carName,
        passengers: newManualPassenger,
      };
      console.log(dataSend);
      try {
        const result = await addMovement(token, dataSend);
        setMessage(result.message);
        setAlert(true);
        if (result.message === "Movement added successfully!") {
          setOpenConfirm(true);
        }
      } catch {
        console.log("something went wrong");
        setAlert(true);
        setMessage("Something went wrong! Please try again later.");
      }
    } else if (manualPassenger.length === 0) {
      const newSelectedPassenger = selectedPassenger.map((entry: GuestType) => {
        return {
          booking_id: entry.booking_id,
          name: entry.name,
          phone: entry.phone,
          remark: entry.remark,
          company: entry.company,
        };
      });
      const dataSend = {
        pickup_location: formData.pickUpLocation,
        pickup_time: pickUpDateTime,
        return_time: returnDateTime,
        drop_location: formData.dropLocation,
        driver: formData.driverName,
        car_number: formData.carName,
        passengers: newSelectedPassenger,
      };
      console.log(dataSend);
      try {
        const result = await addMovement(token, dataSend);
        setMessage(result.message);
        setAlert(true);
        if (result.message === "Movement added successfully!") {
          setOpenConfirm(true);
        }
      } catch {
        console.log("something went wrong");
        setAlert(true);
        setMessage("Something went wrong! Please try again later.");
      }
    } else {
      const newManualPassenger = manualPassenger.map((entry: PassengerType) => {
        return {
          booking_id: null,
          name: entry.name,
          phone: entry.phoneNumber,
          remark: entry.remark,
          company: entry.company,
        };
      });
      const newSelectedPassenger = selectedPassenger.map((entry: GuestType) => {
        return {
          booking_id: entry.booking_id,
          name: entry.name,
          phone: entry.phone,
          remark: entry.remark,
          company: entry.company,
        };
      });
      const allPassenger = [...newManualPassenger, ...newSelectedPassenger];
      const dataSend = {
        pickup_location: formData.pickUpLocation,
        pickup_time: pickUpDateTime,
        return_time: returnDateTime,
        drop_location: formData.dropLocation,
        driver: formData.driverName,
        car_number: formData.carName,
        passengers: allPassenger,
      };
      console.log(dataSend);
      try {
        const result = await addMovement(token, dataSend);
        setMessage(result.message);
        setAlert(true);
        if (result.message === "Movement added successfully!") {
          setOpenConfirm(true);
        }
      } catch {
        console.log("something went wrong");
        setAlert(true);
        setMessage("Something went wrong! Please try again later.");
      }
    }
  };

  const handleChangeDriver = (event: React.SyntheticEvent | null, newValue: string | null) => {
    if (newValue) {
      setFormData((prevData) => ({
        ...prevData,
        driverName: newValue,
      }));
    }
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleChangeCar = (event: React.SyntheticEvent | null, newValue: string | null) => {
    if (newValue) {
      setFormData((prevData) => ({
        ...prevData,
        carName: newValue,
      }));
    }
  };
  const handleModal = () => {
    setOpen(true);
  };
  const handleGuest = () => {
    if (selectedGuest.length > 0) {
      let newPassengers = selectedGuest
        .map((selectedUser) => {
          const newBooking = selectedUser.toString() as string;
          const passenger = rows.find((row) => row.booking_id === newBooking);
          if (passenger && passenger !== undefined) {
            return {
              ...passenger,
              remark: "",
            } as GuestType;
          } else {
            return null;
          }
        })
        .filter((passenger): passenger is GuestType => passenger !== null) as GuestType[];

      newPassengers = newPassengers.filter((passenger) => passenger !== null);
      setSelectedPassenger((prevSelectedPassenger) => [
        ...prevSelectedPassenger,
        ...(newPassengers as GuestType[]),
      ]);
      setSelectedGuest([]);
      setOpen(false);
    }
  };

  const handleDelete = () => {
    const updatedPassengers = selectedPassenger.filter((row) => row.booking_id !== delId);
    setSelectedPassenger(updatedPassengers);
    setDel(false);
  };
  const handleManualDelete = () => {
    const updatedPassengers = manualPassenger.filter((row) => row !== manualDelId);
    setManualPassenger(updatedPassengers);
    setManualDel(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPassengerDetails((prevState) => ({
      ...prevState,
      [name]: name === "phoneNumber" ? value.replace(/\D/g, "").slice(0, 10) : value,
    }));
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

  useEffect(() => {
    if (token !== "") {
      getGuests();
    }
  }, [reload, token]);

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
    setPassengerDetails({ name: "", phoneNumber: "", remark: "", company: "" });
  };

  useEffect(() => {
    handleSearch();
  }, [search, rows]);

  return (
    <div className="my-11 mx-32 max-[1420px]:mx-10 max-lg:mx-5">
      <div className="text-3xl font-semibold mb-6">Add Movement</div>
      <form onSubmit={submitForm} className="space-y-10 w-full my-3">
        <div className="grid grid-cols-2 gap-3 w-full max-lg:grid-cols-1">
          <FormControl size="lg" className="my-1">
            <FormLabel className="text-[#0D141C] font-medium">Pick Up Location</FormLabel>
            <Input
              name="pickUpLocation"
              onChange={handleFormChange}
              value={formData.pickUpLocation}
              required
              fullWidth
              size="lg"
              placeholder="Enter Pick Up Location"
            />
            {errors.pickUpLocation && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.pickUpLocation}</FormHelperText>
              </FormControl>
            )}
          </FormControl>
          <FormControl size="lg" className="my-1">
            <FormLabel className="text-[#0D141C] font-medium">Drop Location</FormLabel>
            <Input
              name="dropLocation"
              onChange={handleFormChange}
              value={formData.dropLocation}
              required
              fullWidth
              size="lg"
              placeholder="Enter Drop Location"
            />
            {errors.dropLocation && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.dropLocation}</FormHelperText>
              </FormControl>
            )}
          </FormControl>
          <div className="grid grid-cols-2 gap-3">
            <FormControl size="lg" className="my-1">
              <FormLabel className="text-[#0D141C] font-medium">Pick Up Date</FormLabel>
              <Input
                required
                type="date"
                fullWidth
                name="pickUpDate"
                size="lg"
                value={formData.pickUpDate}
                onChange={handleFormChange}
              />
              {errors.pickUpDate && (
                <FormControl error>
                  {" "}
                  <FormHelperText>{errors.pickUpDate}</FormHelperText>
                </FormControl>
              )}
            </FormControl>
            <FormControl size="lg" className="my-1">
              <FormLabel className="text-[#0D141C] font-medium">Pick Up Time</FormLabel>
              <Input
                required
                type="time"
                fullWidth
                size="lg"
                name="pickUpTime"
                value={formData.pickUpTime}
                onChange={handleFormChange}
              />
              {errors.pickUpTime && (
                <FormControl error>
                  {" "}
                  <FormHelperText>{errors.pickUpTime}</FormHelperText>
                </FormControl>
              )}
            </FormControl>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormControl size="lg" className="my-1">
              <FormLabel className="text-[#0D141C] font-medium">Return Date</FormLabel>
              <Input
                required
                type="date"
                fullWidth
                name="returnDate"
                size="lg"
                value={formData.returnDate}
                onChange={handleFormChange}
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
                name="returnTime"
                value={formData.returnTime}
                onChange={handleFormChange}
              />
              {errors.returnTime && (
                <FormControl error>
                  {" "}
                  <FormHelperText>{errors.returnTime}</FormHelperText>
                </FormControl>
              )}
            </FormControl>
          </div>
          <FormControl size="lg" className={`my-1 ${driverCar ? "hover:cursor-not-allowed" : ""}`}>
            <FormLabel className="text-[#0D141C] font-medium">Driver Name</FormLabel>
            <Select
              placeholder="Select Driver"
              value={formData.driverName}
              onChange={handleChangeDriver}
              disabled={driverCar}
              required
              slotProps={{
                listbox: {
                  sx: {
                    maxHeight: 192,
                    overflowY: "auto", // Enable vertical scrolling
                  },
                },
              }}
            >
              <Option value="default">Default</Option>
              {availableDrivers.map((data: string) => (
                <Option key={data} value={data}>
                  {data}
                </Option>
              ))}
            </Select>
            {errors.driverName && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.driverName}</FormHelperText>
              </FormControl>
            )}
          </FormControl>

          <FormControl size="lg" className={`my-1 ${driverCar ? "hover:cursor-not-allowed" : ""}`}>
            <FormLabel className="text-[#0D141C] font-medium">Car Number</FormLabel>
            <Select
              placeholder="Select Car"
              value={formData.carName}
              onChange={handleChangeCar}
              disabled={driverCar}
              required
              slotProps={{
                listbox: {
                  sx: {
                    maxHeight: 192,
                    overflowY: "auto", // Enable vertical scrolling
                  },
                },
              }}
            >
              <Option value="default">Default</Option>
              {availableCars.map((data: string) => (
                <Option key={data} value={data}>
                  {data}
                </Option>
              ))}
            </Select>
            {errors.carName && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.carName}</FormHelperText>
              </FormControl>
            )}
          </FormControl>
        </div>
        <div>
          {errors.passengerNumber && (
            <FormControl error>
              {" "}
              <FormHelperText>
                <div className=" text-2xl">{errors.passengerNumber}</div>
              </FormHelperText>
            </FormControl>
          )}
          {selectedPassenger.map((data: GuestType, index) => (
            <div key={index} className="relative border-2 p-5 rounded-lg my-3">
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  setDel(true);
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
        </div>
        <div className="flex gap-5">
          <Button onClick={handleModal} type="button" size="lg" fullWidth>
            Add Passenger
          </Button>
          <Button type="submit" size="lg" fullWidth>
            Save Movement
          </Button>
        </div>
      </form>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedGuest([]);
        }}
      >
        <ModalDialog style={{ width: "75vw" }}>
          <ModalClose style={{ zIndex: "10" }} />
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
                  setOpen(false);
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
        open={manually}
        onClose={() => {
          setManually(false);
          setPassengerDetails({
            company: "",
            name: "",
            phoneNumber: "",
            remark: "",
          });
        }}
      >
        <ModalDialog style={{ width: "50vw" }}>
          <ModalClose style={{ zIndex: "10" }} />
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                {manualErrors.phone && (
                  <FormControl error>
                    {" "}
                    <FormHelperText>{manualErrors.phone}</FormHelperText>
                  </FormControl>
                )}
              </FormControl>
              <FormControl size="lg" className="my-1">
                <FormLabel className="text-[#0D141C] font-medium">Company</FormLabel>
                <Input
                  name="company" // Ensure this matches the state property
                  value={passengerDetails.company}
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  setOpen(true);
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
        open={del}
        onClose={() => {
          setDel(false);
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
            <Button variant="plain" color="neutral" onClick={() => setDel(false)}>
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
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
          router.push("/admin/manage-movement");
        }}
      >
        <ModalDialog size="lg">
          <ModalClose style={{ zIndex: "10" }} />
          <DialogTitle className="">Movement Confirmation</DialogTitle>
          <DialogContent className="h-fit">
            <div className="flex flex-col h-56 items-center overflow-hidden ">
              <CheckCircle className="h-40 scale-[500%] text-green-600" />
              <div className="font-semibold text-2xl text-center">Movement Added Successfully!</div>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>
      <Snackbar
        open={alert}
        autoHideDuration={5000}
        // color="danger"
        onClose={() => {
          setAlert(false);
        }}
      >
        {" "}
        <Info /> {message}{" "}
        <span onClick={() => setAlert(false)} className="cursor-pointer hover:bg-[#f3eded]">
          <Close />
        </span>{" "}
      </Snackbar>
    </div>
  );
}

export default AddMovement;
