import { Button, ModalDialog } from "@mui/joy";
import { DialogTitle } from "@mui/joy";
import { DialogActions } from "@mui/joy";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import AddCouponBasicDetails from "./AddCouponBasicDetails";
import AddCouponSpecificDetails from "./AddCouponSpecificDetails";
import { addCoupon, fetchAllItems } from "@/app/actions/api";

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
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [categoryMap, setCategoryMap] = useState<Map<string, string>>(new Map());
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
    let couponData = formData as any;

    couponData.applicable_categories = couponData.applicable_categories
      .map((categoryName: string) => {
        const categoryId = categoryMap.get(categoryName);
        return categoryId;
      })
      .filter((categoryId: string | undefined) => categoryId !== undefined);

    couponData.max_discount =
      formData.max_discount === "" || !formData.max_discount ? null : parseInt(formData.max_discount.toString());
    couponData.min_order_value =
      formData.min_order_value === "" || !formData.min_order_value ? null : parseInt(formData.min_order_value.toString());
    couponData.percentage_discount =
      formData.percentage_discount === "" || !formData.percentage_discount
        ? null
        : parseInt(formData.percentage_discount.toString());
    couponData.usage_limit = formData.usage_limit === null ? null : parseInt(formData.usage_limit.toString());
    couponData.user_usage_limit = formData.user_usage_limit === null ? null : parseInt(formData.user_usage_limit.toString());
    couponData.discount_value =
      formData.discount_value === "" || !formData.discount_value ? null : parseInt(formData.discount_value.toString());
    console.log(couponData);
    setLoading(true);
    const result = await addCoupon(token, couponData);
    console.log(result);
    setLoading(false);
    setReload(!reload);
    setAddCoupon(false);
  };

  useEffect(() => {
    if (token !== "") {
      fetchAllItems(token).then((items: any[]) => {
        const map = items.reduce((acc, item) => {
          acc.set(item.category, item.category_id);
          return acc;
        }, new Map<string, string>());
        setCategoryMap(map);
      });
    }
  }, [token]);

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
    return code.trim() !== "" && description.trim() !== "" && coupon_type.trim() !== "" && coupon_type_description.trim() !== "";
  };

  const validateStep1 = () => {
    const { start_date,end_date, min_order_value,percentage_discount,free_items,discount_value,max_discount,coupon_type } = formData;

    if (start_date === "" && end_date === "" && min_order_value === "" ) {
      return false;
    }
    if (coupon_type === 'free_item') {
      return free_items.length > 0;
    }
    if (coupon_type === 'flat_discount') {
      return discount_value !== "";
    }
    if (coupon_type === 'percentage_discount') {
      return percentage_discount !== "" && max_discount !== "";
    }
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
        <Button
          loading={loading}
          onClick={handleNext}
          type="submit"
          disabled={(step === 0 && !validateStep0()) || (step === 1 && !validateStep1())}
        >
          {step === steps - 1 ? "Finish" : "Next"}
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
