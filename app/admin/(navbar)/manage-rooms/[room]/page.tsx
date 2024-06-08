"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, FormControl, FormHelperText, FormLabel } from "@mui/joy";
import Input from "@mui/joy/Input";
import NewBooking from "./NewBooking";
import Reservations from "./Reservations";
import { useDebouncedCallback } from "use-debounce";
import { getBookingsByRoom } from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";

type ReservationType = {
  id: number;
  name: string;
  checkin: string;
  checkout: string;
  email: string;
  phone: string;
  company: string;
  vessel: string;
  remarks: string;
  additionalInfo: string;
};

function Room() {
  const params = useParams();
  const { room } = params;
  const columns = [
    "booking_id",
    "name",
    "checkin",
    "checkout",
    "email",
    "guest_email",
    "phone",
    "company",
    "vessel",
    "remarks",
    "additional_info",
    "breakfast",
    "meal_non_veg",
    "meal_veg",
    "rank",
  ];
  const headers = [
    "ID",
    "Name",
    "Check In",
    "Check Out",
    "Email",
    "Guest Email",
    "Phone No.",
    "Company",
    "Vessel",
    "Remarks",
    "Additional Information",
    "Breakfast",
    "Non-Veg Meal",
    "Veg Meal",
    "Rank",
  ];
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ReservationType[]>([]);
  const [reload, setReload] = useState(false);
  const router = useRouter();
  const [filteredRows, setFilteredRows] = useState<ReservationType[]>([]);
  const [token, setToken] = useState("")

  useEffect(() => {
    getAuthAdmin().then(auth => {
      if(auth)
        setToken(auth.value);
    })
  },[])

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  async function getBookings(room: string) {
    try {
      setLoading(true);
      let fetchedRows = await getBookingsByRoom(token, room);
      console.log(fetchedRows);
      fetchedRows = fetchedRows.map((row: ReservationType) => ({
        ...row,
        checkin: formatDate(row.checkin),
        checkout: formatDate(row.checkout),
      }));
      setRows(fetchedRows);
      setFilteredRows(fetchedRows);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    if (token !== "") {
      getBookings(room as string);
    }
  }, [room, reload, token]);

  const handleSearch = () => {
    if (search.trim() === "") {
      setFilteredRows(rows);
    } else {
      const lowercasedSearch = search.toLowerCase();
      const filtered = rows.filter((row) =>
        row.name.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredRows(filtered);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [search, rows]);

  return (
    <div className="my-11">
      <div className="space-y-10 w-[70vw] mx-auto">
        <div className="flex space-x-2 font-medium">
          <div
            onClick={() => {
              router.push("/admin/manage-rooms");
            }}
            className="text-[#637587] cursor-pointer hover:underline"
          >
            Rooms
          </div>
          <div>/</div>
          <div className="text-[#121417]"> {room} </div>
        </div>
        <NewBooking setReload={setReload} reload={reload} />
        <Reservations
          rowsData={filteredRows}
          columns={columns}
          loading={loading}
          search={search}
          setReload={setReload}
          reload={reload}
          setSearch={setSearch}
          handleSearch={handleSearch}
          headers={headers}
        />
      </div>
    </div>
  );
}

export default Room;
