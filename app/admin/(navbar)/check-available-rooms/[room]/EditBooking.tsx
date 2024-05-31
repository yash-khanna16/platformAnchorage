import { Button, FormControl, FormLabel } from "@mui/joy";
import Input from "@mui/joy/Input";
import React from "react";

function EditBooking() {
  return (
    <div className="space-y-10 -w-full">
      {" "}
      {/* <div className="text-3xl font-semibold mb-6 ">New Booking</div> */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <FormControl size="md" className="space-y-1">
          <FormLabel className="text-[#0D141C] font-medium">Name</FormLabel>
          <Input fullWidth size="md" placeholder="John Smith" />
        </FormControl>

        <FormControl size="md" className="space-y-1">
          <FormLabel>Email Address</FormLabel>
          <Input fullWidth size="md" placeholder="Email Address" />
        </FormControl>

        <FormControl size="md" className=" ">
          <FormLabel>Check In </FormLabel>
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
        <FormControl size="md" className=" ">
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

        <FormControl size="md" className="space-y-1">
          <FormLabel>Phone Number</FormLabel>
          <Input fullWidth size="md" placeholder="Phone Number" />
        </FormControl>

        <FormControl size="md" className="space-y-1">
          <FormLabel className="text-[#0D141C] font-medium">
            Company Name
          </FormLabel>
          <Input fullWidth size="md" placeholder="Company Name" />
        </FormControl>

        <FormControl size="md" className="space-y-1">
          <FormLabel>Vessel</FormLabel>
          <Input fullWidth size="md" placeholder="Vessel" />
        </FormControl>

        <FormControl size="md" className="space-y-1">
          <FormLabel>Rank</FormLabel>
          <Input fullWidth size="md" placeholder="Rank" />
        </FormControl>

        <FormControl size="md" className="space-y-1">
          <FormLabel className="text-[#0D141C] font-medium">Remarks</FormLabel>
          <Input fullWidth size="md" placeholder="Remarks" />
        </FormControl>

        <FormControl size="md" className="space-y-1">
          <FormLabel>Additional Information</FormLabel>
          <Input fullWidth size="md" placeholder="Additional Information" />
        </FormControl>
        <FormControl size="md" className="flex space-y-1  ">
          <FormLabel>Meals</FormLabel>
          <div className=" ">
            <div className="grid grid-cols-2 w-full items-center gap-x-2 gap-y-2">
              <div className="w-full">
                <FormControl size="sm">
                  <FormLabel>Breakfast</FormLabel>
                </FormControl>
                <Input
                  
                  type="number"
                  size="sm"
                  placeholder="Breakfast"
                />
              </div>
              <div className="w-full">
                <FormControl size="sm">
                  <FormLabel>Veg</FormLabel>
                </FormControl>

                <Input  type="number" size="sm" placeholder="Veg" />
              </div>
              <div className="w-full">
                <FormControl size="sm">
                  <FormLabel>Non Veg</FormLabel>
                </FormControl>
                <Input
                  
                  type="number"
                  size="sm"
                  placeholder="Non Veg"
                />
              </div>
            </div>
          </div>
        </FormControl>
      </div>
      <Button size="md" fullWidth className="" >
        Edit Booking
      </Button>
    </div>
  );
}

export default EditBooking;
