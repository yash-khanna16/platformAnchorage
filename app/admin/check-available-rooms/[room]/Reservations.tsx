import React, { useState } from "react";
import SearchInput from "@/app/components/Search";
import { searchIconSecondary } from "@/assets/icons";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { ButtonGroup } from "@mui/joy";
import Button from "@mui/joy/Button";

interface Reservation {
  name: string;
  email: string;
  phone: string;
  company: string;
  vessel: string;
  remarks: string;
  additionalInfo: string;
}

const Reservations: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 5;

  // Dummy data
  const dummyData: Reservation[] = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      company: "ABC Corporation",
      vessel: "Ocean Explorer",
      remarks: "Require vegetarian meals",
      additionalInfo: "Special request: Need assistance with luggage",
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1987654321",
      company: "XYZ Enterprises",
      vessel: "Island Hopper",
      remarks: "Allergic to seafood",
      additionalInfo: "Prefers a window seat",
    },
    {
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      phone: "+1122334455",
      company: "PQR Limited",
      vessel: "River Cruiser",
      remarks: "Celebrating anniversary",
      additionalInfo: "Requires wheelchair assistance",
    },
    {
      name: "Emily Brown",
      email: "emily.brown@example.com",
      phone: "+144332211",
      company: "LMN Corp",
      vessel: "Sailor's Dream",
      remarks: "First-time sailor",
      additionalInfo: "Interested in on-board activities",
    },
    {
      name: "David Wilson",
      email: "david.wilson@example.com",
      phone: "+1999888777",
      company: "RST Industries",
      vessel: "Sunset Cruise",
      remarks: "Group booking for team retreat",
      additionalInfo: "Requests separate cabins for privacy",
    },
    {
      name: "Sarah Lee",
      email: "sarah.lee@example.com",
      phone: "+1555666777",
      company: "LMNOP Corp",
      vessel: "Adventure Seeker",
      remarks: "Scuba diving enthusiast",
      additionalInfo: "Needs rental equipment",
    },
    {
      name: "Daniel Kim",
      email: "daniel.kim@example.com",
      phone: "+1888777666",
      company: "KLM Enterprises",
      vessel: "Dreamliner",
      remarks: "Traveling with pet dog",
      additionalInfo: "Requires pet-friendly accommodation",
    },
    {
      name: "Sophia Martinez",
      email: "sophia.martinez@example.com",
      phone: "+1666999888",
      company: "NOPQ Corp",
      vessel: "Moonlight Serenade",
      remarks: "Honeymoon cruise",
      additionalInfo: "Requests romantic dinner setup",
    },
    {
      name: "Christopher White",
      email: "christopher.white@example.com",
      phone: "+1777333444",
      company: "QRS Corp",
      vessel: "Paradise Explorer",
      remarks: "Adventure seeker",
      additionalInfo: "Interested in hiking excursions",
    },
    {
      name: "Olivia Garcia",
      email: "olivia.garcia@example.com",
      phone: "+1555444333",
      company: "STU Corporation",
      vessel: "Tropical Oasis",
      remarks: "Family vacation",
      additionalInfo: "Requires children's activities",
    },
    {
      name: "William Brown",
      email: "william.brown@example.com",
      phone: "+1222111333",
      company: "UVW Inc",
      vessel: "Sunrise Cruise",
      remarks: "Retirement celebration",
      additionalInfo: "Requests special meal for dietary restrictions",
    },
    {
      name: "Ava Rodriguez",
      email: "ava.rodriguez@example.com",
      phone: "+1444888999",
      company: "WXYZ Corporation",
      vessel: "Coral Explorer",
      remarks: "Marine biologist",
      additionalInfo: "Interested in marine life excursions",
    },
    {
      name: "James Taylor",
      email: "james.taylor@example.com",
      phone: "+1999444555",
      company: "EFG Ltd",
      vessel: "Northern Lights",
      remarks: "Aurora borealis photography enthusiast",
      additionalInfo: "Needs camera equipment rental",
    },
    {
      name: "Mia Anderson",
      email: "mia.anderson@example.com",
      phone: "+1333222111",
      company: "HIJ Enterprises",
      vessel: "Crystal Waters",
      remarks: "Destination wedding",
      additionalInfo: "Requests wedding planner assistance",
    },
    {
      name: "Alexander Martinez",
      email: "alexander.martinez@example.com",
      phone: "+1888333222",
      company: "IJK Corporation",
      vessel: "Mystic Journey",
      remarks: "Spiritual retreat",
      additionalInfo: "Interested in meditation sessions",
    },
    {
      name: "Charlotte Walker",
      email: "charlotte.walker@example.com",
      phone: "+1222999888",
      company: "LMN Limited",
      vessel: "Enchanted Voyage",
      remarks: "Solo traveler",
      additionalInfo: "Requests single occupancy cabin",
    },
    {
      name: "Ethan Thompson",
      email: "ethan.thompson@example.com",
      phone: "+1666111222",
      company: "OPQ Corporation",
      vessel: "Adventure Seeker",
      remarks: "Extreme sports enthusiast",
      additionalInfo: "Interested in skydiving and rock climbing",
    },
    {
      name: "Amelia Hall",
      email: "amelia.hall@example.com",
      phone: "+1333777666",
      company: "RST Enterprises",
      vessel: "Blue Horizon",
      remarks: "Sailing competition participant",
      additionalInfo: "Needs storage space for sailing gear",
    },
    {
      name: "Benjamin Green",
      email: "benjamin.green@example.com",
      phone: "+1999222111",
      company: "UVW Corporation",
      vessel: "Seaside Retreat",
      remarks: "Nature lover",
      additionalInfo: "Interested in birdwatching tours",
    },
    {
      name: "Ella Baker",
      email: "ella.baker@example.com",
      phone: "+1888444222",
      company: "XYZ Limited",
      vessel: "Island Paradise",
      remarks: "Beach vacation",
      additionalInfo: "Requests beachfront accommodation",
    },
  ];

  // Filter data based on search query
  const filteredData: Reservation[] = dummyData.filter((item) =>
    Object.values(item).some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages: number = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentItems: Reservation[] = filteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="">
      <div className="space-y-6">
        <div className="text-3xl font-semibold mb-6  "> Search Reservations</div>
        <div>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={searchIconSecondary}
            placeholder="Search by guest name"
          />
          <div className="border my-5 space-y-7 rounded-xl py-4 px-4">
            <div className="grid font-medium  text-wrap gap-4 border-b grid-cols-custom   ">
              <div className="p-2">Guest Name</div>
              <div className="p-2">Email</div>
              <div className="p-2">Phone No</div>
              <div className="p-2">Company Name</div>
              <div className="p-2">Vessel</div>
              <div className="p-2">Remarks</div>
              <div className="p-2">Additional Remarks</div>
            </div>
            {currentItems.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-custom gap-4 break-all text-wrap text-slate-600 text-sm "
              >
                <div className="p-2">{item.name}</div>
                <div className="p-2">{item.email}</div>
                <div className="p-2">{item.phone}</div>
                <div className="p-2">{item.company}</div>
                <div className="p-2">{item.vessel}</div>
                <div className="p-2">{item.remarks}</div>
                <div className="p-2">{item.additionalInfo}</div>
              </div>
            ))}
            <div className="text-sm  text-slate-600 font-semibold flex justify-between mt-4">
              <div>
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-4">
                <ButtonGroup>
                  <Button
                    size="sm"
                    startDecorator={<KeyboardArrowLeft />}
                    onClick={() =>
                      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    endDecorator={<KeyboardArrowRight />}
                    onClick={() =>
                      setCurrentPage((prevPage) =>
                        Math.min(prevPage + 1, totalPages)
                      )
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
