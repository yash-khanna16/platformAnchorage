import React from "react";

function Navbar() {
  return (
    <div className="sticky flex items-center border justify-between top-0 py-4 px-16 text-[#121417]">
      <div className="font-bold text-lg">Anchorage</div>
      <div className="flex space-x-9">
        <div className="cursor-pointer hover:text-blue-500 text-sm font-medium">Home</div>
        <div className="cursor-pointer hover:text-blue-500 text-sm font-medium">Guests</div>
        <div className="cursor-pointer hover:text-blue-500 text-sm font-medium">Rooms</div>
        <div className="cursor-pointer hover:text-blue-500 text-sm font-medium">Admin</div>
        <div className="cursor-pointer hover:text-blue-500 text-sm font-medium">About Us</div>
      </div>
    </div>
  );
}

export default Navbar;
