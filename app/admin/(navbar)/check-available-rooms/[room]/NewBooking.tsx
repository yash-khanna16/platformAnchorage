import { addNewBooking } from "@/app/actions/api";
import {
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import Input from "@mui/joy/Input";
import { FormHelperText, Snackbar } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import Lottie from "lottie-web";
import React, { useEffect, useRef, useState } from "react";
import { CheckCircle } from "@mui/icons-material";

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
  breakfast: number;
  veg: number;
  nonVeg: number;
}

function NewBooking(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const tick = useRef(null);
  const [minCheckinDate, setMinCheckinDate] = useState<string>("");
  const [minCheckinTime, setMinCheckinTime] = useState<string>("");
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");

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
    remarks: "",
    additionalInfo: "",
    breakfast: 0,
    veg: 0,
    nonVeg: 0,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type} = e.target;
    if (type === "number") {
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

    if (selectedCheckinDateTime <= currentDate) {
      newErrors.checkinDate =
        "Check-in date and time must be after the current date and time.";
    }

    if (selectedCheckoutDateTime <= currentDate) {
      newErrors.checkoutDate =
        "Check-out date and time must be after the current date and time.";
    }

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

    if (
      selectedCheckinDateTime > currentDate &&
      selectedCheckoutDateTime > currentDate &&
      selectedCheckoutDateTime > selectedCheckinDateTime &&
      !isNaN(parseInt(formData.phoneNumber))
    ) {
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
        phone: parseInt(formData.phoneNumber),
        company: formData.companyName,
        vessel: formData.vessel,
        rank: formData.rank,
        breakfast: formData.breakfast,
      };
      try {
        setLoading(true);
        const res = await addNewBooking(apiFormData);
        setLoading(false);
        if (message === "Room booked successfully!") {
          setOpen(true);
        } else {
          setAlert(true)
          setMessage(res.message)
        }
        // router.push("/check-available-rooms");
        console.log("res: ", res);
      } catch (error) {
        setLoading(false);
        setAlert(true)
        setMessage("Something went wrong, Please try again!")
        console.log("error: ", error);
      }

      console.log("Form submitted: ", formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 -w-full">
      <div className="text-3xl font-semibold mb-6">New Booking</div>
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
      <Button loading={loading} type="submit" size="lg" className="w-1/2">
        Book Now
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
          <DialogTitle className="">Booking Confirmation</DialogTitle>
          <DialogContent className="h-fit">
            <div className="flex flex-col h-56 items-center overflow-hidden ">
              <CheckCircle className="h-40 scale-[500%] text-green-600" />
              <div className="font-semibold text-2xl">
                Room Booked Successfully!
              </div>
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
  onClose={()=>{setAlert(false)}}
  message={message}
/>
    </form>
  );
}

export default NewBooking;
