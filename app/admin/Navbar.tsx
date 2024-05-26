"use client";
import React, { act, useEffect, useState } from "react";
import SearchInput from "../components/Search";
import { addIcon, addPersonIcon, analyticsIcon, calenderIcon, mailIcon, searchIcon } from "../../assets/icons";
import { usePathname, useRouter } from "next/navigation";

function Navbar() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const params = usePathname();
  const path = (params as string).split("/")[2];
  
  const options = [
    { icon: searchIcon, route: "search-guests",value: "Search Guests" },
    { icon: addPersonIcon, route: "add-guest", value: "Add Guest" },
    { icon: calenderIcon, route: "check-available-rooms", value: "Check Available Rooms " },
    { icon: analyticsIcon, route: "analytics", value: "Analytics" },
    { icon: mailIcon, route: "send-emails", value: "Send Emails" },
  ];
  return (
    <div className="fixed flex flex-col space-y-8 top-0 left-0 h-screen w-80 border px-10 py-7">
      <div className="font-medium text-xl ">Anchorage Admin</div>
      <div className="text-sm space-y-3">
        {options.map((option, index) => {

          return (
            <>
              <div onClick={()=>{router.push(`/admin/${option.route}`)
              }} className={`flex space-x-3 font-medium rounded-xl ${option.route === path ? "bg-[#E8EDF5]":""} cursor-pointer items-center px-3 py-2 `}>
                {option.icon}
                <div> {option.value} </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}

export default Navbar;
