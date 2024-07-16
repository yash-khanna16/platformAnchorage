"use client";
import { deleteDriver } from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { Cancel, WarningRounded } from "@mui/icons-material";
import { Avatar, Badge, Button, DialogActions, DialogTitle, Divider, Modal, ModalDialog, Typography } from "@mui/joy";
import React, { SetStateAction, useEffect, useState } from "react";

const Driver: React.FC<{ name: string; status: string, reload: boolean, setReload: React.Dispatch<SetStateAction<boolean>> }> = ({ name, status, reload, setReload }) => {
  const [del, setDel] = useState(false);
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

  async function handleDelete() {
    if (token) {
      setLoading(true)
      try {
        await deleteDriver(token, name)
        setDel(false)
        setReload(!reload)
        setLoading(false)
      } catch(error) {
        setDel(false)
        setLoading(false)
      }
    }
  }

  return (
    <div className="font-semibold gap-y-2 relative w-[100px] flex flex-col cursor-pointer items-center">
      <Badge
        color="warning"
        size="lg"
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: status === "green" ? "#00fc4c" : status === "red" ? "#ff3d3d" : "#fa9a6e",
            color: "#ffffff",
            width: "20px",
            height: "20px",
            fontSize: "1rem",
          },
        }}
        badgeInset="10px 20px 0 0"
      >
        <div
          onClick={(event) => {
            event.stopPropagation();
            setDel(true);
          }}
          className="absolute -right-[0px] rounded-full z-20 -bottom-[10px]  text-red-400 scale-[80%] hover:bg-red-50 p-2 "
        >
          <Cancel />
        </div>
        <Avatar
          sx={{
            width: "80px",
            height: "80px",
            fontSize: "2rem",
          }}
        />
      </Badge>
      <Typography textAlign="center">{name}</Typography>
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
            Are you sure you want to delete driver <strong>{name}</strong>?
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

export default Driver;
