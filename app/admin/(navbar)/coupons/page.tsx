"use client";
import { Add } from "@mui/icons-material";
import { Button, Modal, ModalDialog } from "@mui/joy";
import CouponCard from "./CouponCard";
import { useEffect, useState } from "react";
import { getAuthAdmin } from "@/app/actions/cookie";
import { fetchAllCoupons } from "@/app/actions/api";
import AddCoupon from "./AddCoupon";

export type Coupon = {
  coupon_id: string;
  code: string;
  description: string;
  coupon_type: "free_item" | "percentage_discount" | "flat_discount";
  discount_value: string;
  max_discount: number | null;
  min_order_value: number;
  start_date: string;
  end_date: string;
  usage_limit: number;
  is_active: boolean;
  created_at: string | null;
  modified_at: string | null;
  coupon_type_description: string;
  category_id: string;
  is_allowed: boolean | null;
  item_id: string | null;
  user_usage_limit: number | null;
  percentage_discount: number | null;
  applicable_items: {
    item_id: string;
    qty: number;
  }[];
  applicable_categories: string[];
  selectedGuests: string[];
  free_items: {
    item_id: string;
    qty: number;
    name: string;
    price: number;
    type: string;
    available: boolean;
    time_to_prepare: number;
    base_price: number;
  }[];
};

export type FreeItem = {
  coupon_id: string;
  item_id: string;
  qty: number;
  created_at: string | null;
  modified_at: string | null;
  name: string;
  description: string;
  price: number;
  type: string;
  category_id: string;
  category: string;
  available: boolean;
  time_to_prepare: number;
  base_price: number;
};

export default function Coupon() {
  const [token, setToken] = useState("");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [addCoupon, setAddCoupon] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      fetchAllCoupons(token).then((coupons: Coupon[]) => {
        coupons.map((coupon: Coupon) => {
          coupon.start_date = coupon.start_date.split("T")[0];
          coupon.end_date = coupon.end_date.split("T")[0];
        });
        setCoupons(coupons);
        console.log("coupons: ", coupons);
      });
    }
  }, [token, reload]);

  return (
    <div className="m-10 max-xl:mx-5">
      <div className="flex justify-between">
        <div className="text-3xl font-semibold text-slate-800">Coupons</div>
        <Button
          onClick={() => {
            setAddCoupon(true);
          }}
          variant="outlined"
          color="neutral"
          startDecorator={<Add />}
        >
          Add Coupon
        </Button>
      </div>
      <div className="my-5 flex flex-wrap gap-5">
        {coupons.map((coupon: Coupon, index: number) => (
          <CouponCard
            key={index}
            coupon={coupon}
            token={token}
            reload={reload}
            setReload={setReload}
          />
        ))}
      </div>

      <Modal open={addCoupon} onClose={() => setAddCoupon(false)}>
        <AddCoupon
          token={token}
          setAddCoupon={setAddCoupon}
          reload={reload}
          setReload={setReload}
        />
      </Modal>
    </div>
  );
}
