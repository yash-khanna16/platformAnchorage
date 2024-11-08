import { FormControl, FormLabel, Input, Option, Select } from "@mui/joy";
import { CouponForm } from "./AddCoupon";
import React from "react";

export default function AddCouponBasicDetails({
  formData,
  setFormData,
}: {
  formData: CouponForm;
  setFormData: React.Dispatch<React.SetStateAction<CouponForm>>;
}) {
  const coupon_types = [
    { value: "free_item", name: "FREE ITEM" },
    { value: "flat_discount", name: "FLAT DISCOUNT" },
    { value: "percentage_discount", name: "PERCENTAGE DISCOUNT" },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | {
          target: {
            value: string | number;
            name: string;
          };
        }
    >
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;

    if ("name" in target) {
      const { name, value } = target;

      const newValue = name === "code" ? value.toUpperCase() : value;

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  const handleSelectChange = (event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null, value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      coupon_type: value || "", // Ensure it's a string
    }));
  };

  const handleIsActiveChange = (event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null, value: string|null) => {
    setFormData((prev) => ({
      ...prev,
      is_active: value==="true",
    }));
  };

  return (
    <div className="w-full grid grid-cols-2 gap-4 overflow-y-scroll scrollNone">
      <FormControl>
        <FormLabel>Coupon Code</FormLabel>
        <Input required name="code" value={formData.code} placeholder="WELCOME50" onChange={handleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Coupon Description</FormLabel>
        <Input
          required
          name="description"
          value={formData.description}
          placeholder="₹50 flat discount on first order above ₹200"
          onChange={handleChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Coupon Type</FormLabel>
        <Select required name="coupon_type" value={formData.coupon_type} onChange={handleSelectChange}>
          {coupon_types.map((couponType, index) => (
            <Option key={index} value={couponType.value}>
              {couponType.name}
            </Option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Coupon Type Description</FormLabel>
        <Input
          required
          name="coupon_type_description"
          value={formData.coupon_type_description}
          placeholder="FLAT ₹50 OFF"
          onChange={handleChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Coupon Active?</FormLabel>
        <Select required name="is_active" defaultValue="true" value={formData.is_active ? "true": "false"} placeholder="" onChange={handleIsActiveChange}>
          <Option value="true">Yes</Option>
          <Option value="false">No</Option>
        </Select>
      </FormControl>
    </div>
  );
}
