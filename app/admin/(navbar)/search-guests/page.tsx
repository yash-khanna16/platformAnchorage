"use client"
import React, { useEffect, useState } from 'react'
import Reservations from '../check-available-rooms/[room]/Reservations'
import { searchAllGuests } from '@/app/actions/api';
import { useDebouncedCallback } from "use-debounce";


type ReservationType = {
  additional_info: string | null;
  booking_id: string;
  breakfast: string | null;
  checkin: string;
  checkout: string;
  company: string;
  email: string;
  guest_email: string;
  meal_non_veg: number;
  meal_veg: number;
  name: string;
  phone: string;
  rank: string | null;
  remarks: string;
  room: string;
  vessel: string;
};


function Guests() {
  // const columns = ["id", "name","roomNumber", "checkin", "checkout", "email",  "phone", "company", "vessel", "remarks", "additionalInfo",]
  // const headers = ["ID", "Name","Room No.", "Check In", "Check Out", "Email", "Phone No,", "Company", "Vessel", "Remarks", "Additional Information"]
  const columns = ["booking_id", "name", "room", "checkin", "checkout", "email", "guest_email", "phone", "company", "vessel", "remarks", "additional_info", "breakfast", "meal_non_veg", "meal_veg", "rank"];
  const headers = ["ID", "Name", "Room No.", "Check In", "Check Out", "Email", "Guest Email", "Phone No.", "Company", "Vessel", "Remarks", "Additional Information", "Breakfast", "Non-Veg Meal", "Veg Meal", "Rank"];
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ReservationType[]>([]);
  const [reload, setReload] = useState(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  async function getSearch(search:string) {
    try {
      setLoading(true);
      let fetchedRows = await searchAllGuests(search);
      fetchedRows = fetchedRows.map((row:ReservationType)=> ({
        ...row,
        checkin: formatDate(row.checkin),
        checkout: formatDate(row.checkout)
      }));
      setRows(fetchedRows);
      setLoading(false);
    } catch(error) {
      setLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    if(search.trim() !== "") {
      getSearch(search);
    } else {
      setRows([])
    }
  },[reload])
  

  const handleSearch = useDebouncedCallback((search) => {
    if(search.trim() !== "") {
      getSearch(search);
    } else {
      setRows([]);
    }
  }, 500);

  return (
    <div className=' my-11 mx-32'>
      <Reservations reload={reload} setReload={setReload} loading={loading} handleSearch={handleSearch} search={search} setSearch={setSearch} rowsData={rows}  columns={columns} headers={headers} />
    </div>
  )
}

export default Guests