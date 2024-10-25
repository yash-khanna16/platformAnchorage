import { fetchAllItems } from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalDialog,
  Option,
  Select,
  Modal,
  Typography,
  AutocompleteChangeReason,
} from "@mui/joy";
import { DialogTitle } from "@mui/joy";
import { Autocomplete, DialogActions } from "@mui/joy";
import { useEffect, useState } from "react";

type MenuItem = {
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

type CouponForm = {
  code: string;
  description: string;
  coupon_type: string;
  coupon_type_description: string;
  percentage_discount: string | null;
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
  }[];
  applicable_categories?: string[];
  applicable_items: {
    // Add this field for applicable items
    item_id: string;
    qty: number;
  }[];
};

export default function AddCoupon() {
  const [token, setToken] = useState("");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [step, setStep] = useState(0);
  const steps = 2;

  const [formData, setFormData] = useState<CouponForm>({
    code: "",
    description: "",
    coupon_type: "free_item", // Default value
    coupon_type_description: "",
    percentage_discount: "",
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
  });

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null); // Track selected item
  const [openQtyModal, setOpenQtyModal] = useState(false); // Control quantity modal
  const [itemQty, setItemQty] = useState(1); // Track item quantity
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedApplicableItem, setSelectedApplicableItem] = useState<MenuItem | null>(null);
  const [openApplicableQtyModal, setOpenApplicableQtyModal] = useState(false);
  const [applicableItemQty, setApplicableItemQty] = useState(1);

  const coupon_types = [
    { value: "free_item", name: "FREE ITEM" },
    { value: "flat_discount", name: "FLAT DISCOUNT" },
    { value: "percentage_discount", name: "PERCENTAGE DISCOUNT" },
  ];

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      fetchAllItems(token).then((items: MenuItem[]) => {
        setItems(items);
        const uniqueCategories = Array.from(new Set<string>(items.map((item) => item.category)));
        setCategories(uniqueCategories);
      });
    }
  }, [token]);

  const handleApplicableItemSelect = (
    event: React.SyntheticEvent<Element, Event>,
    value: MenuItem[],
    reason: AutocompleteChangeReason
  ) => {
    if (reason === "selectOption" && value.length > 0) {
      const selectedItem = value[value.length - 1];
      setSelectedApplicableItem(selectedItem);
      setOpenApplicableQtyModal(true); // Open modal for quantity input
    }
  };

  // Handle quantity submission for applicable items
  const handleApplicableQtySubmit = () => {
    if (selectedApplicableItem) {
      setFormData((prev) => ({
        ...prev,
        applicable_items: [
          ...prev.applicable_items,
          {
            item_id: selectedApplicableItem.item_id,
            qty: applicableItemQty,
          },
        ],
      }));
      setOpenApplicableQtyModal(false);
      setApplicableItemQty(1); // Reset qty
      setSelectedApplicableItem(null); // Clear selection
    }
  };

  const validateStep0 = () => {
    const { code, description, coupon_type, coupon_type_description } = formData;
    return code.trim() !== "" && description.trim() !== "" && coupon_type.trim() !== "" && coupon_type_description.trim() !== "";
  };

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

  const handleNext = () => {
    if (step === steps - 1) {
      console.log("form: ", formData);
    } else {
      setStep(step + 1);
    }
  };
  const handleItemSelect = (event: React.SyntheticEvent<Element, Event>, value: MenuItem[], reason: AutocompleteChangeReason) => {
    if (reason === "selectOption" && value.length > 0) {
      const selectedItem = value[value.length - 1]; // Get the last selected item
      setSelectedItem(selectedItem);
      setOpenQtyModal(true); // Open modal for quantity input
    }
  };
  const handleQtySubmit = () => {
    if (selectedItem) {
      setFormData((prev) => ({
        ...prev,
        free_items: [
          ...prev.free_items,
          {
            item_id: selectedItem.item_id,
            qty: itemQty,
          },
        ],
      }));
      setOpenQtyModal(false);
      setItemQty(1); // Reset qty
      setSelectedItem(null); // Clear selection
    }
  };

  const handleCategorySelect = (event: React.SyntheticEvent<Element, Event>, value: string[]) => {
    setFormData((prev) => ({
      ...prev,
      applicable_categories: value,
    }));
  };

  return (
    <ModalDialog
      sx={{
        width: 700,
      }}
    >
      <DialogTitle>
        {" "}
        <span className="font-semibold text-2xl">Add Coupon</span>{" "}
      </DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("form submitted");
        }}
        className="my-4 grid grid-cols-2 gap-4"
      >
        {" "}
        {step === 0 && (
          <>
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
          </>
        )}
        {step === 1 && (
          <>
            <FormControl>
              <FormLabel>Start Date</FormLabel>
              <Input name="start_date" type="date" value={formData.start_date} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>End Date</FormLabel>
              <Input name="end_date" type="date" value={formData.end_date} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Coupon Usage Limit</FormLabel>
              <Input name="usage_limit" value={formData.usage_limit || ""} placeholder="50" onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Individual User Usage Limit</FormLabel>
              <Input name="user_usage_limit" value={formData.user_usage_limit || ""} placeholder="50" onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Min Order Value</FormLabel>
              <Input name="min_order_value" value={formData.min_order_value} placeholder="200" onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Applicable On Categories</FormLabel>
              <Autocomplete
                required
                multiple
                options={categories}
                getOptionLabel={(option) => option}
                onChange={handleCategorySelect} // Handle item
              />
            </FormControl>
            <FormControl>
              <FormLabel>Applicable Items</FormLabel>
              <Autocomplete
                required
                multiple
                options={items}
                getOptionLabel={(option) => option.name}
                onChange={handleApplicableItemSelect} // Handle selection for applicable items
              />
            </FormControl>

            {formData.coupon_type === "free_item" && (
              <FormControl>
                <FormLabel>Free Items</FormLabel>
                <Autocomplete
                  required
                  multiple
                  options={items}
                  getOptionLabel={(option) => option.name}
                  onChange={handleItemSelect} // Handle item
                />
              </FormControl>
            )}
          </>
        )}
      </form>
      <DialogActions>
        <Button onClick={handleNext} type="submit" disabled={!validateStep0()}>
          {" "}
          {step === steps - 1 ? "Finish" : "Next"}{" "}
        </Button>
        <Button
          onClick={() => {
            setStep(step - 1);
          }}
          disabled={step === 0}
        >
          Previous
        </Button>
      </DialogActions>

      {/* Quantity modal */}
      <Modal open={openQtyModal} onClose={() => setOpenQtyModal(false)}>
        <ModalDialog>
          <Typography>Select quantity for {selectedItem?.name}</Typography>
          <FormControl>
            <FormLabel>Quantity</FormLabel>
            <Input
              type="number"
              value={itemQty}
              onChange={(e) => setItemQty(Number(e.target.value))}
              slotProps={{
                input: {
                  min: 1,
                },
              }}
            />
          </FormControl>
          <DialogActions>
            <Button onClick={handleQtySubmit}>Confirm</Button>
            <Button onClick={() => setOpenQtyModal(false)}>Cancel</Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      <Modal open={openApplicableQtyModal} onClose={() => setOpenApplicableQtyModal(false)}>
        <ModalDialog>
          <Typography>Select quantity for {selectedApplicableItem?.name}</Typography>
          <FormControl>
            <FormLabel>Quantity</FormLabel>
            <Input
              type="number"
              value={applicableItemQty}
              onChange={(e) => setApplicableItemQty(Number(e.target.value))}
              slotProps={{
                input: {
                  min: 1,
                },
              }}
            />
          </FormControl>
          <DialogActions>
            <Button onClick={handleApplicableQtySubmit}>Confirm</Button>
            <Button onClick={() => setOpenApplicableQtyModal(false)}>Cancel</Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </ModalDialog>
  );
}
