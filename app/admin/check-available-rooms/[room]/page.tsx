"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, FormControl, FormHelperText, FormLabel } from "@mui/joy";
import Input from "@mui/joy/Input";
import NewBooking from "./NewBooking";
import Reservations from "./Reservations";


type ReservationType = {
  id: number;
  name: string;
  checkin: string;
  checkout: string;
  email: string;
  phone: string;
  company: string;
  vessel: string;
  remarks: string;
  additionalInfo: string;
}

function Room() {
  const params = useParams();
  const { room } = params;
  const router = useRouter();
  const dummyData: ReservationType[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      company: "ABC Corporation",
      vessel: "Ocean Explorer",
      remarks: "Require vegetarian meals",
      additionalInfo: "Special request: Need assistance with luggage",
      checkin: "2024-06-01",
      checkout: "2024-06-10",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1987654321",
      company: "XYZ Enterprises",
      vessel: "Island Hopper",
      remarks: "Allergic to seafood",
      additionalInfo: "Prefers a window seat",
      checkin: "2024-06-03",
      checkout: "2024-06-12",
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      phone: "+1122334455",
      company: "PQR Limited",
      vessel: "River Cruiser",
      remarks: "Celebrating anniversary",
      additionalInfo: "Requires wheelchair assistance",
      checkin: "2024-06-05",
      checkout: "2024-06-15",
    },
    {
      id: 4,
      name: "Emily Brown",
      email: "emily.brown@example.com",
      phone: "+144332211",
      company: "LMN Corp",
      vessel: "Sailor's Dream",
      remarks: "First-time sailor",
      additionalInfo: "Interested in on-board activities",
      checkin: "2024-06-07",
      checkout: "2024-06-17",
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.wilson@example.com",
      phone: "+1999888777",
      company: "RST Industries",
      vessel: "Sunset Cruise",
      remarks: "Group booking for team retreat",
      additionalInfo: "Requests separate cabins for privacy",
      checkin: "2024-06-09",
      checkout: "2024-06-19",
    },
    {
      id: 6,
      name: "Sarah Lee",
      email: "sarah.lee@example.com",
      phone: "+1555666777",
      company: "LMNOP Corp",
      vessel: "Adventure Seeker",
      remarks: "Scuba diving enthusiast",
      additionalInfo: "Needs rental equipment",
      checkin: "2024-06-11",
      checkout: "2024-06-21",
    },
    {
      id: 7,
      name: "Daniel Kim",
      email: "daniel.kim@example.com",
      phone: "+1888777666",
      company: "KLM Enterprises",
      vessel: "Dreamliner",
      remarks: "Traveling with pet dog",
      additionalInfo: "Requires pet-friendly accommodation",
      checkin: "2024-06-13",
      checkout: "2024-06-23",
    },
    {
      id: 8,
      name: "Sophia Martinez",
      email: "sophia.martinez@example.com",
      phone: "+1666999888",
      company: "NOPQ Corp",
      vessel: "Moonlight Serenade",
      remarks: "Honeymoon cruise",
      additionalInfo: "Requests romantic dinner setup",
      checkin: "2024-06-15",
      checkout: "2024-06-25",
    },
    {
      id: 9,
      name: "Christopher White",
      email: "christopher.white@example.com",
      phone: "+1777333444",
      company: "QRS Corp",
      vessel: "Paradise Explorer",
      remarks: "Adventure seeker",
      additionalInfo: "Interested in hiking excursions",
      checkin: "2024-06-17",
      checkout: "2024-06-27",
    },
    {
      id: 10,
      name: "Olivia Garcia",
      email: "olivia.garcia@example.com",
      phone: "+1555444333",
      company: "STU Corporation",
      vessel: "Tropical Oasis",
      remarks: "Family vacation",
      additionalInfo: "Requires children's activities",
      checkin: "2024-06-19",
      checkout: "2024-06-29",
    },
    {
      id: 11,
      name: "William Brown",
      email: "william.brown@example.com",
      phone: "+1222111333",
      company: "UVW Inc",
      vessel: "Sunrise Cruise",
      remarks: "Retirement celebration",
      additionalInfo: "Requests special meal for dietary restrictions",
      checkin: "2024-06-21",
      checkout: "2024-07-01",
    },
    {
      id: 12,
      name: "Ava Rodriguez",
      email: "ava.rodriguez@example.com",
      phone: "+1444888999",
      company: "WXYZ Corporation",
      vessel: "Coral Explorer",
      remarks: "Marine biologist",
      additionalInfo: "Interested in marine life excursions",
      checkin: "2024-06-23",
      checkout: "2024-07-03",
    },
    {
      id: 13,
      name: "James Taylor",
      email: "james.taylor@example.com",
      phone: "+1999444555",
      company: "EFG Ltd",
      vessel: "Northern Lights",
      remarks: "Aurora borealis photography enthusiast",
      additionalInfo: "Needs camera equipment rental",
      checkin: "2024-06-25",
      checkout: "2024-07-05",
    },
    {
      id: 14,
      name: "Mia Anderson",
      email: "mia.anderson@example.com",
      phone: "+1333222111",
      company: "HIJ Enterprises",
      vessel: "Crystal Waters",
      remarks: "Destination wedding",
      additionalInfo: "Requests wedding planner assistance",
      checkin: "2024-06-27",
      checkout: "2024-07-07",
    },
    {
      id: 15,
      name: "Alexander Martinez",
      email: "alexander.martinez@example.com",
      phone: "+1888333222",
      company: "IJK Corporation",
      vessel: "Mystic Journey",
      remarks: "Spiritual retreat",
      additionalInfo: "Interested in meditation sessions",
      checkin: "2024-06-29",
      checkout: "2024-07-09",
    },
    {
      id: 16,
      name: "Charlotte Walker",
      email: "charlotte.walker@example.com",
      phone: "+1222999888",
      company: "LMN Limited",
      vessel: "Enchanted Voyage",
      remarks: "Solo traveler",
      additionalInfo: "Requests single occupancy cabin",
      checkin: "2024-07-01",
      checkout: "2024-07-11",
    },
    {
      id: 17,
      name: "Ethan Thompson",
      email: "ethan.thompson@example.com",
      phone: "+1666111222",
      company: "OPQ Corporation",
      vessel: "Adventure Seeker",
      remarks: "Extreme sports enthusiast",
      additionalInfo: "Interested in skydiving and rock climbing",
      checkin: "2024-07-03",
      checkout: "2024-07-13",
    },
    {
      id: 18,
      name: "Amelia Hall",
      email: "amelia.hall@example.com",
      phone: "+1333777666",
      company: "RST Enterprises",
      vessel: "Blue Horizon",
      remarks: "Sailing competition participant",
      additionalInfo: "Needs storage space for sailing gear",
      checkin: "2024-07-05",
      checkout: "2024-07-15",
    },
    {
      id: 19,
      name: "Benjamin Green",
      email: "benjamin.green@example.com",
      phone: "+1999222111",
      company: "UVW Corporation",
      vessel: "Sunny Shores",
      remarks: "Beach lover",
      additionalInfo: "Requests beach-front cabin",
      checkin: "2024-07-07",
      checkout: "2024-07-17",
    },
    {
      id: 20,
      name: "Grace Adams",
      email: "grace.adams@example.com",
      phone: "+1222666777",
      company: "XYZ Inc",
      vessel: "Starry Night",
      remarks: "Astrophotographer",
      additionalInfo: "Interested in stargazing excursions",
      checkin: "2024-07-09",
      checkout: "2024-07-19",
    },
  ];
  const columns = ["id", "name", "checkin", "checkout", "email",  "phone", "company", "vessel", "remarks", "additionalInfo",]
  const headers = ["ID", "Name", "Check In", "Check Out", "Email", "Phone No,", "Company", "Vessel", "Remarks", "Additional Information"]

  return (
    <div className=" my-11 ">
      <div className="space-y-10 w-[70vw] mx-auto">
        <div className="flex space-x-2  font-medium">
          <div onClick={()=>{router.push("/admin/check-available-rooms")}} className="text-[#637587] cursor-pointer hover:underline ">Rooms</div>
          <div>/</div>
          <div className="text-[#121417]"> {room} </div>
        </div>
        <NewBooking />
        <Reservations rowsData={dummyData} columns={columns}  headers={headers} />    
      </div>
    </div>
  );
}

export default Room;
