"use client";
import React, { useEffect, useState } from "react";
import Reservations from "../manage-rooms/[room]/Reservations";
import { fetchBookingLogs } from "@/app/actions/api";
import { useDebouncedCallback } from "use-debounce";
import { getAuthAdmin } from "@/app/actions/cookie";
import { Box, Typography, IconButton, DialogContent, DialogActions } from "@mui/material";
import CheckInFormPDF from "@/app/admin/(navbar)/manage-rooms/[room]/CheckInFormPDF";
import { PDFViewer } from "@react-pdf/renderer";
import { Skeleton } from "@mui/joy";

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
    "guest_email",
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
    "Guest Email",
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
      let fetchedRows = await fetchBookingLogs(token);
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
          guest_email: row.guest_email.endsWith("@chotahaathi.com") ? "" : row.guest_email,
          status: status,
        };
      });

      console.log("fetched Rows: ", fetchedRows)

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
        columns.some((column) => row[column as keyof ReservationType]?.toString().toLowerCase().includes(lowercasedSearch))
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
 const data = {
    additional_info: "AIRPORT PICK UP",
    booking_id: "a91cc983-a0cb-498a-9758-7a546b16a14b",
    breakfast: 0,
    checkin: "2024-06-22T02:30:00.000Z",
    checkout: "2024-07-31T11:40:00.000Z",
    company: "PERSONAL",
    email: "tarunrs@gmail.com",
    guest_email: "tarunrs@gmail.com",
    id: null,
    meal_non_veg: 0,
    meal_veg: 0,
    meals: [
      { booking_id: "a91cc983-a0cb-498a-9758-7a546b16a14b", date: "2024-07-01T00:00:00.000Z", breakfast_veg: 0, breakfast_nonveg: 0, lunch_veg: 0, lunch_nonveg: 0, dinner_veg: 0, dinner_nonveg: 0 },
      { booking_id: "a91cc983-a0cb-498a-9758-7a546b16a14b", date: "2024-07-11T00:00:00.000Z", breakfast_veg: 0, breakfast_nonveg: 1, lunch_veg: 0, lunch_nonveg: 0, dinner_veg: 0, dinner_nonveg: 0 },
      { booking_id: "a91cc983-a0cb-498a-9758-7a546b16a14b", date: "2024-07-12T00:00:00.000Z", breakfast_veg: 0, breakfast_nonveg: 0, lunch_veg: 0, lunch_nonveg: 0, dinner_veg: 0, dinner_nonveg: 0 },
      { booking_id: "a91cc983-a0cb-498a-9758-7a546b16a14b", date: "2024-07-13T00:00:00.000Z", breakfast_veg: 0, breakfast_nonveg: 0, lunch_veg: 0, lunch_nonveg: 0, dinner_veg: 0, dinner_nonveg: 0 },
      { booking_id: "a91cc983-a0cb-498a-9758-7a546b16a14b", date: "2024-07-14T00:00:00.000Z", breakfast_veg: 0, breakfast_nonveg: 0, lunch_veg: 0, lunch_nonveg: 0, dinner_veg: 0, dinner_nonveg: 0 },
      { booking_id: "a91cc983-a0cb-498a-9758-7a546b16a14b", date: "2024-07-15T00:00:00.000Z", breakfast_veg: 0, breakfast_nonveg: 0, lunch_veg: 0, lunch_nonveg: 0, dinner_veg: 0, dinner_nonveg: 0 },
      { booking_id: "a91cc983-a0cb-498a-9758-7a546b16a14b", date: "2024-07-16T00:00:00.000Z", breakfast_veg: 0, breakfast_nonveg: 0, lunch_veg: 0, lunch_nonveg: 0, dinner_veg: 0, dinner_nonveg: 0 },
      { booking_id: "a91cc983-a0cb-498a-9758-7a546b16a14b", date: "2024-07-17T00:00:00.000Z", breakfast_veg: 0, breakfast_nonveg: 0, lunch_veg: 0, lunch_nonveg: 0, dinner_veg: 0, dinner_nonveg: 0 },
      { booking_id: "a91cc983-a0cb-498a-9758-7a546b16a14b", date: "2024-07-18T00:00:00.000Z", breakfast_veg: 0, breakfast_nonveg: 0, lunch_veg: 0, lunch_nonveg: 0, dinner_veg: 0, dinner_nonveg: 0 },
      { booking_id: "a91cc983-a0cb-498a-9758-7a546b16a14b", date: "2024-07-19T00:00:00.000Z", breakfast_veg: 0, breakfast_nonveg: 0, lunch_veg: 0, lunch_nonveg: 0, dinner_veg: 0, dinner_nonveg: 0 },
      { booking_id: "a91cc983-a0cb-498a-9758-7a546b16a14b", date: "2024-07-20T00:00:00.000Z", breakfast_veg: 0, breakfast_nonveg: 0, lunch_veg: 0, lunch_nonveg: 0, dinner_veg: 0, dinner_nonveg: 0 },
      { booking_id: "a91cc983-a0cb-498a-9758-7a546b16a14b", date: "2024-07-21T00:00:00.000Z", breakfast_veg: 0, breakfast_nonveg: 0, lunch_veg: 0, lunch_nonveg: 0, dinner_veg: 0, dinner_nonveg: 0 },
      { booking_id: "a91cc983-a0cb-498a-9758-7a546b16a14b", date: "2024-07-23T00:00:00.000Z", breakfast_veg: 1, breakfast_nonveg: 0, lunch_veg: 0, lunch_nonveg: 0, dinner_veg: 0, dinner_nonveg: 0 },
      { booking_id: "a91cc983-a0cb-498a-9758-7a546b16a14b", date: "2024-07-24T00:00:00.000Z", breakfast_veg: 1, breakfast_nonveg: 0, lunch_veg: 0, lunch_nonveg: 0, dinner_veg: 0, dinner_nonveg: 0 }
    ],
    movements: [],
    name: "YASH KHANNA",
    occupancy: [
      {
        bookings: [
          {
            additional_info: "AIRPORT PICK UP",
            booking_id: "a91cc983-a0cb-498a-9758-7a546b16a14b",
            breakfast: 0,
            checkin: "2024-06-22T02:30:00.000Z",
            checkout: "2024-07-31T11:40:00.000Z",
            company: "PERSONAL",
            guest_email: "tarunrs@gmail.com",
            meal_non_veg: 0,
            meal_veg: 0,
            name: "YASH KHANNA",
            phone: "9999020069",
            rank: "",
            remarks: "PERSONAL",
            room: "305",
            vessel: ""
          }
        ],
        end: "2024-07-31T11:40:00.000Z",
        occupancy: "SINGLE OCCUPANCY",
        start: "2024-06-22T02:30:00.000Z"
      }
    ],
    phone: "9999020069",
    rank: "",
    remarks: "PERSONAL",
    room: "305",
    status: "Active",
    vessel: ""
  };

  return (
    <div className="mx-5 mt-11 max-[1420px]:mx-10 max-lg:mx-5">
      {/* <Button variant="contained" color="primary" onClick={exportToCsv}>Export as CSV</Button> */}
      {/* <PDFViewer width="100%" height={1000}>
        <CheckInFormPDF data={data} />
      </PDFViewer> */}
      <Typography className="text-5xl max-[960px]:text-4xl" component="div" fontWeight="bold">
        Search Logs
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
          location="logs"
        />
    </div>
  );
}

export default Guests;
