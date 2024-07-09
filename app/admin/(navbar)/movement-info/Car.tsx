"use client";
import { AccessTime, Cancel, WarningRounded } from "@mui/icons-material";
import Image from "next/image";
import React, { SetStateAction, useEffect, useState } from "react";
import car from "@/app/assets/car-white.webp";
import { roadIcon } from "@/assets/icons";
import { getAuthAdmin } from "@/app/actions/cookie";
import { Button, DialogActions, DialogTitle, Divider, Modal, ModalDialog } from "@mui/joy";
import { deleteCar } from "@/app/actions/api";

type PropsType = {
  name: string;
  distance: string;
  time: string;
  number: string;
  reload: boolean;
  setReload: React.Dispatch<SetStateAction<boolean>>;
};

const Car: React.FC<PropsType> = ({ name, distance, time, number, reload, setReload }) => {
  const [token, setToken] = useState<string | null>(null);
  const [del, setDel] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);
  async function handleDelete() {
    if (token) {
      setLoading(true);
      try {
        await deleteCar(token, number);
        setReload(!reload)
        setLoading(false);
        setDel(false);
      } catch (error) {
        setDel(false);
        setLoading(false);
      }
    }
  }
  return (
    <div className="p-4 cursor-pointer relative shadow-md rounded-3xl bg-[#fff] border w-[300px]">
      <div
        onClick={(event) => {
          event.stopPropagation();
          setDel(true);
        }}
        className="absolute -right-[15px] rounded-full z-20 -top-[15px] text-slate-400 scale-[70%] hover:bg-red-50 p-2 "
      >
        <Cancel />
      </div>
      <div className="flex items-center">
        <div className="font-bold">{name}</div>
        <Image width={160} height={160} src={car.src} alt="car" />
      </div>
      <div className="flex gap-x-5 mt-3">
        <div className="text-sm px-2 py-1 bg-[#eee] rounded-3xl w-fit font-semibold flex gap-x-2 items-center text-slate-600">
          {/* <div>{roadIcon}</div> */}
          <div>{number}</div>
        </div>
        {/* <div className="text-sm px-2 py-1 bg-[#eee] rounded-3xl w-fit font-semibold flex gap-x-1 items-center text-slate-600">
          <div>
            <AccessTime className="scale-[85%]" />
          </div>
          <div>{time}</div>
        </div> */}
      </div>
      <Modal
        open={del}
        onClose={() => {
          setDel(false);
        }}
      >
        <ModalDialog variant="outlined" size="md">
          <DialogTitle>
            <WarningRounded />
            Confirmation
          </DialogTitle>
          <Divider />
          <div>
            Are you sure you want to delete car{" "}
            <strong>
              {" "}
              {name}, {number}{" "}
            </strong>{" "}
            ?
          </div>
          <DialogActions>
            <Button variant="solid" color="danger" loading={loading} onClick={handleDelete}>
              Confirm
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setDel(false)}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default Car;
