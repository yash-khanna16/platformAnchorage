import {
  Autocomplete,
  AutocompleteChangeReason,
  Button,
  Chip,
  ChipDelete,
  DialogActions,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Option,
  Select,
  Typography,
} from "@mui/joy";
import { CouponForm, MenuItem } from "./AddCoupon";
import React, { useEffect, useState } from "react";
import { getAuthAdmin } from "@/app/actions/cookie";
import { fetchAllItems, searchAllGuests } from "@/app/actions/api";
import Reservations from "../manage-rooms/[room]/Reservations";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { formatDate } from "@/app/actions/utils";
import { Cancel } from "@mui/icons-material";

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
type GuestType = {
  booking_id?: string;
  company?: string;
  name?: string;
  phone?: string;
  vessel?: string;
  remark?: string;
};

export default function AddCouponSpecificDetails({
  formData,
  setFormData,
}: {
  formData: CouponForm;
  setFormData: React.Dispatch<React.SetStateAction<CouponForm>>;
}) {
  const [selectedItem, setSelectedItem] = useState<{ item_id: string; name: string } | null>(null); // Track selected item
  const [openQtyModal, setOpenQtyModal] = useState(false); // Control quantity modal
  const [itemQty, setItemQty] = useState(1); // Track item quantity
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedApplicableItem, setSelectedApplicableItem] = useState<{ item_id: string; name: string } | null>(null);
  const [openApplicableQtyModal, setOpenApplicableQtyModal] = useState(false);
  const [applicableItemQty, setApplicableItemQty] = useState(1);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [token, setToken] = useState("");
  const [openSelectGuest, setOpenSelectGuest] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ReservationType[]>([]);
  const [filteredRows, setFilteredRows] = useState<ReservationType[]>([]);
  const [search, setSearch] = useState("");
  const columns = ["name", "room", "status", "checkin", "checkout", "email", "phone", "company", "rank"];
  const headers = ["Name", "Room No.", "Status", "Check In", "Check Out", "Email", "Phone No.", "Company", "Rank"];
  const [autoCompleteItems, setAutoCompleteItems] = useState<{ item_id: string; name: string }[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<GridRowSelectionModel[]>(
    formData.selectedGuests.map((g) => g.booking_id) as unknown as GridRowSelectionModel[]
  );

  const [visibility, setVisibility] = useState<string | null>(formData.selectedGuests.length > 0 ? "guests" : "public");

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      fetchAllItems(token).then((items: MenuItem[]) => {
        setItems(items);
        setAutoCompleteItems(items);
        const uniqueCategories = Array.from(new Set<string>(items.map((item) => item.category)));
        setCategories(uniqueCategories);
      });
      getGuests();
    }
  }, [token]);

  useEffect(() => {
    if (selectedGuest.length === 0) setVisibility("public");

    const selectedGuestDetails = selectedGuest
      .map((guest) => {
        const matchedRow = rows.find((row) => row.booking_id === guest.toString());
        return matchedRow ? { booking_id: matchedRow.booking_id, email: matchedRow.guest_email } : null;
      })
      .filter((guest) => guest !== null); // Filter out any null values

    setFormData((prev) => ({
      ...prev,
      selectedGuests: selectedGuestDetails as { booking_id: string; email: string }[],
    }));
  }, [selectedGuest, rows]); // Add rows as a dependency

  const handleItemSelect = (
    event: React.SyntheticEvent<Element, Event>,
    value: { item_id: string; name: string }[],
    reason: AutocompleteChangeReason
  ) => {
    if (reason === "removeOption") {
      setFormData((prev) => ({
        ...prev,
        free_items: value.map((item) => ({
          item_id: item.item_id,
          qty: prev.free_items.find((i) => i.item_id === item.item_id)?.qty || 1,
          name: prev.free_items.find((i) => i.item_id === item.item_id)?.name || "",
        })),
      }));
    } else if (reason === "selectOption") {
      const selectedItem = value[value.length - 1];
      setSelectedItem(selectedItem);
      setOpenQtyModal(true);
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
            name: items.find((item) => item.item_id === selectedItem.item_id)?.name || "",
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

  const handleApplicableItemSelect = (
    event: React.SyntheticEvent<Element, Event>,
    value: { item_id: string; name: string }[],
    reason: AutocompleteChangeReason
  ) => {
    if (reason === "removeOption") {
      setFormData((prev) => ({
        ...prev,
        applicable_items: value.map((item) => ({
          item_id: item.item_id,
          qty: prev.applicable_items.find((i) => i.item_id === item.item_id)?.qty || 1,
          name: prev.applicable_items.find((i) => i.item_id === item.item_id)?.name || "",
        })),
      }));
    } else if (reason === "selectOption" && value.length > 0) {
      const selectedItem = value[value?.length - 1];
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
            name: selectedApplicableItem.name,
          },
        ],
      }));
      setOpenApplicableQtyModal(false);
      setApplicableItemQty(1); // Reset qty
      setSelectedApplicableItem(null); // Clear selection
    }
  };

  function fetchBookingDetail(bookingId: string): string | undefined {
    return rows.find((row) => row.booking_id === bookingId)?.room + " " + rows.find((row) => row.booking_id === bookingId)?.name;
  }

  const handleSelectChange = (event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null, value: string | null) => {
    setVisibility(value);
    if (value === "guests") {
      setOpenSelectGuest(true);
    } else {
      setSelectedGuest([]);
    }
  };

  const handleSearch = () => {
    if (search.trim() === "") {
      setFilteredRows(rows);
    } else {
      const lowercasedSearch = search.toLowerCase();
      const filtered = rows.filter((row) =>
        columns.some((column) => row[column as keyof ReservationType]?.toString().toLowerCase().includes(lowercasedSearch))
      );
      setFilteredRows(filtered);
    }
  };

  async function getGuests() {
    try {
      let fetchedRows = await searchAllGuests(token);
      console.log(fetchedRows);

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

      setFilteredRows(fetchedRows);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className="gap-4 grid grid-cols-2 overflow-y-scroll scrollNone">
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
          <Input
            name="usage_limit"
            value={formData.usage_limit || ""}
            placeholder="Enter limit or leave blank for unlimited"
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Individual User Usage Limit</FormLabel>
          <Input
            name="user_usage_limit"
            value={formData.user_usage_limit || ""}
            placeholder="Enter limit or leave blank for unlimited"
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Min Order Value</FormLabel>
          <Input
            name="min_order_value"
            value={formData.min_order_value}
            placeholder="Enter amount or leave blank for no min order value"
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Applicable On Categories</FormLabel>
          <Autocomplete
            required
            multiple
            value={formData.applicable_categories}
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
            value={formData.applicable_items}
            options={autoCompleteItems}
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
              value={formData.free_items}
              options={autoCompleteItems}
              getOptionLabel={(option) => option.name}
              onChange={handleItemSelect} // Handle item
            />
          </FormControl>
        )}

        {formData.coupon_type === "flat_discount" && (
          <FormControl>
            <FormLabel>Discount Value</FormLabel>
            <Input name="discount_value" value={formData.discount_value} placeholder="50" onChange={handleChange} />
          </FormControl>
        )}
        {formData.coupon_type === "percentage_discount" && (
          <>
            <FormControl>
              <FormLabel>Percentage Discount</FormLabel>
              <Input name="percentage_discount" value={formData.percentage_discount} placeholder="50" onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Max Discount</FormLabel>
              <Input name="max_discount" value={formData.max_discount} placeholder="50" onChange={handleChange} />
            </FormControl>
          </>
        )}
        <FormControl>
          <FormLabel>Visibility</FormLabel>
          <Select value={visibility} onChange={handleSelectChange}>
            <Option value="public">Public</Option>
            <Option value="guests">Select Guests</Option>
          </Select>
        </FormControl>
        {selectedGuest.length > 0 && (
          <FormControl>
            <FormLabel>Selected Guests</FormLabel>
            <div className="flex gap-2 my-1 flex-wrap">
              {selectedGuest.map((guest, index) => (
                <Chip
                  endDecorator={
                    <ChipDelete
                      onClick={() => {
                        setSelectedGuest((prevGuests) => prevGuests.filter((currentGuest) => guest !== currentGuest));
                        if (selectedGuest.length === 1) {
                        }
                      }}
                    >
                      <Cancel fontSize="inherit" className="text-slate-600 hover:text-slate-800 cursor-pointer" />
                    </ChipDelete>
                  }
                  key={index}
                >
                  {fetchBookingDetail(guest.toString())}
                </Chip>
              ))}
            </div>
          </FormControl>
        )}
      </div>
      <Modal
        open={openSelectGuest}
        onClose={() => {
          setOpenSelectGuest(false);
          setSelectedGuest([]);
        }}
      >
        <ModalDialog>
          <Reservations
            reload={reload}
            location="movement"
            setSelectedGuest={setSelectedGuest}
            setReload={setReload}
            loading={loading}
            handleSearch={handleSearch}
            search={search}
            setSearch={setSearch}
            rowsData={filteredRows}
            columns={columns}
            headers={headers}
          />
          <DialogActions>
            <Button
              onClick={() => {
                setOpenSelectGuest(false);
              }}
            >
              Confirm
            </Button>
            <Button
              onClick={() => {
                setOpenSelectGuest(false);
                setSelectedGuest([]);
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      <Modal open={openQtyModal} onClose={() => setOpenQtyModal(false)}>
        <ModalDialog>
          <Typography>
            Select quantity for <span className="font-semibold">{selectedItem?.name}</span>
          </Typography>
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
            <Button variant="plain" color="danger" onClick={() => setOpenQtyModal(false)}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      <Modal open={openApplicableQtyModal} onClose={() => setOpenApplicableQtyModal(false)}>
        <ModalDialog>
          <Typography>
            Select quantity for <span className="font-semibold">{selectedApplicableItem?.name}</span>
          </Typography>
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
            <Button variant="plain" color="danger" onClick={() => setOpenApplicableQtyModal(false)}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </div>
  );
}
