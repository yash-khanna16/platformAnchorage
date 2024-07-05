import { editBooking } from "@/app/actions/api";
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

  const initialFormData = {
    ...initialData,
    pickup_date: formatDateString(initialData.pickup_date),
    return_date: formatDateString(initialData.return_date),
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [availableDrivers, setAvailableDrivers] = useState([
    "ujjawal",
    "devesh",
    "vashisht",
    "nakul",
    "madhav",
  ]);
  const [availableCars, setAvailableCars] = useState([
    "ujjawal",
    "devesh",
    "vashisht",
    "nakul",
    "madhav",
  ]);
  const [newDriver, setNewDriver] = useState(formData.driver);
  const [newCar, setNewCar] = useState(formData.car_number);

  console.log("initial data: ", initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log("hello");
    console.log(name);
    console.log(value);
    setCheckBox(false);
    // For the Phone Number field, restrict input to numbers only
    if (name === "phone") {
      // Replace non-numeric characters with an empty string
      const numericValue = value.replace(/\D/g, "").slice(0, 10); // Keep only the first 10 digits
      setFormData((prevData) => ({
        ...prevData,
        [name]: numericValue,
      }));
      if (numericValue.length < 10) {
        setErrors((prevData) => ({
          ...prevData,
          phoneNumber: "Phone number must be of 10 digits",
        }));
      } else {
        setErrors((prevData) => ({
          ...prevData,
          phoneNumber: "",
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    if (name === "return_date"||name==="return_time") {
      setErrors((prevData) => ({
        ...prevData,
        checkoutDate: "",
      }));
    }
    if (name === "pickup_time"||name==="pickup_date") {
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const selectedPickUpDateTime = new Date(`${formData.pickup_date}T${formData.pickup_time}`);
    const selectedReturnDateTime = new Date(`${formData.return_date}T${formData.return_time}`);

    const newErrors: Partial<FormData> = {};

    if (selectedReturnDateTime <= selectedPickUpDateTime) {
      newErrors.return_date = "Check-out date and time must be after the check-in date and time.";
    }

    if (formData.phone.length < 10) {
      newErrors.phone = "Phone number must be of 10 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // console.log("here")
    if (selectedReturnDateTime > selectedPickUpDateTime && !isNaN(parseInt(formData.phone))) {
      setErrors({});
      const apiFormData = {
        movement_id: initialData.movement_id,
        pickup_time: selectedPickUpDateTime,
        return_time: selectedReturnDateTime,
        remark: formData.remark,
        name: formData.passenger_name,
        phone: parseInt(formData.phone),
        company: formData.company,
      };
        try {
          console.log(formData);
          setLoading(true);
        //   const res = await editBooking(token, apiFormData);
          setLoading(false);
          setAlert(true);
        //   setMessage(res.message);
          setReload(!reload);
        //   console.log("res: ", res);
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
    // const fetchDriverCar = async () => {
    //   const selectedCheckinDateTime = new Date(`${formData.pickup_date}T${formData.pickup_time}`);
    //   const selectedCheckoutDateTime = new Date(`${formData.return_date}T${formData.return_time}`);
    //   if (checkBox) {
    //     const roomsAvailable = await getAvailableRooms(token, selectedCheckinDateTime, selectedCheckoutDateTime);
    //     setAvailableRooms(roomsAvailable);
    //     console.log(roomsAvailable);
    //     setRoomNumberLoading(false);
    //   }
    // };
    // if (checkBox) {
    //   setRoomNumberLoading(true);
    //   fetchRooms();
    // }
    console.log(formData);
    setRoomNumberLoading(false);
  }, [checkBox]);

  const handleChangeDriver = (event: React.SyntheticEvent | null, newValue: string | null) => {
    if (newValue) {
      setNewDriver(newValue);
    }
  };
  const handleChangeCar = (event: React.SyntheticEvent | null, newValue: string | null) => {
    if (newValue) {
      setNewCar(newValue);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 -w-full">
      <div className="grid grid-cols-2 gap-4 w-full max-lg:grid-cols-1">
        <FormControl size="lg" className="my-1">
          <FormLabel className="text-[#0D141C] font-medium">Passenger Name</FormLabel>
          <Input
            name="passenger_name"
            onChange={handleChange}
            value={formData.passenger_name}
            required
            fullWidth
            size="lg"
            placeholder="Enter name of the Passenger"
          />
          {errors.passenger_name && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.passenger_name}</FormHelperText>
              </FormControl>
            )}
        </FormControl>
        <FormControl size="lg" className="my-1">
          <FormLabel className="text-[#0D141C] font-medium">Phone Number</FormLabel>
          <Input
            name="phone"
            onChange={handleChange}
            value={formData.phone}
            required
            fullWidth
            size="lg"
            placeholder="Enter phone number"
          />
          {errors.phone && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.phone}</FormHelperText>
              </FormControl>
            )}
        </FormControl>
        <FormControl size="lg" className="my-1">
          <FormLabel className="text-[#0D141C] font-medium">Company</FormLabel>
          <Input
            name="company"
            onChange={handleChange}
            value={formData.company}
            required
            fullWidth
            size="lg"
            placeholder="Enter company"
          />
          {errors.company && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.company}</FormHelperText>
              </FormControl>
            )}
        </FormControl>
        <FormControl size="lg" className="my-1">
          <FormLabel className="text-[#0D141C] font-medium">Remark</FormLabel>
          <Input
            name="remark"
            onChange={handleChange}
            value={formData.remark}
            required
            fullWidth
            size="lg"
            placeholder="Enter remark"
          />
          {errors.remark && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.remark}</FormHelperText>
              </FormControl>
            )}
        </FormControl>
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
          {errors.pickup_location && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.pickup_location}</FormHelperText>
              </FormControl>
            )}
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
          {errors.drop_location && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.drop_location}</FormHelperText>
              </FormControl>
            )}
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

          {errors.pickup_date && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.pickup_date}</FormHelperText>
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
            name="pickup_time"
            value={formData.pickup_time}
            onChange={handleChange}
          />
          {errors.pickup_time && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.pickup_time}</FormHelperText>
              </FormControl>
            )}
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
          {errors.return_date && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.return_date}</FormHelperText>
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
          {errors.return_time && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.return_time}</FormHelperText>
              </FormControl>
            )}
        </FormControl>
        <FormControl size="lg" className="my-1 hover:cursor-not-allowed">
          <FormLabel className="text-[#0D141C] font-medium">Driver</FormLabel>
          <Input
            required
            fullWidth
            size="lg"
            disabled
            name="driver"
            value={formData.driver}
            onChange={handleChange}
          />
          {errors.driver && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.driver}</FormHelperText>
              </FormControl>
            )}
        </FormControl>
        <FormControl size="lg" className="my-1 hover:cursor-not-allowed">
          <FormLabel className="text-[#0D141C] font-medium">Car Number</FormLabel>
          <Input
            required
            fullWidth
            size="lg"
            disabled
            name="carNumber"
            value={formData.car_number}
            onChange={handleChange}
          />
          {errors.car_number && (
              <FormControl error>
                {" "}
                <FormHelperText>{errors.car_number}</FormHelperText>
              </FormControl>
            )}
        </FormControl>
      </div>
      <div>
        <div>
          <FormControl>
            <div className="flex space-x-5">
              <FormLabel>Want to update driver or car ?</FormLabel>
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
            <div className="grid grid-cols-2 gap-4 w-full max-lg:grid-cols-1">
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <FormLabel id="demo-simple-select-helper-label">Driver</FormLabel>
                <Select
                  value={newDriver}
                  onChange={handleChangeDriver}
                  slotProps={{
                    listbox: {
                      sx: {
                        maxHeight: 115,
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
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <FormLabel id="demo-simple-select-helper-label">Car</FormLabel>
                <Select
                  value={newCar}
                  onChange={handleChangeCar}
                  slotProps={{
                    listbox: {
                      sx: {
                        maxHeight: 115,
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
          router.push("/admin/manage-movement");
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
