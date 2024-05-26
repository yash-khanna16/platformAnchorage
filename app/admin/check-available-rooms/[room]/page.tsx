"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, FormControl, FormHelperText, FormLabel } from "@mui/joy";
import Input from "@mui/joy/Input";
import NewBooking from "./NewBooking";
import Reservations from "./Reservations";

function Room() {
  const params = useParams();
  const { room } = params;
  const router = useRouter();

  return (
    <div className=" my-11 ">
      <div className="space-y-10 w-[60vw] mx-auto">
        <div className="flex space-x-2  font-medium">
          <div onClick={()=>{router.push("/admin/check-available-rooms")}} className="text-[#637587] cursor-pointer hover:underline ">Rooms</div>
          <div>/</div>
          <div className="text-[#121417]"> {room} </div>
        </div>
        <NewBooking />
        <Reservations  />    
      </div>
    </div>
  );
}

export default Room;
