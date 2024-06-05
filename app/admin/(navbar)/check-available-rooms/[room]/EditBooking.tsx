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
  Snackbar
} from "@mui/joy";
import Input from "@mui/joy/Input";
import { Alert, FormHelperText } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import Lottie from "lottie-web";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { CheckCircle, Close, Info } from "@mui/icons-material";
import { getAuthAdmin } from "@/app/actions/cookie";


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
  veg: number;
  nonVeg: number;
}

function EditBooking({
  initialData,
  setOpenModal,
  setReload,
  reload
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
  const [minCheckinDate, setMinCheckinDate] = useState<string>("");
  const [minCheckinTime, setMinCheckinTime] = useState<string>("");
  const [token, setToken] = useState("")

  useEffect(() => {
    getAuthAdmin().then(auth => {
      if(auth)
        setToken(auth.value);
    })
  },[])

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const formattedTime = currentDate.toTimeString().split(" ")[0].slice(0, 5); // HH:MM
    setMinCheckinDate(formattedDate);
    setMinCheckinTime(formattedTime);
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

  const room = params.room as string;
  const [formData, setFormData] = useState<FormData>(initialData);

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type} = e.target;
    
    if (type === "number") {
      console.log(name, value, type)
      setFormData((prevData) => ({
        ...prevData,
        [name]: parseInt(value),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
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
    setErrors((prevData) => ({
      ...prevData,
      [name]: "",
    }));
    // For other fields, simply update the state with the provided value
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentDate = new Date();
    const selectedCheckinDateTime = new Date(
      `${formData.checkinDate}T${formData.checkinTime}`
    );
    const selectedCheckoutDateTime = new Date(
      `${formData.checkoutDate}T${formData.checkoutTime}`
    );

    const newErrors: Partial<FormData> = {};

    if (selectedCheckoutDateTime <= selectedCheckinDateTime) {
      newErrors.checkoutDate =
        "Check-out date and time must be after the check-in date and time.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // console.log("here")

    if (
      selectedCheckoutDateTime > selectedCheckinDateTime &&
      !isNaN(parseInt(formData.phoneNumber))
    ) {
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
        room: room,
        name: formData.name,
        phone: parseInt(formData.phoneNumber),
        company: formData.companyName,
        vessel: formData.vessel,
        rank: formData.rank,
        breakfast: (formData.breakfast),
      };
      try {
        console.log(formData)
        setLoading(true);
        const res = await editBooking(token,apiFormData);
        setLoading(false);
        setAlert(true);
        setMessage(res.message);
        setReload(!reload);
        // setOpenModal(false);
        // router.push("/check-available-rooms");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-10 -w-full">
      <div className="grid grid-cols-2 gap-4 w-full">
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
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            size="lg"
            placeholder="Email Address"
          />
          {errors.email && (
            <FormHelperText error>{errors.email}</FormHelperText>
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
              disabled
              fullWidth
              name="checkinDate"
              size="lg"
              value={formData.checkinDate}
              onChange={handleChange}
              slotProps={{
                input: {
                  min: minCheckinDate,
                },
              }}
              error={
                errors.checkinDate !== undefined && errors.checkinDate !== ""
              }
            />
            <Input
              required
              type="time"
              fullWidth
              size="lg"
              disabled
              name="checkinTime"
              value={formData.checkinTime}
              error={
                errors.checkinDate !== undefined && errors.checkinDate !== ""
              }
              onChange={handleChange}
            />
          </div>

          {errors.checkinDate && (
            <FormHelperText error>{errors.checkinDate}</FormHelperText>
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
              slotProps={{
                input: {
                  min: formData.checkinDate || minCheckinDate,
                },
              }}
              error={
                errors.checkoutDate !== undefined && errors.checkoutDate !== ""
              }
              onChange={handleChange}
            />
            <Input
              required
              type="time"
              fullWidth
              size="lg"
              name="checkoutTime"
              error={
                errors.checkoutDate !== undefined && errors.checkoutDate !== ""
              }
              value={formData.checkoutTime}
              onChange={handleChange}
            />
          </div>
          {errors.checkoutDate && (
            <FormHelperText error>{errors.checkoutDate}</FormHelperText>
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
            size="lg"
            placeholder="Phone Number"
          />
        </FormControl>

        <FormControl size="lg" className="space-y-1">
          <FormLabel className="text-[#0D141C] font-medium">
            Company Name
          </FormLabel>
          <Input
            required
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
          <Input
            value={formData.vessel}
            name="vessel"
            onChange={handleChange}
            required
            fullWidth
            size="lg"
            placeholder="Vessel"
          />
        </FormControl>

        <FormControl size="lg" className="space-y-1">
          <FormLabel>Rank</FormLabel>
          <Input
            value={formData.rank}
            name="rank"
            onChange={handleChange}
            required
            fullWidth
            size="lg"
            placeholder="Rank"
          />
        </FormControl>

        <FormControl size="lg" className="space-y-1">
          <FormLabel className="text-[#0D141C] font-medium">Remarks</FormLabel>
          <Input
            value={formData.remarks}
            name="remarks"
            onChange={handleChange}
            fullWidth
            size="lg"
            placeholder="Remarks"
          />
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

        <div className="space-y-1">
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
        </div>
      </div>
      <Button loading={loading} type="submit" size="lg" fullWidth>
        Edit Booking
      </Button>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          router.push("/admin/check-available-rooms");
        }}
      >
        <ModalDialog size="lg">
          <ModalClose />
          <DialogTitle className="">Edit Confirmation</DialogTitle>
          <DialogContent className="h-fit">
            <div className="flex flex-col h-56 items-center overflow-hidden ">
              {/* <CheckCircle className="h-40 scale-[500%] text-green-600" /> */}
              <div className="font-semibold text-2xl">
                Entry Edited successfully
              </div>
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
        <span
          onClick={() => setAlert(false)}
          className="cursor-pointer hover:bg-[#f3eded]"
        >
          <Close />
        </span>{" "}
      </Snackbar>
    </form>
  );
}

export default EditBooking;
