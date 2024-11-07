import { Button, ModalClose, ModalDialog } from "@mui/joy";
import { DialogTitle } from "@mui/joy";
import { DialogActions } from "@mui/joy";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import AddCouponBasicDetails from "./AddCouponBasicDetails";
import AddCouponSpecificDetails from "./AddCouponSpecificDetails";
import { Coupon } from "./page";
import { fetchAllItems, modifyCoupon, searchAllGuests } from "@/app/actions/api";
import { formatDate } from "@/app/actions/utils";
import { getAuthAdmin } from "@/app/actions/cookie";

export type MenuItem = {
  available: boolean;
  category: string;
  description: string;
  item_id: string;
  name: string;
  price: number;
  time_to_prepare: number;
  type: string;
  base_price: number;
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

export function convertCouponToForm(
  coupon: Coupon,
  rows: ReservationType[],
  items: MenuItem[]
): CouponForm {
  // Create an array of { booking_id, email } objects based on emails in coupon.selectedGuests
  const selectedGuests = coupon.selectedGuests.map((guestEmail) => {
    const booking = rows.find((row) => row.guest_email === guestEmail);
    return {
      booking_id: booking ? booking.booking_id : "",
      email: guestEmail,
    };
  });

  return {
    coupon_id: coupon.coupon_id,
    code: coupon.code,
    description: coupon.description,
    coupon_type: coupon.coupon_type,
    coupon_type_description: coupon.coupon_type_description,
    percentage_discount: coupon.percentage_discount ?? "", // Convert to string if needed
    discount_value: coupon.discount_value,
    max_discount: coupon.max_discount !== null ? coupon.max_discount.toString() : "", // Convert to string if not null
    min_order_value: coupon.min_order_value.toString(), // Convert to string
    start_date: coupon.start_date,
    end_date: coupon.end_date,
    usage_limit: coupon.usage_limit,
    user_usage_limit: coupon.user_usage_limit,
    free_items: coupon.free_items.map((item) => ({
      item_id: item.item_id,
      qty: item.qty,
      name: item.name,
    })),
    applicable_categories: [...coupon.applicable_categories], // Copy array
    applicable_items: coupon.applicable_items.map((item) => ({
      item_id: item.item_id,
      qty: item.qty,
      name: items.find((i) => i.item_id === item.item_id)?.name || "",
    })),
    selectedGuests, // Use the newly mapped array of { booking_id, email }
    is_active: coupon.is_active,
  };
}

type ReservationType = {
  additional_info: string | null;
  booking_id: string;
  breakfast: string | null;
  checkin: string;
  checkout: string;
  company: string;
  email: string;
  guest_email: string;
  meal_non_veg: number;
  meal_veg: number;
  name: string;
  phone: string;
  rank: string | null;
  remarks: string;
  room: string;
  vessel: string;
};

export default function ModifyCoupon({
  coupon,
  reload,
  setReload,
  setOpenModifyModal,
}: {
  coupon: Coupon;
  reload: boolean;
  setReload: Dispatch<SetStateAction<boolean>>;
  setOpenModifyModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [step, setStep] = useState(0);
  const steps = 2;
  const [rows, setRows] = useState<ReservationType[]>([]);
  const [token, setToken] = useState("");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token !== "") {
      fetchAllItems(token).then((items: MenuItem[]) => {
        setItems(items);
      });
      getGuests();
    }
  }, [token]);

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

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

  useEffect(() => {
    if (rows.length > 0 && items.length > 0) {
      setFormData(convertCouponToForm(coupon, rows, items));
      //   console.log("useeffect ran selected guest: ", coupon.selectedGuests);
      //   console.log("useeffect ran rows: ", rows);
      console.log("coupon: ", coupon);
      console.log("useeffect ran final: ", convertCouponToForm(coupon, rows, items));
    }
  }, [rows, items]);

  async function getGuests() {
    try {
      let fetchedRows = await searchAllGuests(token);

      const currentTime = new Date();

      fetchedRows = fetchedRows.map((row: ReservationType) => {
        const checkinTime = new Date(row.checkin);
        const checkoutTime = new Date(row.checkout);

        let status;
        if (checkoutTime < currentTime) {
          status = "Expired";
        } else if (checkinTime > currentTime) {
          status = "Upcoming";
        } else {
          status = "Active";
        }

        return {
          ...row,
          checkin: formatDate(row.checkin),
          checkout: formatDate(row.checkout),
          status: status,
        };
      });

      setRows(fetchedRows);
    } catch (error) {
      console.log(error);
    }
  }

  const handleCouponSubmit = async () => {
    let couponData: CouponForm = formData;
    couponData.max_discount =
      formData.max_discount === "" ? 0 : parseInt(formData.max_discount.toString());
    couponData.min_order_value =
      formData.min_order_value === "" ? 0 : parseInt(formData.min_order_value.toString());
    couponData.percentage_discount =
      formData.percentage_discount === "" ? 0 : parseInt(formData.percentage_discount.toString());
      console.log(formData.user_usage_limit,formData.usage_limit)
    couponData.discount_value =
      formData.discount_value === "" ? 0 : parseInt(formData.discount_value.toString());
    console.log(couponData);
    setLoading(true);
    const result = await modifyCoupon(token, couponData);
    setLoading(false);
    setReload(!reload);
    setOpenModifyModal(false);
    console.log(result);
  };

  useEffect(() => {
    getGuests();
  }, []);

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
        <span className="font-semibold text-2xl">Modify Coupon</span>{" "}
      </DialogTitle>
      <ModalClose />
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
