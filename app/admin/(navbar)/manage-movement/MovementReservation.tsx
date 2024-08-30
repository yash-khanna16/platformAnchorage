import React, { SetStateAction, useEffect, useState } from "react";
import SearchInput from "@/app/components/Search";
import { searchIconSecondary } from "@/assets/icons";
import { DataGrid, GridColDef, GridColumnHeaderParams, GridPaginationModel, useGridApiRef } from "@mui/x-data-grid";
import { Chip } from "@mui/joy";
import { GridRowSelectionModel } from "@mui/x-data-grid";

interface RowData {
  [key: string]: any;
}

interface ReservationsProps {
  rowsData: RowData[];
  columns: string[];
  headers: string[];
  search: string;
  setSearch: React.Dispatch<SetStateAction<string>>;
  setReload: React.Dispatch<SetStateAction<boolean>>;
  handleSearch: (value: string) => void;
  loading: boolean;
  reload: boolean;
  setSeletedMovement: React.Dispatch<SetStateAction<GridRowSelectionModel | undefined>>;
}

interface Movement {
  movement_id: string;
  pickup_time: string;
  drop_location: string;
  company: string;
  pickup_location: string;
  return_time: string;
  passenger_name: string;
  phone: string;
  remark: string;
  car_number: string;
  driver: string;
  pickup_date: string;
  return_date: string;
  passenger_id: string;
}

const MovementReservations: React.FC<ReservationsProps> = ({
  rowsData,
  columns,
  headers,
  search,
  setSearch,
  handleSearch,
  loading,
  setReload,
  reload,
  setSeletedMovement,
}) => {
  const apiRef = useGridApiRef();

  const mapToFormData = (id: any): Movement => {
    const formatDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split("-").map((part) => parseInt(part, 10));
      return `${year}-${month}-${day}`;
    };

    const [pickUpDate, pickUpTime] = id.pickup_time.split(" ");
    const [returnDate, returnTime] = id.return_time.split(" ");
    return {
      movement_id: id.movement_id,
      pickup_time: pickUpTime,
      pickup_date: formatDate(pickUpDate),
      return_date: formatDate(returnDate),
      drop_location: id.drop_location,
      company: id.company,
      pickup_location: id.pickup_location,
      return_time: returnTime,
      passenger_name: id.passenger_name,
      phone: id.phone,
      remark: id.remark,
      car_number: id.car_number,
      driver: id.driver,
      passenger_id: id.passenger_id,
    };
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
    handleSearch(value);
  };

  const statusOrder = ["active", "upcoming", "expired"];

    const customSortComparator = (v1: string, v2: string) => {
      return statusOrder.indexOf(v1.toLowerCase()) - statusOrder.indexOf(v2.toLowerCase());
    };

  const gridColumns: GridColDef[] = [
    ...columns.map((columnName, index) => ({
      field: columnName,
      headerName: headers[index],
      flex: index === 0 || index === 11 || index === 12 || index === 13 || columnName === "status" ? 0 : undefined,
      width: index === 0 || columnName === "car_name" || columnName === "driver" || columnName === "status" ? 150 : 240,
      sortable: columnName === "status" ? true : undefined,
      sortComparator: columnName === "status" ? customSortComparator : undefined,
      renderHeader: (params: GridColumnHeaderParams) => (
        <span className="text-[#0D141C] font-semibold pl-3">{headers[index]}</span>
      ),
      renderCell: (params: any) => {
        const currentTime = new Date().getTime();
        let dateString = params.row["pickup_time"];
        let isWithinTwoHours;
        const [day, month, year, hours, minutes] = dateString.split(/[- :]/);
        const pickupDateTime = new Date(year, month - 1, day, hours, minutes);
        isWithinTwoHours = Math.abs(currentTime - pickupDateTime.getTime()) <= 2 * 60 * 60 * 1000;

        return (
          <div>
            {columnName === "status" ? (
              <div className={`${isWithinTwoHours && "animate-bounce"}`}>
                <Chip
                  size="sm"
                  variant="outlined"
                  color={
                    params.row[columnName] === "Expired" ? "danger" : params.row[columnName] === "Active" ? "success" : "warning"
                  }
                >
                  {params.row[columnName]}
                </Chip>
              </div>
            ) : (
              <>{params.row[columnName]}</>
            )}
          </div>
        );
      },
    })),
  ];

  return (
    <>
      <div>
        <SearchInput
          value={search}
          onChange={handleSearchInput}
          icon={searchIconSecondary}
          placeholder="Search by guest name, email, company..."
        />
        <br />
        <div className="my-5 w-full h-[75vh]" id="datagrid-container">
          <DataGrid
            apiRef={apiRef}
            rows={rowsData}
            loading={loading}
            rowHeight={70}
            paginationModel={{ pageSize: rowsData.length, page: 0 }}
            columns={gridColumns}
            checkboxSelection
            disableMultipleRowSelection
            getRowId={(row) => row.movement_id}
            initialState={{
              sorting: {
                sortModel: [{ field: "status", sort: "asc" }], // Adjust 'asc' to 'desc' if needed
              },
            }}
            sx={{
              borderRadius: 3, // Adjust the value to achieve the desired rounding
              "& .MuiDataGrid-root": {
                borderRadius: "inherit",
              },
              
            }}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setSeletedMovement(newRowSelectionModel);
            }}
          />
        </div>
      </div>
       
    </>
  );
};

export default MovementReservations;
