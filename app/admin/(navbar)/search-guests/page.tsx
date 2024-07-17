"use client";
import React, { useEffect, useState } from "react";
import Reservations from "../manage-rooms/[room]/Reservations";
import { searchAllGuests } from "@/app/actions/api";
import { useDebouncedCallback } from "use-debounce";
import { getAuthAdmin } from "@/app/actions/cookie";
import { Box, Typography, IconButton, DialogContent, DialogActions } from "@mui/material";

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
  status?: string; // Add this line
};

function Guests() {
  const columns = [
    "room",
    "status",
    "rank",
    "name",
    "phone",
    "company",
    "checkin",
    "checkout",
    "email",
    "vessel",
    "remarks",
    "additional_info",
    
  ];
  const headers = [
    "Room",
    "Status",
    "Rank",
    "Name",
    "Phone",
    "Company",
    "Check In",
    "Check Out",
    "Email",
    "Vessel",
    "Remarks",
    "Additional Information",
    
  ];
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ReservationType[]>([]);
  const [reload, setReload] = useState(false);
  const [token, setToken] = useState("");
  const [filteredRows, setFilteredRows] = useState<ReservationType[]>([]);

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

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
        columns.some((column) =>
          row[column as keyof ReservationType]?.toString().toLowerCase().includes(lowercasedSearch)
        )
      );
      setFilteredRows(filtered);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [search, rows]);

  // const exportToCsv = () => {
  //   // Filter rows where status is "Active"
  //   const activeRows = filteredRows.filter(row => row.status === "Active");

  //   // Prepare CSV content
  //   const csvContent = "data:text/csv;charset=utf-8,"
  //     + columns.join(",") + "\n"
  //     + activeRows.map(row => columns.map(column => row[column as keyof ReservationType]).join(",")).join("\n");

  //   // Create download link and trigger download
  //   const encodedUri = encodeURI(csvContent);
  //   const link = document.createElement('a');
  //   link.setAttribute('href', encodedUri);
  //   link.setAttribute('download', 'active_reservations.csv');
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  return (
    <div className="mx-5 mt-11 max-[1420px]:mx-10 max-lg:mx-5">
      {/* <Button variant="contained" color="primary" onClick={exportToCsv}>Export as CSV</Button> */}
      <Typography className="text-5xl max-[960px]:text-4xl" component="div" fontWeight="bold">
        Search Reservations
      </Typography>
      <Reservations
        reload={reload}
        setReload={setReload}
        loading={loading}
        handleSearch={handleSearch}
        search={search}
        setSearch={setSearch}
        rowsData={filteredRows}
        columns={columns}
        headers={headers}
      />
    </div>
  );
}

export default Guests;
