"use client";
import React, { useEffect, useState } from "react";
import Reservations from "../manage-rooms/[room]/Reservations";
import { searchAllGuests } from "@/app/actions/api";
import { useDebouncedCallback } from "use-debounce";
import { getAuthAdmin } from "@/app/actions/cookie";
import { Box, Typography, IconButton, DialogContent, DialogActions } from "@mui/material";
import CheckInFormPDF from "@/app/admin/(navbar)/manage-rooms/[room]/CheckInFormPDF";
import { PDFViewer } from "@react-pdf/renderer";
import { Skeleton } from "@mui/joy";
import OrderFormPDF from "@/app/admin/(navbar)/manage-rooms/[room]/OrdersFormPDF"

export type OrderDetails = {
  booking_id: string;   // Unique identifier for the booking
  created_at: string;   // Timestamp for when the order was created (as a string)
  email: string;        // Email of the guest
  item_name: string;    // Name of the ordered item
  name: string;         // Name of the guest
  order_id: string;     // Unique identifier for the order
  phone: string;        // Phone number of the guest
  price: number;        // Price of the ordered item
  qty: number;          // Quantity of the ordered item
  remarks: string;      // Any remarks for the order
  room: string;         // Room number associated with the booking
  status: string;       // Current status of the order
  discount:number;
};


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
  document_url: string;
  document_url_back: string | null;
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
      let fetchedRows = await searchAllGuests(token);
      // console.log("fetched ROws: ", fetchedRows)
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

      // console.log("fetched Rows: ", fetchedRows)

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

  
type Item = {
  name: string;
  qty: number;
  price: number;
};

type OrderDataType = {
  order_id: number;
  booking_id: string;
  room: string;
  created_at: string;
  status: string;
  remarks: string;
  items: Item[];
  name: string;
  email: string;
  phone: string;
  discount: number;
};


  // const orderData: OrderDataType[] = [{
  //   order_id: 123456789,
  //   booking_id: "B12345",
  //   room: "101A",
  //   created_at: "2024-08-29",
  //   status: "Accepted",
  //   remarks: "No onions",
  //   items: [
  //     { name: "Veg Sandwich", qty: 2, price: 50 },
  //     { name: "Cold Coffee", qty: 1, price: 80 },
  //   ],
  //   name: "John Doe",
  //   email: "john.doe@example.com",
  //   phone: "+1234567890",
  // }];
  

  return (
    <div className="mx-5 mt-11 max-[1420px]:mx-10 max-lg:mx-5">
      {/* <Button variant="contained" color="primary" onClick={exportToCsv}>Export as CSV</Button> */}
      {/* <PDFViewer width="100%" height={1000}>
        <OrderFormPDF orderData={orderData} />
      </PDFViewer> */}
       {/* <PDFViewer width="100%" height={1000}>
        <CheckInFormPDF data={filteredRows[0]} />
      </PDFViewer> */}
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
