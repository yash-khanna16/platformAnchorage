"use client";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  Modal,
  ModalDialog,
  Snackbar,
  Stack,
  Chip,
  Typography,
  Divider
} from "@mui/joy";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FormLabel } from "@mui/joy";
import { getRole, addNewBooking, addNewRoom, deleteRoom, getAvailableRooms, getInstantRooms } from "@/app/actions/api";
import { CircularProgress } from "@mui/material";
import { Add, Cancel, Close, DeleteForever, Info, WarningRounded } from "@mui/icons-material";
import { getAuthAdmin } from "@/app/actions/cookie";


type Room = {
  name: string;
  status: string;
  upcoming: string;
};

function CheckAvailableRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [minCheckinDate, setMinCheckinDate] = useState<string>("");
  const [minCheckinTime, setMinCheckinTime] = useState<string>("");
  const [checkinDate, setCheckinDate] = useState<string>("");
  const [checkinTime, setCheckinTime] = useState<string>("");
  const [checkoutTime, setCheckoutTime] = useState<string>("");
  const [checkoutDate, setCheckoutDate] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState("");
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [del, setDel] = useState(false);
  const [delId, setDelId] = useState("");
  const [admin, setAdmin] = useState("admin");
  const [token, setToken] = useState("");

  useEffect(() => {
    getAuthAdmin().then(auth => {
      if (auth)
        setToken(auth.value);
    });
  }, []);

  async function handleDelete() {
    try {
      setLoading(true);
      const res = await deleteRoom(token, delId);
      setMessage(res.message);
      setAlert(true);
      setDel(false);
      setLoading(false);
      setReload(!reload);
    } catch (error) {
      setDel(false);
      setLoading(false);
      setMessage("Something went wrong, Please try again later!");
      setAlert(true);
    }
  }

  useEffect(() => {
    const getTokenData = async () => {
      try {
        const role = await getRole();
        setAdmin(role);
      } catch (error) {
        console.error('Failed to parse token:', error);
      }
    };
    getTokenData();
  }, []);

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

  async function handleAddRoom() {
    setLoading(true);
    try {
      const response = await addNewRoom(token, room);
      setAlert(true);
      setMessage(response.message);
      setReload(!reload);
      setLoading(false);
      setOpen(false);
    } catch (error) {
      setAlert(true);
      setLoading(false);
      setMessage("Something went wrong, Please try again later!");
      setOpen(false);
    }
  }

  const handleCheckoutTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTime = e.target.value;
    const checkoutDateTime = new Date(`${checkinDate}T${selectedTime}`);
    const checkinDateTime = new Date(`${checkinDate}T${checkinTime}`);

    if (checkoutDate === checkinDate && selectedTime <= checkinTime) {
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
    if (selectedDate === checkinDate && checkoutTime <= checkinTime) {
      setError(
        "Check-out date and time must be greater than check-in date and time."
      );
    } else {
      setError("");
    }
    setCheckoutDate(selectedDate);
  };

  useEffect(() => {
    if (token !== "") {
      setLoading(true);
      getInstantRooms(token)
        .then((res) => {
          setLoading(false);
          let newRooms: Room[] = [];
          res.map((room: { room: string; status: string, upcoming: boolean }) => {
            newRooms.push({
              status: room.status,
              name: room.room,
              upcoming: room.upcoming ? "Upcoming" : "",
            });
          });
          console.log("new rooms: ", newRooms);
          setRooms(newRooms);
          console.log(res);
        })
        .catch((error) => {
          setLoading(false);
          console.log("error");
        });
    }
  }, [reload, token]);

  const handleSubmit = async () => {
    const checkinDateTime = new Date(`${checkinDate}T${checkinTime}`);
    const checkoutDateTime = new Date(`${checkoutDate}T${checkoutTime}`);
    if (error === "") {
      console.log("Search for available rooms");
      try {
        setLoading(true);
        const res = await getAvailableRooms(token, checkinDateTime, checkoutDateTime);
        let newRooms: Room[] = [];
        console.log(res);
        res.map((room: { room: string; condition_met: string }) => {
          newRooms.push({
            name: room.room,
            status: "Available",
            upcoming: "",
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
    <div className="mx-4 p-4 my-5 max-[1050px]:mx-0 flex h-[95vh] space-y-4 font-medium max-[920px]:flex-col">
      <div className="checkin-checkout-input flex flex-col w-[35vw] border-r h-full py-2 pr-6 space-y-2  max-[960px]:w-[70%] max-[500px]:w-full mx-auto max-[920px]:border-none">
        <div className="text-2xl font-semibold mb-6">Check Available Rooms</div>
        <div>
          <div className="space-y-6">
            <div>Check-In </div>
            <div className="flex max-[1300px]:flex-col space-x-2 max-[1300px]:space-x-0 max-[1300px]:space-y-3">
              <Input
                type="date"
                fullWidth
                value={checkinDate}
                onChange={handleCheckinDateChange}
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
            <div className="flex max-[1300px]:flex-col space-x-2 max-[1300px]:space-x-0 max-[1300px]:space-y-3">
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
      <div className="px-8 w-[90%] max-[920px]:w-full max-[920px]:px-1">
        <div className="flex justify-between">
          <div className="text-2xl font-semibold mb-6">Choose room</div>
          {(admin === "superadmin") && (
            <div>
              <Button
                variant="outlined"
                onClick={() => setOpen(true)}
                color="neutral"
                startDecorator={<Add />}
              >
                Add Room
              </Button>
            </div>
          )}
        </div>
        <div
          className={`${loading && "justify-center items-center"} flex gap-x-4 gap-y-4 flex-wrap`}
        >
          {loading && <CircularProgress />}
          {!loading &&
            rooms.map((room, key) => (
              <div
                onClick={() => {
                  router.push(`/admin/manage-rooms/${room.name}`);
                }}
                key={key}
                className={`border relative hover:bg-slate-100 transition-all duration-500 space-y-1 p-4 w-[168px] cursor-pointer h-20 rounded-lg`}
              >
                {(admin === "superadmin") && (
                  <div
                    onClick={(event) => { event.stopPropagation(); setDel(true); setDelId(room.name); }}
                    className="absolute -right-[18px] rounded-full z-20 -top-[20px] text-slate-400 scale-[70%] hover:bg-red-50 p-2 "
                  >
                    <Cancel />
                  </div>
                )}
                <div className="flex justify-between">
                  <div>
                    <div className="text-[#1C1C21] font-bold">{room.name}</div>
                    <div
                      className={`${room.status === "Booked" || room.status === "4/4"
                        ? "text-red-600"
                        : room.status === "0/4" || room.status === "Available"
                          ? "text-green-600"
                          : "text-orange-500"
                        } text-sm font-medium`}
                    >
                      {room.status}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {room.upcoming==="Upcoming"?(<Chip size="sm" variant="outlined" color="warning">
                    {room.upcoming}
                  </Chip>):(" ")}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Add New Room</DialogTitle>
          <DialogContent>Enter details of the new room. </DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setOpen(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Room Number</FormLabel>
                <Input
                  value={room}
                  onChange={(e) => {
                    setRoom(e.target.value);
                  }}
                  autoFocus
                  required
                />
              </FormControl>
              <Button onClick={handleAddRoom} loading={loading} type="submit">
                Submit
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
      <Snackbar
        open={alert}
        autoHideDuration={5000}
        onClose={() => {
          setAlert(false);
        }}
      >
        <Info /> {message}{" "}
        <span
          onClick={() => setAlert(false)}
          className="cursor-pointer hover:bg-[#f3eded]"
        >
          <Close />
        </span>{" "}
      </Snackbar>
      <Modal
        open={del}
        onClose={() => {
          setDel(false);
        }}
      >
        <ModalDialog variant="outlined" size="md">
          <DialogTitle>
            <WarningRounded />
            Confirmation
          </DialogTitle>
          <Divider />
          <div>Are you sure you want to delete room {delId} ?</div>
          <DialogActions>
            <Button
              variant="solid"
              color="danger"
              loading={loading}
              onClick={handleDelete}
            >
              Confirm
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setDel(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </div>
  );
}

export default CheckAvailableRooms;
