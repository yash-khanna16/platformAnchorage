"use client";
import React, { act, useEffect, useState } from "react";
import SearchInput from "../components/Search";
import { addIcon, addPersonIcon, analyticsIcon, calenderIcon, mailIcon, searchIcon } from "../../assets/icons";
import { usePathname, useRouter } from "next/navigation";
import { Logout } from "@mui/icons-material";
import { deleteAuthAdmin } from "../actions/cookie";

function Navbar() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const params = usePathname();
  const path = (params as string).split("/")[2];

  async function handleLogout() {
    await deleteAuthAdmin();
    router.push("/")
  }
  
  const options = [
    { icon: searchIcon, route: "search-guests",value: "Search Guests" },
    { icon: addPersonIcon, route: "add-guest", value: "Add Guest" },
    { icon: calenderIcon, route: "manage-rooms", value: "Manage Rooms" },
    { icon: analyticsIcon, route: "analytics", value: "Analytics" },
    { icon: mailIcon, route: "emails", value: "Emails" },
  ];
  return (
    <div className="fixed flex flex-col space-y-8 top-0 left-0 h-screen w-80 max-[1050px]:w-60 border px-10 max-[1050px]:px-5 py-7 max-[920px]:h-20 max-[920px]:w-screen max-[920px]:flex-row max-[920px]:py-3 max-[920px]:space-y-1 max-[920px]:justify-between">
      <div className="font-medium text-xl max-[920px]:flex max-[920px]:items-center">Anchorage Admin</div>
      <div className="text-sm space-y-3">
        {options.map((option, index) => {

          return (
            <>
              <div onClick={()=>{router.push(`/admin/${option.route}`)
              }} className={`flex space-x-3 font-medium rounded-xl ${option.route === path ? "bg-[#E8EDF5]":""} cursor-pointer items-center px-3 py-2 max-[920px]:hidden`}>
                {option.icon}
                <div> {option.value} </div>
              </div>
            </>
          );
        })}
              <div onClick={handleLogout}
               className={`flex space-x-3 font-medium rounded-xl text-red-600  cursor-pointer items-center px-3 py-2 `}>
                <Logout />
                <div> Logout </div>
              </div>
      </div>
    </div>
  );
}

export default Navbar;
