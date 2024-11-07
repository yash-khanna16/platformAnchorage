"use client";

import { Cancel, Close, WarningRounded } from "@mui/icons-material";
import { Chip, Modal, ModalDialog } from "@mui/joy";
import { Coupon } from "./page";
import { Dispatch, SetStateAction, use, useEffect, useState } from "react";
import ModifyCoupon from "./ModifyCoupon";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
} from "@mui/joy";
import { deleteCoupon } from "@/app/actions/api";

function Card({
  coupon,
  token,
  reload,
  setReload,
}: {
  coupon: Coupon;
  token: string;
  reload: boolean;
  setReload: Dispatch<SetStateAction<boolean>>;
}) {
  const couponTypeName = {
    free_item: "FREE ITEM",
    flat_discount: "FLAT DISCOUNT",
    percentage_discount: "PERCENTAGE DISCOUNT",
  };
  const [openModifyModal, setOpenModifyModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const colors = {
    free_item: {
      background: "#f0fdf4",
      text: "#16a34a",
    },
    flat_discount: {
      background: "#f5f3ff",
      text: "#7c3aed",
    },
    percentage_discount: {
      background: "#f0f9ff",
      text: "#0284c7",
    },
  };
  
  

  useEffect(() => {
    console.log("first: ", openModifyModal);
  }, [openModifyModal]);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteCoupon(token, coupon.coupon_id);
    setLoading(false);
    setReload(!reload);
    setOpenDeleteModal(false);
  };

  return (
    <div
      onClick={() => {
        console.log("clicked on coupon");
        setOpenModifyModal(true);
      }}
      className={`border ${
        coupon.is_active === false && "grayscale"
      }  w-[400px] h-[200px]  rounded-2xl cursor-pointer  hover:shadow-xl shadow-md transition-all duration-500 bg-white relative`}
    >
      <div
        onClick={(event) => {
          event.stopPropagation();
          setOpenDeleteModal(true);
          console.log("clicked delete coupon");
        }}
        className="absolute -right-[16px] rounded-full z-20 -top-[20px] text-slate-400 scale-[70%] hover:bg-red-50 p-2 "
      >
        <Cancel />
      </div>
      <div className=" p-5 overflow-auto h-full scrollNone">
        <div className=" mb-2 -mt-1 text-xs text-slate-600 font-semibold w-full flex justify-between ">
          <div>Expiry date</div> <div> {!coupon.end_date ? "No expiry" : coupon.end_date} </div>
        </div>
        <div className="flex justify-between">
          <div
            style={{ color: colors[coupon.coupon_type].text }}
            className={` font-semibold text-2xl `}
          >
            {coupon.code}
          </div>
          <Chip
            size="md"
            sx={{
              backgroundColor: colors[coupon.coupon_type].background,
              color: colors[coupon.coupon_type].text,
            }}
          >
            {couponTypeName[coupon.coupon_type]}
          </Chip>
        </div>
        <div className="my-1 text-slate-700 font-medium">{coupon.coupon_type_description}</div>
        <div className="text-sm text-slate-600 italic my-2 w-3/4">{coupon.description}</div>
        <div className="flex flex-wrap my-3 gap-2">
          {coupon.min_order_value && (
            <Chip size="sm">Min Order Value: ₹{coupon.min_order_value}</Chip>
          )}
          {coupon.max_discount && <Chip size="sm">Max Discount: ₹{coupon.max_discount}</Chip>}
          {coupon.percentage_discount && <Chip size="sm">{coupon.percentage_discount}% OFF </Chip>}
          {coupon.free_items.map((freeItem) => (
            <Chip key={freeItem.item_id} size="sm">
              {" "}
              {freeItem.name} x{freeItem.qty}{" "}
            </Chip>
          ))}
        </div>
      </div>
      <Modal
        open={openModifyModal}
        onClose={(event: any) => {
          event.stopPropagation();
          setOpenModifyModal(false);
        }}
      >
        <ModifyCoupon
          coupon={coupon}
          reload={reload}
          setReload={setReload}
          setOpenModifyModal={setOpenModifyModal}
        />
      </Modal>
      <Modal
        open={openDeleteModal}
        onClose={(event: any) => {
          event.stopPropagation();
          setOpenDeleteModal(false);
        }}
      >
        <ModalDialog variant="outlined" size="md">
          <DialogTitle>
            <WarningRounded />
            Confirmation
          </DialogTitle>
          <Divider />
          <div>Are you sure you want to delete Coupon ?</div>
          <DialogActions>
            <Button
              loading={loading}
              variant="solid"
              color="danger"
              onClick={(event) => {
                event.stopPropagation();
                handleDelete();
              }}
            >
              Confirm
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={(event) => {
                event.stopPropagation();
                setOpenDeleteModal(false);
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </div>
  );
}

export default Card;
