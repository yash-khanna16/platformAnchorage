import { addNewBooking, editBooking } from "@/app/actions/api";
import {
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Snackbar,
} from "@mui/joy";
import Input from "@mui/joy/Input";
import { Alert, FormHelperText } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import Checkbox from "@mui/joy/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Lottie from "lottie-web";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { CheckCircle, Close, Info } from "@mui/icons-material";
import { getAuthAdmin } from "@/app/actions/cookie";
import { getAvailableRooms } from "@/app/actions/api";
import CircularProgress from "@mui/joy/CircularProgress";
import { Select, MenuItem } from "@mui/joy";

interface FormData {
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

function EditBooking({
  initialData,
  setOpenModal,
  setReload,
  reload,
}: {
  initialData: FormData;
  setOpenModal: React.Dispatch<SetStateAction<boolean>>;
  setReload: React.Dispatch<SetStateAction<boolean>>;
  reload: boolean;
}): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const tick = useRef(null);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [checkBox, setCheckBox] = useState(false);
  const [roomNumberLoading, setRoomNumberLoading] = useState(true);

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

  // useEffect(() => {
  //   if (open && tick.current) {
  //     const instance = Lottie.loadAnimation({
  //       container: tick.current,
  //       renderer: "svg",
  //       loop: true,
  //       autoplay: true,
  //       animationData: require("../../../../assets/tick.json"),
  //     });
  //     return () => instance.destroy();
  //   }
  // }, [open]);
  // useEffect(() => {
  //   setTimeout(() => tick.current?.play(), 100);
  // }, []);

  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2); // Adding 1 because months are zero-indexed
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  const room = decodeURIComponent(params.room as string);
  console.log(initialData);
  const initialFormData = {
    ...initialData,
    checkinDate: formatDateString(initialData.checkinDate),
    checkoutDate: formatDateString(initialData.checkoutDate),
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [roomNumber, setRoomNumber] = useState(`${formData.room}`);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [availableRooms, setAvailableRooms] = useState([]);

  console.log("initial data: ", initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCheckBox(false)
    // For the Phone Number field, restrict input to numbers only
    // if (name === "phoneNumber") {
    //   // Replace non-numeric characters with an empty string
    //   const numericValue = value.replace(/\D/g, "").slice(0, 10); // Keep only the first 10 digits
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     [name]: numericValue,
    //   }));
    //   if (numericValue.length < 10) {
    //     setErrors((prevData) => ({
    //       ...prevData,
    //       phoneNumber: "Phone number must be of 10 digits",
    //     }));
    //   } else {
    //     setErrors((prevData) => ({
    //       ...prevData,
    //       phoneNumber: "",
    //     }));
    //   }
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
  const phoneNumberRegex = /^\+?(\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

function isValidPhoneNumber(phoneNumber: string) {
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    // Check if the cleaned number has at least 10 digits and matches the regex
    return digitsOnly.length >= 10 && phoneNumberRegex.test(phoneNumber);
}
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
      // newErrors.phoneNumber = "Phone number must be of 10 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // console.log("here")
    if (roomNumber !== formData.room) {
      formData.room = roomNumber;
    }
    if (selectedCheckoutDateTime > selectedCheckinDateTime) {
      setErrors({});
      const apiFormData = {
        bookingId: initialData.booking_id,
        checkin: selectedCheckinDateTime,
        checkout: selectedCheckoutDateTime,
        email: formData.email,
        meal_veg: formData.veg,
        meal_non_veg: formData.nonVeg,
        remarks: formData.remarks,
        additional: formData.additionalInfo,
        room: formData.room,
        name: formData.name,
        phone: (formData.phoneNumber),
        company: formData.companyName,
        vessel: formData.vessel,
        rank: formData.rank,
        guestId: formData.id,
        breakfast: formData.breakfast,
        originalEmail: formData.originalEmail,
      };
      try {
        console.log(formData);
        setLoading(true);
        const res = await editBooking(token, apiFormData);
        setLoading(false);
        setAlert(true);
        setMessage(res.message);
        setReload(!reload);
        console.log("res: ", res);
      } catch (error) {
        setLoading(false);
        setAlert(true);
        setMessage("Something went wrong, Please try again later!");
        console.log("error: ", error);
      }

      console.log("Form submitted: ", formData);
    }
  };

  const checkBoxChange = () => {
    setCheckBox(!checkBox);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      const selectedCheckinDateTime = new Date(`${formData.checkinDate}T${formData.checkinTime}`);
      const selectedCheckoutDateTime = new Date(`${formData.checkoutDate}T${formData.checkoutTime}`);
      if (checkBox) {
        const roomsAvailable = await getAvailableRooms(token, selectedCheckinDateTime, selectedCheckoutDateTime);
        setAvailableRooms(roomsAvailable);
        console.log(roomsAvailable);
        setRoomNumberLoading(false);
      }
    };
    if (checkBox) {
      setRoomNumberLoading(true);
      fetchRooms();
    }
  }, [checkBox]);

  const handleChangeDropdown = (
    event: React.SyntheticEvent | null,
    newValue: string | null,
  ) => {
    if(newValue) setRoomNumber(newValue)
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-10 -w-full">
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
          {errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
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

          {errors.checkinDate && <FormHelperText error>{errors.checkinDate}</FormHelperText>}
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
          {errors.checkoutDate && <FormHelperText error>{errors.checkoutDate}</FormHelperText>}
        </div>

        <FormControl size="lg" className="space-y-1">
          <FormLabel>Phone Number</FormLabel>
          <Input
            required
            fullWidth
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            size="lg"
            placeholder="Phone Number"
          />
          {errors.phoneNumber && <FormHelperText error>{errors.phoneNumber}</FormHelperText>}
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
        <div>
          <FormControl >
            <div className="flex space-x-5">
            <FormLabel>Want to migrate?</FormLabel>
            <Checkbox checked={checkBox} onChange={checkBoxChange} />

            </div>
          </FormControl>
          {!checkBox ? (
            ""
          ) : roomNumberLoading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <FormLabel id="demo-simple-select-helper-label">Room Number</FormLabel>
                <Select
                  placeholder="Room Number"
                  value={roomNumber}
                  onChange={handleChangeDropdown}
                  slotProps={{
                    listbox: {
                      sx: {
                        maxHeight: 115,
                        overflowY: "auto", // Enable vertical scrolling
                      },
                    },
                  }}
                >
                  <Option value={formData.room}>{formData.room}</Option>
                  {availableRooms.map((data: { room: string; active: boolean }) => (
                    <Option key={data.room} value={data.room}>
                      {data.room}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}
        </div>
      </div>
      <Button loading={loading} type="submit" size="lg" fullWidth>
        Edit Booking
      </Button>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          router.push("/admin/manage-rooms");
        }}
      >
        <ModalDialog size="lg">
          <ModalClose />
          <DialogTitle className="">Edit Confirmation</DialogTitle>
          <DialogContent className="h-fit">
            <div className="flex flex-col h-56 items-center overflow-hidden ">
              {/* <CheckCircle className="h-40 scale-[500%] text-green-600" /> */}
              <div className="font-semibold text-2xl">Entry Edited successfully</div>
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
    </form>
  );
}

export default EditBooking;
