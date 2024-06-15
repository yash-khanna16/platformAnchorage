"use client";
import { addGuest } from "@/app/actions/api";
import { Button } from "@mui/joy";
import { Snackbar } from "@mui/joy";
import React, { useEffect, useState } from "react";
import {Input} from "@mui/joy";
import { Close, Info } from "@mui/icons-material";
import { getAuthAdmin } from "@/app/actions/cookie";

type guestType = {
  guestEmail: string;
  guestName: string;
  guestPhone: number | null;
  guestCompany: string;
  guestVessel: string;
  guestRank: string;
};

function AddGuest() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState<guestType>({
    guestName: "",
    guestPhone: null,
    guestEmail: "",
    guestCompany: "",
    guestVessel: "",
    guestRank: "",
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getAuthAdmin().then(auth => {
      if(auth)
        setToken(auth.value);
    })
  },[])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "guestPhone" ? parseInt(value) || "" : value,
    }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      console.log(formData);
      if (formData.guestPhone) {
        setLoading(true);
        const res = await addGuest(token,formData);
        setMessage(res.message);
        setError(
          res.message === "Guest Added Successfully!" ? "success" : "error"
        );
        setOpen(true);
        setLoading(false);
        console.log(res);
      }
    } catch (error) {
      setLoading(false);
      setOpen(true);
      setError("error");
      setMessage("Something went wrong, Please try again later!");
      console.log(error);
    }
  }

  return (
    <div className="w-[1000px] mx-auto pt-10 px-10">
      <h1 className="text-3xl font-bold">Enter details of guests </h1>
      <form onSubmit={handleSubmit} className="mx-auto space-y-6">
        <div className="w-full grid grid-cols-2 gap-7 mx-auto mt-[40px]">
          <div className="space-y-2 ">
            <label htmlFor="guestName">Name</label>
            <Input
              size="lg"
              required
              type="text"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              placeholder="Enter Name"
              id="guestName"
              className=""
            />
          </div>
          <div className="space-y-2 ">
            <label htmlFor="guestPhone">Phone No.</label>
            <Input
              size="lg"
              required
              type="tel"
              name="guestPhone"
              value={formData.guestPhone as number}
              onChange={handleChange}
              placeholder="Enter Phone No."
              id="guestPhone"
              className=""
            />
          </div>
          <div className="space-y-2 ">
            <label htmlFor="guestEmail">Email Address</label>
            <Input
              size="lg"
              required
              type="email"
              name="guestEmail"
              value={formData.guestEmail}
              onChange={handleChange}
              placeholder="Enter Email Address"
              id="guestEmail"
              className=""
            />
          </div>
          <div className="space-y-2 l">
            <label htmlFor="guestCompany">Company</label>
            <Input
              size="lg"
              required
              type="text"
              name="guestCompany"
              value={formData.guestCompany}
              onChange={handleChange}
              placeholder="Enter Company"
              id="guestCompany"
              className=""
            />
          </div>
          <div className="space-y-2 l">
            <label htmlFor="guestVessel">Vessel</label>
            <Input
              size="lg"
              required
              type="text"
              name="guestVessel"
              value={formData.guestVessel}
              onChange={handleChange}
              placeholder="Enter Vessel"
              id="guestVessel"
              className=""
            />
          </div>
          <div className="space-y-2 l">
            <label htmlFor="guestRank">Rank</label>
            <Input
              size="lg"
              required
              type="text"
              name="guestRank"
              value={formData.guestRank}
              onChange={handleChange}
              placeholder="Enter Rank"
              id="guestRank"
              className=""
            />
          </div>
        <Button
          size="lg"
          loading={loading}
          type="submit"
          // className="w-1/2"
          fullWidth
        >
          Add Guest
        </Button>
        </div>
      </form>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        // color="warning"
        onClose={() => {
          setOpen(false);
        }}
      >
        {" "}
        <Info /> {message}
        <span
          onClick={() => setOpen(false)}
          className="cursor-pointer hover:bg-[#f3eded]"
        >
          <Close />
        </span>
      </Snackbar>
    </div>
  );
}

export default AddGuest;
