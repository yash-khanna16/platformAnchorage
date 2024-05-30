import { Button, FormControl, FormLabel } from "@mui/joy";
import Input from "@mui/joy/Input";
import React from "react";

function EditBooking() {
  return (
    <div className="space-y-10 -w-full">
      {" "}
      {/* <div className="text-3xl font-semibold mb-6 ">New Booking</div> */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <FormControl className="space-y-1">
          <FormLabel className="text-[#0D141C] font-medium">Name</FormLabel>
          <Input fullWidth size="lg" placeholder="John Smith" />
        </FormControl>

        <FormControl className="space-y-1">
          <FormLabel>Email Address</FormLabel>
          <Input fullWidth size="lg" placeholder="Email Address" />
        </FormControl>

        <FormControl className=" ">
          <FormLabel>Check In </FormLabel>
          <div className="flex space-x-2">
            <Input
              type="date"
              fullWidth
              disabled
              slotProps={{
                input: {
                  // You can set min and max dates if needed
                  // min: "2024-05-01",
                  // max: "2024-12-31",
                },
              }}
            />
            <Input
              type="time"
              fullWidth
              disabled
              slotProps={{
                input: {
                  // You can set min and max times if needed
                  // min: "09:00",
                  // max: "18:00",
                },
              }}
            />
          </div>
        </FormControl>
        <FormControl className=" ">
          <FormLabel>Check Out</FormLabel>
          <div className="flex space-x-2">
            <Input
              type="date"
              fullWidth
              slotProps={{
                input: {
                  // You can set min and max dates if needed
                  // min: "2024-05-01",
                  // max: "2024-12-31",
                },
              }}
            />
            <Input
              type="time"
              fullWidth
              slotProps={{
                input: {
                  // You can set min and max times if needed
                  // min: "09:00",
                  // max: "18:00",
                },
              }}
            />
          </div>
        </FormControl>

        <FormControl className="space-y-1">
          <FormLabel>Phone Number</FormLabel>
          <Input fullWidth size="lg" placeholder="Phone Number" />
        </FormControl>

        <FormControl className="space-y-1">
          <FormLabel className="text-[#0D141C] font-medium">
            Company Name
          </FormLabel>
          <Input fullWidth size="lg" placeholder="Company Name" />
        </FormControl>

        <FormControl className="space-y-1">
          <FormLabel>Vessel</FormLabel>
          <Input fullWidth size="lg" placeholder="Vessel" />
        </FormControl>

        <FormControl className="space-y-1">
          <FormLabel className="text-[#0D141C] font-medium">Remarks</FormLabel>
          <Input fullWidth size="lg" placeholder="Remarks" />
        </FormControl>

        <FormControl className="space-y-1">
          <FormLabel>Additional Information</FormLabel>
          <Input fullWidth size="lg" placeholder="Additional Information" />
        </FormControl>
      </div>
      <Button size="lg" fullWidth className="" >
        Edit Booking
      </Button>
    </div>
  );
}

export default EditBooking;
