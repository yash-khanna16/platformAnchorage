"use client";

import { Cancel, Close } from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { Coupon } from "./page";

function Card({ coupon }: { coupon: Coupon }) {
  const couponTypeName = { free_item: "FREE ITEM", flat_discount: "FLAT DISCOUNT", percentage_discount: "PERCENTAGE DISCOUNT" };
  const colors = {
    free_item: {
      background: "#f0fdf4", // Light green background for free items
      text: "#16a34a", // Text color for free items
    },
    flat_discount: {
      background: "#f5f3ff", // Light purple background for flat discounts
      text: "#7c3aed", // Text color for flat discounts
    },
    percentage_discount: {
      background: "#f0f9ff", // Light blue background for percentage discounts
      text: "#0284c7", // Text color for percentage discounts
    },
  };

  return (
    <div
      onClick={() => {
        console.log("clicked on coupon");
      }}
      className={`border ${
        coupon.is_active === false && "grayscale"
      } p-5 w-[400px] h-[200px] rounded-2xl cursor-pointer  hover:shadow-xl shadow-md transition-all duration-500 bg-white relative`}
    >
      <div
        onClick={(event) => {
          event.stopPropagation();
          console.log("clicked delete coupon");
        }}
        className="absolute -right-[16px] rounded-full z-20 -top-[20px] text-slate-400 scale-[70%] hover:bg-red-50 p-2 "
      >
        <Cancel />
      </div>

      {/* <div className=" mb-2 -mt-1 text-xs text-slate-600 font-semibold w-full flex justify-between ">
          <div>Expiring</div> <div> {coupon.end_date} </div>
        </div> */}

      <div className=" mb-2 -mt-1 text-xs text-slate-600 font-semibold w-full flex justify-between ">
        <div>Expiry date</div> <div> {!coupon.end_date ? "No expiry" : coupon.end_date} </div>
      </div>
      <div className="flex justify-between">
        <div style={{ color: colors[coupon.coupon_type].text }} className={` font-semibold text-2xl `}>
          {coupon.code}
        </div>
        <Chip
          size="md"
          // color="success"
          sx={{
            backgroundColor: colors[coupon.coupon_type].background, // Background color based on coupon type
            color: colors[coupon.coupon_type].text, // Text color based on coupon type
          }}
        >
          {couponTypeName[coupon.coupon_type]}
        </Chip>
      </div>
      <div className="my-1 text-slate-700 font-medium">{coupon.coupon_type_description}</div>
      <div className="text-sm text-slate-600 italic my-2 w-3/4">{coupon.description}</div>
      <div className="flex flex-wrap my-3 gap-2">
        {coupon.min_order_value && <Chip size="sm">Min Order Value: ₹{coupon.min_order_value}</Chip>}
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
  );
}

export default Card;
