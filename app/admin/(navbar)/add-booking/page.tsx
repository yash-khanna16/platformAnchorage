"use client";
import { addNewBooking, getAvailableRooms } from "@/app/actions/api";
import {
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Modal,
  Select,
  Option,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import Input from "@mui/joy/Input";
import { FormHelperText, Snackbar } from "@mui/joy";
import { useRouter } from "next/navigation";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { CheckCircle, Close, Info, Warning } from "@mui/icons-material";
import { getAuthAdmin } from "@/app/actions/cookie";

interface FormData {
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
  id: string;
  breakfast: number;
  veg: number;
  nonVeg: number;
}

function NewBooking(): JSX.Element {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const tick = useRef(null);
  const [minCheckinDate, setMinCheckinDate] = useState<string>("");
  const [minCheckinTime, setMinCheckinTime] = useState<string>("");
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

  const handleChangeRoom = (event: React.SyntheticEvent | null, newValue: string | null) => {
    if (newValue) {
      setRoom(newValue);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const formattedTime = currentDate.toTimeString().split(" ")[0].slice(0, 5); // HH:MM
    setMinCheckinDate(formattedDate);
    setMinCheckinTime(formattedTime);
  }, []);

  const [room, setRoom] = useState("");
  const [roomDisabled, setRoomDisabled] = useState(true);
  const [availableRooms, setAvailableRooms] = useState([]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    checkinDate: "",
    checkinTime: "",
    checkoutDate: "",
    checkoutTime: "",
    phoneNumber: "",
    companyName: "",
    vessel: "",
    rank: "",
    id: "",
    remarks: "",
    additionalInfo: "",
    breakfast: 0,
    veg: 0,
    nonVeg: 0,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // For the Phone Number field, restrict input to numbers only
    // if (name === "phoneNumber") {
    // const numericValue = value.replace(/\D/g, "").slice(0, 12); // Keep only the first 10 digits
    // setFormData((prevData) => ({
    //   ...prevData,
    //   [name]: numericValue,
    // }));
    // if (numericValue.length < 12) {
    //   setErrors((prevData) => ({
    //     ...prevData,
    //     phoneNumber: "Phone number must be of 12 digits",
    //   }));
    // } else {
    //   setErrors((prevData) => ({
    //     ...prevData,
    //     phoneNumber: "",
    //   }));
    // }
    // } else {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // }
    if (name === "checkoutTime") {
      setErrors((prevData) => ({
        ...prevData,
        checkoutDate: "",
      }));
    }
    if (name === "checkinTime") {
      setErrors((prevData) => ({
        ...prevData,
        checkinDate: "",
      }));
    }

    // Clear individual field errors when changing any field
    setErrors((prevData) => ({
      ...prevData,
      [name]: "",
    }));
  };

  useEffect(() => {
    const getValues = async () => {
      if (
        formData.checkinDate !== "" &&
        formData.checkinTime !== "" &&
        formData.checkoutDate !== "" &&
        formData.checkoutTime !== ""
      ) {
        const pickUpDateTime = `${formData.checkinDate} ${formData.checkinTime}`;
        const returnDateTime = `${formData.checkoutDate} ${formData.checkoutTime}`;
        if (pickUpDateTime < returnDateTime) {
          try {
            const newPickUpDateTime = new Date(pickUpDateTime);
            const newReturnDateTime = new Date(returnDateTime);
            const result = await getAvailableRooms(token, newPickUpDateTime, newReturnDateTime);
            const roomsAvailable = result.map((data: { room: string; active: string }) => data.room);
            setAvailableRooms(roomsAvailable);
            setRoomDisabled(false);
          } catch {
            setRoomDisabled(true);
          }
        }
      }
    };
    setRoomDisabled(true);
    getValues();
  }, [formData.checkinDate, formData.checkinTime, formData.checkoutDate, formData.checkoutTime]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentDate = new Date();
    const selectedCheckinDateTime = new Date(`${formData.checkinDate}T${formData.checkinTime}`);
    const selectedCheckoutDateTime = new Date(`${formData.checkoutDate}T${formData.checkoutTime}`);

    const newErrors: Partial<FormData> = {};

    if (selectedCheckoutDateTime <= selectedCheckinDateTime) {
      newErrors.checkoutDate = "Check-out date and time must be after the check-in date and time.";
    }
    if (formData.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (formData.phoneNumber.length) {
      if (!isValidPhoneNumber(formData.phoneNumber)) {
        newErrors.phoneNumber = "Invalid Phone Number";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (selectedCheckoutDateTime > selectedCheckinDateTime) {
      setErrors({});
      const apiFormData = {
        checkin: selectedCheckinDateTime,
        checkout: selectedCheckoutDateTime,
        email: formData.email,
        meal_veg: formData.veg,
        meal_non_veg: formData.nonVeg,
        remarks: formData.remarks,
        additional: formData.additionalInfo,
        room: room,
        name: formData.name,
        phone: (formData.phoneNumber),
        company: formData.companyName,
        vessel: formData.vessel,
        rank: formData.rank,
        guestId: formData.id,
        breakfast: formData.breakfast,
      };
      try {
        setLoading(true);
        const res = await addNewBooking(token, apiFormData);
        setLoading(false);
        if (res.message === "Booking added suceessfull") {
          setOpen(true);
        } else {
          setAlert(true);
          setMessage(res.message);
        }
        console.log("res: ", res);
      } catch (error) {
        setLoading(false);
        setAlert(true);
        setMessage("Something went wrong, Please try again!");
        console.log("error: ", error);
      }

      console.log("Form submitted: ", formData);
    }
  };

  const phoneNumberRegex = /^\+?(\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

  function isValidPhoneNumber(phoneNumber: string) {
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    // Check if the cleaned number has at least 10 digits and matches the regex
    return digitsOnly.length >= 10 && phoneNumberRegex.test(phoneNumber);
  }

  return (
    <div className="mx-32 my-10">
      <form onSubmit={handleSubmit} className="space-y-10 -w-full">
        <div className="text-3xl font-semibold mb-6">Add New Booking</div>
        <div className="grid grid-cols-2 gap-4 w-full max-lg:grid-cols-1">
          <FormControl size="lg" className="space-y-1">
            <FormLabel className="text-[#0D141C] font-medium">Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              size="lg"
              placeholder="John Smith"
            />
          </FormControl>

          <FormControl size="lg" className="space-y-1">
            <FormLabel>Email Address</FormLabel>
            <Input name="email" value={formData.email} onChange={handleChange} fullWidth size="lg" placeholder="Email Address" />
            {errors.email && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.email}</FormHelperText>
              </FormControl>
            )}
          </FormControl>

          <div className="space-y-1">
            <FormControl size="lg">
              <FormLabel>Check In</FormLabel>
            </FormControl>
            <div className="flex space-x-2">
              <Input
                required
                type="date"
                fullWidth
                name="checkinDate"
                size="lg"
                value={formData.checkinDate}
                onChange={handleChange}
                error={errors.checkinDate !== undefined && errors.checkinDate !== ""}
              />
              <Input
                required
                type="time"
                fullWidth
                size="lg"
                name="checkinTime"
                value={formData.checkinTime}
                error={errors.checkinDate !== undefined && errors.checkinDate !== ""}
                onChange={handleChange}
              />
            </div>

            {errors.checkinDate && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.checkinDate}</FormHelperText>{" "}
              </FormControl>
            )}
          </div>

          <div className="space-y-1">
            <FormControl size="lg">
              <FormLabel>Check Out</FormLabel>
            </FormControl>
            <div className="flex space-x-2">
              <Input
                required
                type="date"
                fullWidth
                size="lg"
                value={formData.checkoutDate}
                name="checkoutDate"
                error={errors.checkoutDate !== undefined && errors.checkoutDate !== ""}
                onChange={handleChange}
              />
              <Input
                required
                type="time"
                fullWidth
                size="lg"
                name="checkoutTime"
                error={errors.checkoutDate !== undefined && errors.checkoutDate !== ""}
                value={formData.checkoutTime}
                onChange={handleChange}
              />
            </div>
            {errors.checkoutDate && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.checkoutDate}</FormHelperText>{" "}
              </FormControl>
            )}
          </div>

          <FormControl size="lg" className="space-y-1">
            <FormLabel>Phone Number</FormLabel>
            <Input
              required
              fullWidth
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              type="tel"
              size="lg"
              placeholder="Phone Number"
            />
            <FormControl error>
              <FormHelperText>{errors.phoneNumber}</FormHelperText>
            </FormControl>
          </FormControl>

          <FormControl size="lg" className="space-y-1">
            <FormLabel className="text-[#0D141C] font-medium">Company Name</FormLabel>
            <Input
              value={formData.companyName}
              name="companyName"
              onChange={handleChange}
              fullWidth
              size="lg"
              placeholder="Company Name"
            />
          </FormControl>

          <FormControl size="lg" className="space-y-1">
            <FormLabel>Vessel</FormLabel>
            <Input value={formData.vessel} name="vessel" onChange={handleChange} fullWidth size="lg" placeholder="Vessel" />
          </FormControl>

          <FormControl size="lg" className="space-y-1">
            <FormLabel>Rank</FormLabel>
            <Input value={formData.rank} name="rank" onChange={handleChange} fullWidth size="lg" placeholder="Rank" />
          </FormControl>

          <FormControl size="lg" className="space-y-1">
            <FormLabel>ID</FormLabel>
            <Input value={formData.id} name="id" onChange={handleChange} fullWidth size="lg" placeholder="ID" />
          </FormControl>

          <FormControl size="lg" className="space-y-1">
            <FormLabel className="text-[#0D141C] font-medium">Remarks</FormLabel>
            <Input value={formData.remarks} name="remarks" onChange={handleChange} fullWidth size="lg" placeholder="Remarks" />
          </FormControl>

          <FormControl size="lg" className="space-y-1">
            <FormLabel>Additional Information</FormLabel>
            <Input
              value={formData.additionalInfo}
              name="additionalInfo"
              onChange={handleChange}
              fullWidth
              size="lg"
              placeholder="Additional Information"
            />
          </FormControl>

          {/* <div className="space-y-1">
            <FormControl size="lg">
              <FormLabel>Meals</FormLabel>
            </FormControl>
            <div className="grid grid-cols-2 gap-2 items-center">
              <div className="w-full">
                <FormControl>
                  <FormLabel>Breakfast</FormLabel>
                </FormControl>
                <Input
                  fullWidth
                  type="number"
                  size="md"
                  placeholder="Breakfast"
                  name="breakfast"
                  slotProps={{
                    input: {
                      min: 0,
                    },
                  }}
                  value={formData.breakfast}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full">
                <FormControl>
                  <FormLabel>Veg</FormLabel>
                </FormControl>
                <Input
                  fullWidth
                  type="number"
                  size="md"
                  placeholder="Veg"
                  name="veg"
                  slotProps={{
                    input: {
                      min: 0,
                    },
                  }}
                  value={formData.veg}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full">
                <FormControl>
                  <FormLabel>Non Veg</FormLabel>
                </FormControl>
                <Input
                  fullWidth
                  type="number"
                  size="md"
                  placeholder="Non Veg"
                  name="nonVeg"
                  slotProps={{
                    input: {
                      min: 0,
                    },
                  }}
                  value={formData.nonVeg}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div> */}
          <FormControl size="lg" className={`space-y-1 ${roomDisabled ? "hover:cursor-not-allowed" : ""}`}>
            <FormLabel>Room</FormLabel>
            <Select
              placeholder="Select Room"
              value={room}
              onChange={handleChangeRoom}
              disabled={roomDisabled}
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
              {availableRooms.map((data: string) => (
                <Option key={data} value={data}>
                  {data}
                </Option>
              ))}
            </Select>
          </FormControl>
        </div>
        <Button loading={loading} type="submit" size="lg" className="w-1/2 max-xl:w-full">
          Book Now
        </Button>
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
            router.push("/admin/search-guests");
          }}
        >
          <ModalDialog size="lg">
            <ModalClose />
            <DialogTitle className="">Booking Confirmation</DialogTitle>
            <DialogContent className="h-fit">
              <div className="flex flex-col h-56 items-center overflow-hidden ">
                <CheckCircle className="h-40 scale-[500%] text-green-600" />
                <div className="font-semibold text-2xl text-center">Room Booked Successfully!</div>
              </div>
              {/* <div>
              <div className="font-semibold text-lg">Booking Details:</div>
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Name:</strong> {formData.name}
                  </div>
                  <div className="w-fit">
                    <strong>Email:</strong> {formData.email}
                  </div>
                  <div>
                    <strong>Check-in Date:</strong> {formData.checkinDate}
                  </div>
                  <div>
                    <strong>Check-in Time:</strong> {formData.checkinTime}
                  </div>
                  <div>
                    <strong>Check-out Date:</strong> {formData.checkoutDate}
                  </div>
                  <div>
                    <strong>Check-out Time:</strong> {formData.checkoutTime}
                  </div>
                  <div>
                    <strong>Phone Number:</strong> {formData.phoneNumber}
                  </div>
                  <div>
                    <strong>Company Name:</strong> {formData.companyName}
                  </div>
                  <div>
                    <strong>Vessel:</strong> {formData.vessel}
                  </div>
                  <div>
                    <strong>Rank:</strong> {formData.rank}
                  </div>
                  <div>
                    <strong>Remarks:</strong> {formData.remarks}
                  </div>
                  <div>
                    <strong>Additional Info:</strong> {formData.additionalInfo}
                  </div>
                  <div>
                    <strong>Breakfast:</strong> {formData.breakfast}
                  </div>
                  <div>
                    <strong>Veg Meals:</strong> {formData.veg}
                  </div>
                  <div>
                    <strong>Non-Veg Meals:</strong> {formData.nonVeg}
                  </div>
                </div>
              </div>
            </div> */}
            </DialogContent>
          </ModalDialog>
        </Modal>
        <Snackbar
          open={alert}
          autoHideDuration={5000}
          color="danger"
          onClose={() => {
            setAlert(false);
          }}
        >
          {" "}
          <Warning /> {message}{" "}
          <span onClick={() => setAlert(false)} className="cursor-pointer hover:bg-[#f3eded]">
            <Close />
          </span>{" "}
        </Snackbar>
      </form>
    </div>
  );
}

export default NewBooking;
