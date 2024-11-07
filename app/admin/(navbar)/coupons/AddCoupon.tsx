import { Button, ModalDialog } from "@mui/joy";
import { DialogTitle } from "@mui/joy";
import { DialogActions } from "@mui/joy";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import AddCouponBasicDetails from "./AddCouponBasicDetails";
import AddCouponSpecificDetails from "./AddCouponSpecificDetails";
import { addCoupon } from "@/app/actions/api";

export type MenuItem = {
  available: boolean;
  category: string;
  description: string;
  item_id: string;
  name: string;
};

export type CouponForm = {
  coupon_id: string;
  code: string;
  description: string;
  coupon_type: string;
  coupon_type_description: string;
  percentage_discount: number | string;
  discount_value: number | string;
  max_discount: number | string;
  min_order_value: number | string;
  start_date: string;
  end_date: string;
  usage_limit: number | null;
  user_usage_limit: number | null;
  free_items: {
    item_id: string;
    qty: number;
    name: string;
  }[];
  applicable_categories: string[];
  applicable_items: {
    item_id: string;
    qty: number;
    name: string;
  }[];
  selectedGuests: {
    booking_id: string;
    email: string;
  }[];
  is_active: boolean;
};
type AddCouponProps = {
  token: string;
  setAddCoupon: Dispatch<SetStateAction<boolean>>;
  reload: boolean;
  setReload: Dispatch<SetStateAction<boolean>>;
};

export default function AddCoupon({ token, setAddCoupon, reload, setReload }: AddCouponProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const steps = 2;

  const [formData, setFormData] = useState<CouponForm>({
    coupon_id: "",
    code: "",
    description: "",
    coupon_type: "free_item", // Default value
    coupon_type_description: "",
    percentage_discount: 0,
    discount_value: "",
    max_discount: "",
    min_order_value: "",
    start_date: "",
    end_date: "",
    usage_limit: null,
    user_usage_limit: null,
    free_items: [],
    applicable_categories: [],
    applicable_items: [],
    selectedGuests: [],
    is_active: true,
  });

  const handleCouponSubmit = async () => {
    let couponData: CouponForm = formData;
    couponData.max_discount =
      formData.max_discount === "" ? 0 : parseInt(formData.max_discount.toString());
    couponData.min_order_value =
      formData.min_order_value === "" ? 0 : parseInt(formData.min_order_value.toString());
    couponData.percentage_discount =
      formData.percentage_discount === "" ? 0 : parseInt(formData.percentage_discount.toString());
    couponData.usage_limit =
      formData.usage_limit === null ? 0 : parseInt(formData.percentage_discount.toString());
    couponData.user_usage_limit =
      formData.user_usage_limit === null ? 0 : parseInt(formData.percentage_discount.toString());
    couponData.discount_value =
      formData.discount_value === "" ? 0 : parseInt(formData.discount_value.toString());
    console.log(couponData);
    setLoading(true);
    const result = await addCoupon(token, couponData);
    setLoading(false);
    setReload(!reload);
    setAddCoupon(false);
    console.log(result);
  };

  useEffect(() => {
    if (formData.coupon_type === "free_item") {
      setFormData((prev) => ({
        ...prev,
        max_discount: "",
        percentage_discount: "",
        discount_value: "",
      }));
    } else if (formData.coupon_type === "flat_discount") {
      setFormData((prev) => ({
        ...prev,
        max_discount: "",
        percentage_discount: "",
        free_items: [],
      }));
    } else if (formData.coupon_type === "percentage_discount") {
      setFormData((prev) => ({
        ...prev,
        discount_value: "",
        free_items: [],
      }));
    }
  }, [formData.coupon_type]);

  const validateStep0 = () => {
    const { code, description, coupon_type, coupon_type_description } = formData;
    return (
      code.trim() !== "" &&
      description.trim() !== "" &&
      coupon_type.trim() !== "" &&
      coupon_type_description.trim() !== ""
    );
  };

  const handleNext = () => {
    if (step === steps - 1) {
      handleCouponSubmit();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <ModalDialog
      sx={{
        width: 700,
        overflowY: "auto",
      }}
    >
      <DialogTitle>
        <span className="font-semibold text-2xl">Add Coupon</span>{" "}
      </DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("form submitted");
        }}
        className="my-4 "
      >
        {step === 0 && <AddCouponBasicDetails formData={formData} setFormData={setFormData} />}
        {step === 1 && <AddCouponSpecificDetails formData={formData} setFormData={setFormData} />}
      </form>
      <DialogActions>
        <Button loading={loading} onClick={handleNext} type="submit" disabled={!validateStep0()}>
          {" "}
          {step === steps - 1 ? "Finish" : "Next"}{" "}
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setStep(step - 1);
          }}
          disabled={step === 0}
        >
          Previous
        </Button>
      </DialogActions>
    </ModalDialog>
  );
}
