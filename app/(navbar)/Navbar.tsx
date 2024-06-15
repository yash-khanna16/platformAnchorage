"use client"
import { usePathname, useRouter } from "next/navigation";
import React from "react";

function Navbar() {
  const options = [
    {route: "home", value: "Home"},
    {route: "admin", value: "Admin"},
    {route: "about-us", value: "About Us"},
  ]

  const router = useRouter();
  const params = usePathname();
  const path = (params as string).split("/")[1];
  return (
    <div className="sticky flex items-center border justify-between top-0 py-4 px-16 text-[#121417]">
      <div className="font-bold text-lg">Anchorage</div>
      <div className="flex space-x-9">
      {options.map((option,key) => {
        return (
          <div onClick={()=>{router.push(`/${option.route}`)}} key={key} className={`cursor-pointer ${path===option.route?"text-blue-500":""} hover:text-blue-500 text-sm font-medium`}>{option.value}</div>
        )
      })} 
      </div>
    </div>
  );
}

export default Navbar;
