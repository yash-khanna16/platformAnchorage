"use client";
import React, { useEffect, useState } from "react";
import Reservations from "./MovementReservation";
import { searchAllGuests } from "@/app/actions/api";
import { useDebouncedCallback } from "use-debounce";
import { getAuthAdmin } from "@/app/actions/cookie";

type MovementType = {
  movement_id: string;
  pickup_time: string;
  drop_location: string;
  company: string | null;
  pickup_location: string;
  return_time: string;
  passenger_name: string;
  phone: string;
  remark: string;
  car_number: string;
  driver: string;
  car_name: string;
  passenger_id: string;
};

function Movements() {
  const columns = [
    "passenger_name",
    "status",
    "phone",
    "pickup_location",
    "car_name",
    "pickup_time",
    "drop_location",
    "return_time",
    "driver",
    "car_number",
    "company",
    "remark",
  ];
  const headers = [
    "Name",
    "Status",
    "Phone No.",
    "Pick Up Location",
    "Car Name",
    "Pick Up Time",
    "Drop Location",
    "Return Time",
    "Driver",
    "Car Number",
    "Company",
    "Remark",
  ];
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<MovementType[]>([]);
  const [reload, setReload] = useState(false);
  const [token, setToken] = useState("");
  const [filteredRows, setFilteredRows] = useState<MovementType[]>([]);

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
      // let fetchedRows = await searchAllGuests(token);
      let fetchedRows:MovementType[] = [
        {
          "movement_id": "fe28606c-cb9b-4293-a4f3-f1c029550428",
          "pickup_location": "palam metro",
          "pickup_time": "2024-07-05T08:30:00.123Z",
          "return_time": "2024-07-05T09:30:00.123Z",
          "car_number": "1",
          "driver": "yadav",
          "car_name": "DZire",
          "passenger_name": "shubham who",
          "passenger_id": "ef5f712f-ef6f-4c72-b30b-b401f5fdc3d0",
          "phone": "9999020069",
          "drop_location": "yadav ka ghar",
          "company": "YADAV",
          "remark": "waapas palam chhod ke aana agar paise nahi diye to"
        },
        {
          "movement_id": "fe28606c-cb9b-4293-a4f3-f1c029550428",
          "pickup_location": "palam metro",
          "pickup_time": "2024-07-05T08:30:00.123Z",
          "return_time": "2024-07-05T09:30:00.123Z",
          "car_number": "1",
          "driver": "yadav",
          "car_name": "DZire",
          "passenger_name": "shubham who?",
          "passenger_id": "029fd3c5-5c8b-49ea-81f5-722bda0250bc",
          "phone": "9999020069",
          "drop_location": "yadav ka ghar",
          "company": "YADAV",
          "remark": "waapas palam chhod ke aana agar paise nahi diye to"
        },
        {
          "movement_id": "fe28606c-cb9b-4293-a4f3-f1c029550428",
          "pickup_location": "palam metro",
          "pickup_time": "2024-07-05T08:30:00.123Z",
          "return_time": "2024-07-05T09:30:00.123Z",
          "car_number": "1",
          "driver": "yadav",
          "car_name": "DZire",
          "passenger_name": "VISHAL KHANNA",
          "passenger_id": "e6239f8b-9bac-41e4-9b9e-9a72570f78be",
          "phone": "8287340468",
          "drop_location": "yadav ka ghar",
          "company": "ANCHORAGE",
          "remark": "special"
        }
      ]
      console.log(fetchedRows);

      const currentTime = new Date();

      fetchedRows = fetchedRows.map((row: MovementType) => {
        const pickUpTime = new Date(row.pickup_time);
        const returnTime = new Date(row.return_time);
        let status;
        if (pickUpTime < currentTime) {
          status = "Expired";
        } else if (returnTime > currentTime) {
          status = "Upcoming";
        } else {
          status = "Active";
        }

        return {
          ...row,
          pickup_time: formatDate(row.pickup_time),
          return_time: formatDate(row.return_time),
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
    <div className=" my-11 mx-32 max-[1420px]:mx-10 max-lg:mx-5">
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

export default Movements;
