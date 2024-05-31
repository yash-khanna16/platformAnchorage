"use client"
import { Button, Input } from "@mui/joy";
import { useRouter } from "next/navigation";
import React from "react";

function CheckAvailableRooms() {
  const rooms = [
    { name: "201", status: "Available" },
    { name: "202", status: "Booked" },
    { name: "203", status: "Available" },
    { name: "204", status: "Available" },
    { name: "205", status: "Booked" },
    { name: "206", status: "Booked" },
    { name: "207", status: "Available" },
    { name: "208", status: "Booked" },
  ];
  const router = useRouter();
  return (
    <div className="mx-4 p-4 my-5 flex h-[95vh] space-y-4 font-medium ">
      <div className="checkin-checkout-input flex flex-col w-[35vw] border-r h-full py-2 pr-6 space-y-2">
        <div className="text-2xl font-semibold mb-6">
          {" "}
          Check Available Rooms
        </div>
        <div>
          <div className=" space-y-6">
            <div>Check-In </div>
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
            <div>Check-Out</div>
            <div className="flex space-x-2">
              <Input
                fullWidth
                type="date"
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
            <Button fullWidth size="sm">
              Search
            </Button>
          </div>
        </div>
      </div>
      <div className=" px-8">
        <div className="text-2xl font-semibold mb-6 ">Choose room</div>
        <div className="flex gap-x-4  gap-y-4 flex-wrap">
          {rooms.map((room, key) => {
            return (
              <div
              onClick={()=>{router.push(`/admin/check-available-rooms/${room.name}`)}}
                key={key}
                className={`border hover:bg-slate-100 transition-all duration-500 space-y-1  p-4 w-[168px] cursor-pointer h-20 rounded-lg`}
              >
                <div className="text-[#1C1C21] font-bold">{room.name}</div>
                <div className={`${room.status === "Booked"?"text-red-600":"text-green-600"} text-sm font-normal`}>
                  {room.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CheckAvailableRooms;
