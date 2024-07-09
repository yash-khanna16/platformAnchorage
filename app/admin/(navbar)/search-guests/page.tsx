"use client"
import React, { useEffect, useState } from 'react'
import Reservations from '../manage-rooms/[room]/Reservations'
import { searchAllGuests } from '@/app/actions/api';
import { useDebouncedCallback } from "use-debounce";
import { getAuthAdmin } from '@/app/actions/cookie';


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
  const columns = ["status","name", "room", "checkin", "checkout", "email", "phone", "company", "vessel", "remarks", "additional_info", "breakfast", "meal_non_veg", "meal_veg", "rank"];
  const headers = ["Status","Name", "Room No.", "Check In", "Check Out", "Email", "Phone No.", "Company", "Vessel", "Remarks", "Additional Information", "Breakfast", "Non-Veg Meal", "Veg Meal", "Rank"];
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ReservationType[]>([]);
  const [reload, setReload] = useState(false);
  const [token, setToken] = useState("")
  const [filteredRows, setFilteredRows] = useState<ReservationType[]>([])

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

  async function getGuests() {
    try {
      setLoading(true);
      let fetchedRows = await searchAllGuests(token);
      console.log(fetchedRows);
  
      const currentTime = new Date();
  
      fetchedRows = fetchedRows.map((row: ReservationType) => {
        const checkinTime = new Date(row.checkin);
        const checkoutTime = new Date(row.checkout);
  
        let status;
        if (checkoutTime < currentTime) {
          status = "Expired";
        } else if (checkinTime > currentTime) {
          status = "Upcoming";
        } else {
          status = "Active";
        }
  
        return {
          ...row,
          checkin: formatDate(row.checkin),
          checkout: formatDate(row.checkout),
          status: status,
        };
      });
  
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
      getGuests();
    }
  }, [reload, token]);

  const handleSearch = () => {
    if (search.trim() === "") {
      setFilteredRows(rows);
    } else {
      const lowercasedSearch = search.toLowerCase();
      const filtered = rows.filter((row) =>
        columns.some(column => 
          row[column as keyof ReservationType]?.toString().toLowerCase().includes(lowercasedSearch)
        )
      );
      setFilteredRows(filtered);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [search, rows]);

  return (
    <div className='mx-20 my-11 max-[1420px]:mx-10 max-lg:mx-5'>
      <Reservations reload={reload} setReload={setReload} loading={loading} handleSearch={handleSearch} search={search} setSearch={setSearch} rowsData={filteredRows}  columns={columns} headers={headers} />
    </div>
  )
}

export default Guests