import { fetchAllItems } from "@/app/actions/api";
import { Cancel, Search, ShoppingCart } from "@mui/icons-material";
import { Checkbox, Input } from "@mui/joy";
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";

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
  category_id: string;
  sequence: number;
};

type SelectedItemsType = {
  item_id: string;
  qty: number;
};

interface AllItemsTableProps {
  bookingId: string;
  token: string;
  selectedItems: SelectedItemsType[];
  setSelectedItems: Dispatch<SetStateAction<SelectedItemsType[]>>;
  maxTime:number,
  setMaxTime:Dispatch<SetStateAction<number>>
}

function AllItemsTable({ bookingId, token, selectedItems, setSelectedItems,maxTime,setMaxTime }: AllItemsTableProps) {
  const [menuLoading, setMenuLoading] = useState<boolean>(false);
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result: MenuItem[] = await fetchAllItems(token, bookingId);
        const availableItems: MenuItem[] = result
          .filter((data: MenuItem) => data.available && data.category!=="complementary meals")
          .sort((a: MenuItem, b: MenuItem) => a.name.localeCompare(b.name));
        setAllItems(availableItems);
      } catch (error: any) {
        console.log(error);
      } finally {
        setMenuLoading(false);
      }
    };
    if (bookingId) {
      setMenuLoading(true);
      fetchItems();
    }
  }, [bookingId]);


  useEffect(() => {
    if (selectedItems.length === 0) {
      setMaxTime(0);
      return;
    }

    const highestTime = selectedItems.reduce((max, selected) => {
      const itemDetails = allItems.find((item) => item.item_id === selected.item_id);
      const prepTime = itemDetails ? itemDetails.time_to_prepare : 0;
      return prepTime > max ? prepTime : max;
    }, 0);

    setMaxTime(highestTime);
  }, [selectedItems, allItems, setMaxTime]);

  const filteredItems = allItems.filter(
    (item: MenuItem) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectedQuantity = (itemId: string, e: ChangeEvent<HTMLInputElement>) => {
    const qty = Number(e.target.value);
    if (qty > 0)
      setSelectedItems((prevData: SelectedItemsType[]) =>
        prevData.map((selectedItem: SelectedItemsType) =>
          selectedItem.item_id === itemId ? { item_id: itemId, qty: qty } : selectedItem
        )
      );
  };

  const removeItem = (itemId: string) => {
    setSelectedItems((prevData: SelectedItemsType[]) =>
      prevData.filter((data: SelectedItemsType) => data.item_id !== itemId)
    );
  };

  return (
    <div className="w-[98%] space-y-6 mx-auto">
      {/* Search Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <ShoppingCart fontSize="small" />
          Select Menu Items
        </h3>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fontSize="small"
          />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Available Items Grid */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-700">
            Available Items ({filteredItems.length})
          </p>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {!menuLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {filteredItems.length > 0 ? (
                filteredItems.map((item: MenuItem, index: number) => (
                  <div
                    key={item.item_id}
                    className={`px-4 py-3 hover:bg-blue-50 transition-colors ${index >= 2 ? "border-t border-gray-200" : ""
                      }`}
                  >
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Checkbox
                          checked={selectedItems.some(
                            (selectedItem: SelectedItemsType) =>
                              selectedItem.item_id === item.item_id
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems([
                                ...selectedItems,
                                { item_id: item.item_id, qty: 1 },
                              ])
                              ;
                            } else {
                              setSelectedItems(
                                selectedItems.filter((si) => si.item_id !== item.item_id)
                              );
                            }
                          }}
                          sx={{ flexShrink: 0 }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate group-hover:text-blue-700">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            ₹{item.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded capitalize ml-2 flex-shrink-0">
                        {item.category}
                      </span>
                    </label>
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-12 text-gray-400">
                  <Search fontSize="large" className="mb-2 opacity-50" />
                  <p>No items found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index: number) => (
                <div
                  key={index}
                  className={`px-4 py-4 animate-pulse ${index % 2 === 0 ? "md:border-r border-gray-200" : ""
                    } ${index >= 2 ? "border-t border-gray-200" : ""}`}
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2 mt-2"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Items Section */}
      {selectedItems.length > 0 && (
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              Order Summary
              <span className="text-sm font-normal text-gray-500">
                ({selectedItems.length} {selectedItems.length === 1 ? "item" : "items"})
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-1">
            {selectedItems.map((item: SelectedItemsType) => {
              const filtered = allItems.find((data: MenuItem) => data.item_id === item.item_id);
              if (!filtered) return null;

              return (
                <div
                  key={item.item_id}
                  className="relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <button
                    className="absolute -top-2 -right-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors p-1"
                    onClick={() => removeItem(item.item_id)}
                    type="button"
                  >
                    <Cancel fontSize="small" />
                  </button>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                        Item Name
                      </label>
                      <div className="mt-1 text-sm font-semibold text-gray-900">
                        {filtered.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        ₹{filtered.price.toFixed(2)} each
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1">
                        Quantity
                      </label>
                      <Input
                        type="number"
                        value={item.qty}
                        required
                        onChange={(e) => handleSelectedQuantity(item.item_id, e)}
                        slotProps={{
                          input: {
                            min: 1,
                            step: 1,
                          },
                        }}
                        sx={{
                          "--Input-focusedThickness": "2px",
                          fontSize: "0.95rem",
                        }}
                      />
                      <div className="text-xs text-gray-600 mt-1 font-medium">
                        Subtotal: ₹{(filtered.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span className="text-gray-700">Total Amount:</span>
              <span className="text-blue-600">
                ₹
                {selectedItems
                  .reduce((total, item) => {
                    const menuItem = allItems.find((m) => m.item_id === item.item_id);
                    return total + (menuItem ? menuItem.price * item.qty : 0);
                  }, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllItemsTable;
