"use client";
import { Button, Input, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FormLabel } from "@mui/joy";
import { getAvailableRooms } from "@/app/actions/api";
import { CircularProgress } from "@mui/material";

type Room = {
  name: string;
  status: string;
};

function CheckAvailableRooms() {
  // const rooms: Room[] = [
  //   { name: "201", status: "Available" },
  //   { name: "202", status: "Booked" },
  //   { name: "203", status: "Available" },
  //   { name: "204", status: "Available" },
  //   { name: "205", status: "Booked" },
  //   { name: "206", status: "Booked" },
  //   { name: "207", status: "Available" },
  //   { name: "208", status: "Booked" },
  // ];
  const [rooms, setRooms] = useState<Room[]>([]);

  const router = useRouter();

  const [minCheckinDate, setMinCheckinDate] = useState<string>("");
  const [minCheckinTime, setMinCheckinTime] = useState<string>("");
  const [checkinDate, setCheckinDate] = useState<string>("");
  const [checkinTime, setCheckinTime] = useState<string>("");
  const [checkoutTime, setCheckoutTime] = useState<string>("");
  const [checkoutDate, setCheckoutDate] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const formattedTime = currentDate.toTimeString().split(" ")[0].slice(0, 5); // HH:MM
    setMinCheckinDate(formattedDate);
    setMinCheckinTime(formattedTime);
  }, []);

  const handleCheckinDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckinDate(e.target.value);
    if (e.target.value === minCheckinDate && checkinTime < minCheckinTime) {
      setCheckinTime(minCheckinTime);
    }
    setError("");
  };

  const handleCheckoutTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTime = e.target.value;
    const checkoutDateTime = new Date(`${checkinDate}T${selectedTime}`);
    const checkinDateTime = new Date(`${checkinDate}T${checkinTime}`);

    if (checkoutDateTime <= checkinDateTime) {
      setError(
        "Check-out date and time must be greater than check-in date and time."
      );
    } else {
      setError("");
    }

    setCheckoutTime(selectedTime);
  };

  const handleCheckinTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTime = e.target.value;
    if (checkinDate === minCheckinDate && selectedTime < minCheckinTime) {
      setError(
        `Check-in time cannot be earlier than ${minCheckinTime} on the selected date.`
      );
    } else {
      setError("");
    }
    setCheckinTime(selectedTime);
  };

  const handleCheckoutDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;

    // If the selected date is the same as the check-in date,
    // ensure that the check-out time is after the check-in time.
    if (
      selectedDate === checkinDate &&
      checkinTime !== "" &&
      checkinTime >= checkoutTime
    ) {
      setError("Check-out date must be after check-in date.");
    } else {
      setError("");
    }

    setCheckoutDate(selectedDate);
  };

  useEffect(() => {
    setLoading(true)
    getAvailableRooms(new Date(), new Date())
      .then((res) => {
        setLoading(false)
        let newRooms: Room[] = [];
        res.map((room: { room: string; condition_met: string }) => {
          newRooms.push({
            name: room.room,
            status: "Available",
          });
        });
        console.log("new rooms: ", newRooms)
        setRooms(newRooms);
        console.log(res);
      })
      .catch((error) => {
        setLoading(false)
        console.log("errror");
      });
  }, []);

  const handleSubmit = async () => {
    const checkinDateTime = new Date(`${checkinDate}T${checkinTime}`);
    const checkoutDateTime = new Date(`${checkoutDate}T${checkoutTime}`);
    if (checkinDate === minCheckinDate && checkinTime < minCheckinTime) {
      setError(
        `Check-in time cannot be earlier than ${minCheckinTime} on the selected date.`
      );
    } else {
      setError("");
      console.log("Search for available rooms");
      try {
        setLoading(true);
        const res = await getAvailableRooms(checkinDateTime, checkoutDateTime);
        let newRooms: Room[] = [];
        console.log(res)
        res.map((room: { room: string; condition_met: string }) => {
          newRooms.push({
            name: room.room,
            status: "Available",
          });
        });
        setRooms(newRooms);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  return (
    <div className="mx-4 p-4 my-5 flex h-[95vh] space-y-4 font-medium">
      <div className="checkin-checkout-input flex flex-col w-[35vw] border-r h-full py-2 pr-6 space-y-2">
        <div className="text-2xl font-semibold mb-6">Check Available Rooms</div>
        <div>
          <div className="space-y-6">
            <div>Check-In </div>
            <div className="flex space-x-2">
              <Input
                type="date"
                fullWidth
                value={checkinDate}
                onChange={handleCheckinDateChange}
                slotProps={{
                  input: {
                    min: minCheckinDate,
                  },
                }}
              />
              <Input
                type="time"
                fullWidth
                value={checkinTime}
                onChange={handleCheckinTimeChange}
                slotProps={{
                  input: {
                    min: minCheckinTime,
                  },
                }}
              />
            </div>
            <div>Check-Out</div>
            <div className="flex space-x-2">
              <Input
                fullWidth
                type="date"
                onChange={handleCheckoutDateChange}
                slotProps={{
                  input: {
                    min: checkinDate || minCheckinDate,
                  },
                }}
              />
              <Input
                onChange={handleCheckoutTimeChange}
                type="time"
                fullWidth
              />
            </div>
            {error !== "" && (
              <div className="mt-2">
                <FormLabel sx={{ color: "red" }}>{error}</FormLabel>
              </div>
            )}

            <Button fullWidth size="sm" onClick={handleSubmit}>
              Search
            </Button>
          </div>
        </div>
      </div>
      <div className="px-8 w-[90%]">
        <div className="text-2xl font-semibold mb-6">Choose room</div>
        <div className={`${loading && "justify-center items-center"} flex gap-x-4 gap-y-4 flex-wrap`}>
          {loading && <CircularProgress />}
          {!loading && (
            rooms.map((room, key) => {
              return (
                <div
                  onClick={() => {
                    router.push(`/admin/check-available-rooms/${room.name}`);
                  }}
                  key={key}
                  className={`border hover:bg-slate-100 transition-all duration-500 space-y-1 p-4 w-[168px] cursor-pointer h-20 rounded-lg`}
                >
                  <div className="text-[#1C1C21] font-bold">{room.name}</div>
                  <div
                    className={`${
                      room.status === "Booked" ? "text-red-600" : "text-green-600"
                    } text-sm font-normal`}
                  >
                    {room.status}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckAvailableRooms;
