"use client";
import React, { useEffect, useState } from "react";
import Reservations from "../manage-rooms/[room]/Reservations";
import { searchAllGuests, fetchMasterMovement } from "@/app/actions/api";
import { useDebouncedCallback } from "use-debounce";
import { getAuthAdmin } from "@/app/actions/cookie";
import { Typography, Button } from "@mui/material";
import * as XLSX from 'xlsx'; // Import xlsx library

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
  status?: string;
};
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
    company: string;
  }[];
};

function MasterTable() {
  const columns = [
    "status",
    "name",
    "room",
    "checkin",
    "checkout",
    "phone",
    "company",
    "remarks",
    "additional_info",
    "rank",
  ];
  const headers = [
    "Status",
    "Name",
    "Room",
    "Check In",
    "Check Out",
    "Phone",
    "Company",
    "Remarks",
    "Additional Information",
    "Rank",
  ];
  const columnsMovement = [
    "status",
    "passenger_name",
    "phone",
    "company",
    "driver",
    "car_number",
    "pickup_location",
    "pickup_time",
    "return_time",
    "drop_location",
    "remark",
    "car_name",
  ];
  const headersMovement = [
    "Status",
    "Passenger",
    "Phone",
    "Company",
    "Driver",
    "Car Number",
    "Pick Up Location",
    "Pick Up Time",
    "Return Time",
    "Drop Location",
    "Remark",
    "Car Name",
  ];
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ReservationType[]>([]);
  const [reload, setReload] = useState(false);
  const [token, setToken] = useState("");
  const [filteredRows, setFilteredRows] = useState<ReservationType[]>([]);
  const [searchMovement, setSearchMovement] = useState<string>("");
  const [searchTransport, setSearchTransport] = useState<string>("");
  const [loadingMovement, setLoadingMovement] = useState(false);
  const [loadingTransport, setLoadingTransport] = useState(false);
  const [rowsMovement, setRowsMovement] = useState<MovementType[]>([]);
  const [rowsTransport, setRowsTransport] = useState<MovementType[]>([]);
  const [reloadMovement, setReloadMovement] = useState(false);
  const [reloadTransport, setReloadTransport] = useState(false);
  const [filteredRowsMovement, setFilteredRowsMovement] = useState<MovementType[]>([]);
  const [filteredRowsTransport, setFilteredRowsTransport] = useState<MovementType[]>([]);

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

  async function getPassenger() {
    try {
      setLoading(true);
      let fetchedRows = await fetchMasterMovement(token);
      
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
        };
      });
      setRowsMovement(fetchedRows);
      setFilteredRowsMovement(fetchedRows);
      console.log(fetchedRows);
  
      const externalPassenger = fetchedRows.filter((data: any) => data.external_booking === true);
      console.log(externalPassenger);
  
      setRowsTransport(externalPassenger);
      setFilteredRowsTransport(externalPassenger);
      setLoading(false);
    } catch (error) {
      setLoadingMovement(false);
      console.log(error);
    }
  }
  

  useEffect(() => {
    if (token !== "") {
      getGuests();
      getPassenger();
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
  const handleSearchMovement = () => {
    if (searchMovement.trim() === "") {
      setFilteredRowsMovement(rowsMovement);
    } else {
      const lowercasedSearch = searchMovement.toLowerCase();
      const filtered = rowsMovement.filter((row) =>
        columnsMovement.some((column) =>
          row[column as keyof MovementType]?.toString().toLowerCase().includes(lowercasedSearch)
        )
      );
      setFilteredRowsMovement(filtered);
    }
  };
  const handleSearchTransport = () => {
    if (searchTransport.trim() === "") {
      setFilteredRowsTransport(rowsTransport);
    } else {
      const lowercasedSearch = searchTransport.toLowerCase();
      const filtered = rowsTransport.filter((row) =>
        columnsMovement.some((column) =>
          row[column as keyof MovementType]?.toString().toLowerCase().includes(lowercasedSearch)
        )
      );
      setFilteredRowsTransport(filtered);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [search, rows]);

  const exportToExcel = (data: any[], columns: string[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data, { header: columns });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, filename);
  };

  const exportReservationsToExcel = () => {
    const data = filteredRows.map((row) =>
      columns.reduce((obj, column) => {
        obj[column] = row[column as keyof ReservationType];
        return obj;
      }, {} as any)
    );
    exportToExcel(data, columns, "reservations.xlsx");
  };

  const exportMovementsToExcel = () => {
    const data = filteredRowsMovement.map((row) =>
      columnsMovement.reduce((obj, column) => {
        obj[column] = row[column as keyof MovementType];
        return obj;
      }, {} as any)
    );
    exportToExcel(data, columnsMovement, "movements.xlsx");
  };
  const exportExternalMovementsToExcel = () => {
    const data = filteredRowsTransport.map((row) =>
      columnsMovement.reduce((obj, column) => {
        obj[column] = row[column as keyof MovementType];
        return obj;
      }, {} as any)
    );
    exportToExcel(data, columnsMovement, "external_movements.xlsx");
  };

  return (
    <>
      <div className="flex mt-10 mx-10 justify-end">
        <Button variant="contained" color="primary" className="text-sm" onClick={exportReservationsToExcel}>
          Export Reservations
        </Button>
        <Button variant="contained" color="primary"  onClick={exportMovementsToExcel} className="ml-4 text-sm">
          Export Movements
        </Button>
        <Button variant="contained" color="primary" onClick={exportExternalMovementsToExcel} className="ml-4 text-sm">
          Export External Movements
        </Button>
      </div>
      <div className="mx-5 mt-4 max-[1420px]:mx-10 max-lg:mx-5">
        <Typography className="text-5xl max-[960px]:text-4xl" component="div" fontWeight="bold">
          Master Reservations
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
          location="masterList"
        />
      </div>
      <div className="mx-5 my-11 max-[1420px]:mx-10 max-lg:mx-5">
        <div className="mb-6">
          <Typography className="text-5xl max-[960px]:text-4xl" component="div" fontWeight="bold">
            Master Movements
          </Typography>
        </div>
        <Reservations
          reload={reloadMovement}
          setReload={setReloadMovement}
          loading={loadingMovement}
          handleSearch={handleSearchMovement}
          search={searchMovement}
          setSearch={setSearchMovement}
          rowsData={filteredRowsMovement}
          columns={columnsMovement}
          headers={headersMovement}
          location="masterMovement"
        />
      </div>
      <div className="mx-5 my-11 max-[1420px]:mx-10 max-lg:mx-5">
        <div className="mb-6">
          <Typography className="text-5xl max-[960px]:text-4xl" component="div" fontWeight="bold">
            External Movements
          </Typography>
        </div>
        <Reservations
          reload={reloadTransport}
          setReload={setReloadTransport}
          loading={loadingTransport}
          handleSearch={handleSearchTransport}
          search={searchTransport}
          setSearch={setSearchTransport}
          rowsData={filteredRowsTransport}
          columns={columnsMovement}
          headers={headersMovement}
          location="masterMovement"
        />
      </div>
    </>
  );
}

export default MasterTable;
