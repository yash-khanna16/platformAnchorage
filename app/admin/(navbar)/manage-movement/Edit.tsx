import { editMovement, fetchAvailableCars, fetchAvailableDrivers } from "@/app/actions/api";
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
import { Box, Typography, IconButton, DialogActions } from "@mui/material";
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
    passenger_name: string;
    phone: string;
    remark: string;
    company: string | null;
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
    passenger_name: string;
    phone: string;
    remark: string;
    company: string | null;
  }[];
};

interface EditMovementProps {
  selectedData: MovementType;
}

const Edit: React.FC<EditMovementProps> = ({ selectedData }) => {
  const [pickup_date, pickup_time] = selectedData.pickup_time.split(" ");
  const [return_date, return_time] = selectedData.return_time.split(" ");
  console.log(pickup_date,pickup_time,return_date,return_time);
  const [formData, setFormData] = useState<EditMovementType>({
    ...selectedData,
    pickup_date: pickup_date,
    pickup_time: pickup_time,
    return_date: return_date,
    return_time: return_time,
  });

  return (
    <div className="mt-10 border p-5 rounded-md">
      <Typography className="text-4xl text-center mb-2 max-[960px]:text-3xl" component="div" fontWeight="bold">
        Movement Details
      </Typography>
      <form>
        <div className="grid grid-cols-2 gap-4 w-full max-lg:grid-cols-1">
          <FormControl size="lg" className="my-1">
            <FormLabel className="text-[#0D141C] font-medium">Pick Up Location</FormLabel>
            <Input
              name="pickup_location"
              // onChange={handleChange}
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
              // onChange={handleChange}
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
              // onChange={handleChange}
            />
            
            {/* {errors.pickup_date && (
            <FormControl error>
              {" "}
              <FormHelperText>{errors.pickup_date}</FormHelperText>
            </FormControl>
          )} */}
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
              // onChange={handleChange}
            />
            {/* {errors.pickup_time && (
            <FormControl error>
              {" "}
              <FormHelperText>{errors.pickup_time}</FormHelperText>
            </FormControl>
          )} */}
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
              // onChange={handleChange}
            />
            {/* {errors.return_date && (
            <FormControl error>
              {" "}
              <FormHelperText>{errors.return_date}</FormHelperText>
            </FormControl>
          )} */}
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
              // onChange={handleChange}
            />
            {/* {errors.return_time && (
            <FormControl error>
              {" "}
              <FormHelperText>{errors.return_time}</FormHelperText>
            </FormControl>
          )} */}
          </FormControl>
        </div>
      </form>
    </div>
  );
};

export default Edit;
