"use client";
import React, { useEffect, useState } from "react";
import Reservations from "../manage-rooms/[room]/Reservations";
import { fetchAuditLogs } from "@/app/actions/api";
import { useDebouncedCallback } from "use-debounce";
import { getAuthAdmin } from "@/app/actions/cookie";
import { Box, Typography, IconButton, DialogContent, DialogActions } from "@mui/material";


type AuditType = {
  audit_id:string,
  author:string,
  api_call:string,
  time:string,
};

function Audit() {
  const columns = [
    "time",
    "author",
    "api_call",
    "name",
    "phone"
  ];
  const headers = [
    "Time",
    "Admin Id",
    "Target Api",
    "Guests",
    "Phone No."
  ];
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<AuditType[]>([]);
  const [reload, setReload] = useState(false);
  const [token, setToken] = useState("");
  const [filteredRows, setFilteredRows] = useState<AuditType[]>([]);

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
      let fetchedRows = await fetchAuditLogs(token);
      console.log(fetchedRows);
      fetchedRows = fetchedRows.map((row: AuditType) => {

        return {
          ...row,
          time:formatDate(row.time)
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
        columns.some((column) => row[column as keyof AuditType]?.toString().toLowerCase().includes(lowercasedSearch))
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
      {/* <PDFViewer width="100%" height={1000}>
        <CheckInFormPDF data={data} />
      </PDFViewer> */}
      <Typography className="text-5xl max-[960px]:text-4xl" component="div" fontWeight="bold">
        Audit Logs
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
          location="auditLogs"
        />
    </div>
  );
}

export default Audit;
