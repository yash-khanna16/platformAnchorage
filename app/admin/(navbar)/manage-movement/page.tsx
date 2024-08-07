"use client";
import React, { useEffect, useState } from "react";
import Reservations from "./MovementReservation";
import { fetchMovement } from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { Typography } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import Edit from "./Edit";

type MovementType = {
  movement_id: string;
  pickup_time: string;
  drop_location: string;
  pickup_location: string;
  return_time: string;
  car_number: string;
  driver: string;
  car_name: string;
  passengers: {
    booking_id: string;
    passenger_id: string;
    name: string;
    phone: string;
    remark: string;
    external_booking: boolean;
    company: string;
  }[];
};

function Movements() {
  const columns = [
    "status",
    "names",
    "driver",
    "car_number",
    "pickup_location",
    "pickup_time",
    "return_time",
    "drop_location",
    "car_name",
  ];
  const headers = [
    "Status",
    "Names",
    "Driver",
    "Car Number",
    "Pick Up Location",
    "Pick Up Time",
    "Return Time",
    "Drop Location",
    "Car Name",
  ];
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<MovementType[]>([]);
  const [reload, setReload] = useState(false);
  const [token, setToken] = useState("");
  const [selectedData, setSelectedData] = useState<MovementType>();
  const [filteredRows, setFilteredRows] = useState<MovementType[]>([]);
  const [seletedMovement, setSeletedMovement] = useState<GridRowSelectionModel>();

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
      let fetchedRows = await fetchMovement(token);
      console.log(fetchedRows);
      const currentTime = new Date();
      fetchedRows = fetchedRows.map((row: MovementType) => {
        const pickUpTime = new Date(row.pickup_time);
        const returnTime = new Date(row.return_time);
        let status;
        if (pickUpTime < currentTime && returnTime < currentTime) {
          status = "Expired";
        } else if (pickUpTime > currentTime) {
          status = "Upcoming";
        } else {
          status = "Active";
        }
      
        return {
          ...row,
          pickup_time: formatDate(row.pickup_time),
          return_time: formatDate(row.return_time),
          status: status,
          names: row.passengers.map(passenger => passenger.name).join(", ")
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

  useEffect(() => {
    const newSelectedMovement = seletedMovement?.toString();
    const seletedData = rows.find((data) => data.movement_id === newSelectedMovement);
    setSelectedData(seletedData);
  }, [seletedMovement, rows]);

  const handleSearch = () => {
    if (search.trim() === "") {
      setFilteredRows(rows);
    } else {
      const lowercasedSearch = search.toLowerCase();
      const filtered = rows.filter((row) =>
        columns.some((column) =>
          row[column as keyof MovementType]?.toString().toLowerCase().includes(lowercasedSearch)
        )
      );
      setFilteredRows(filtered);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [search, rows]);

  return (
    <div className="mx-5 my-11 max-[1420px]:mx-10 max-lg:mx-5">
      <div className="mb-6">
        <Typography className="text-5xl max-[960px]:text-4xl" component="div" fontWeight="bold">
          Search Movement
        </Typography>
      </div>
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
        setSeletedMovement={setSeletedMovement}
      />

      {selectedData ? (
        <Edit selectedData={selectedData} reload={reload} setReload={setReload} />
      ) : (
        ""
      )}
    </div>
  );
}

export default Movements;
