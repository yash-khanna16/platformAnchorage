import { Button, ModalDialog } from "@mui/joy";
import { DialogTitle } from "@mui/joy";
import { DialogActions } from "@mui/joy";
import { useEffect, useState } from "react";
import AddCouponBasicDetails from "./AddCouponBasicDetails";
import AddCouponSpecificDetails from "./AddCouponSpecificDetails";

export type MenuItem = {
  available: boolean;
  category: string;
  description: string;
  item_id: string;
  name: string;
};

export type CouponForm = {
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
    name: string
  }[];
  applicable_categories: string[];
  applicable_items: {
    item_id: string;
    qty: number;
    name: string;
  }[];
  selectedGuests: {
    booking_id: string;
    email: string
  }[];
  is_active: boolean;
};

export default function AddCoupon() {
  const [step, setStep] = useState(0);
  const steps = 2;

  const [formData, setFormData] = useState<CouponForm>({
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

  useEffect(() => {
    if (formData.coupon_type === "free_item") {
      setFormData((prev) => ({
        ...prev,
        max_discount: "",
        percentage_discount: "",
        discount_value: "",
      }));
    } else if (formData.coupon_type === 'flat_discount') {
      setFormData((prev) => ({
        ...prev,
        max_discount: "",
        percentage_discount: "",
        free_items: []
      }));
    } else if (formData.coupon_type === 'percentage_discount') {
      setFormData((prev) => ({
        ...prev,
        discount_value: "",
        free_items: []
      }));
    }
  }, [formData.coupon_type]);

  const validateStep0 = () => {
    const { code, description, coupon_type, coupon_type_description } = formData;
    return code.trim() !== "" && description.trim() !== "" && coupon_type.trim() !== "" && coupon_type_description.trim() !== "";
  };

  const handleNext = () => {
    if (step === steps - 1) {
      console.log("form: ", formData);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <ModalDialog
      sx={{
        width: 700,
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
        <Button onClick={handleNext} type="submit" disabled={!validateStep0()}>
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
