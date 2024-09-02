"use client";
import { deleteItem, fetchAllItems, putItem, updateItem } from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Autocomplete,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalDialog,
  Option,
  Select,
  Snackbar,
  Stack,
  Switch,
  Textarea,
} from "@mui/joy";
import { useEffect, useState } from "react";
import veg from "@/app/assets/veg.svg";
import nonveg from "@/app/assets/nonveg.svg";
import Image from "next/image";
import { Add, CleaningServices, Close, DeleteForever, Edit, Info, WarningRounded } from "@mui/icons-material";

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

type ItemsByCategory = Record<string, MenuItem[]>;

function Items() {
  const [items, setItems] = useState<ItemsByCategory>({});
  const [token, setToken] = useState("");
  const [addItem, setAddItem] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>(["veg", "nonveg"]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [del, setDel] = useState(false);
  const [delId, setDelId] = useState("");
  const [newItem, setNewItem] = useState<MenuItem>({
    available: true,
    category: "",
    description: "",
    item_id: "",
    name: "",
    price: 0,
    time_to_prepare: 0,
    type: "",
    base_price: 0,
  });

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []); 

  useEffect(() => {
    if (token !== "") {
      fetchAllItems(token)
        .then((items: MenuItem[]) => {
          const itemsByCategory = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
            if (!acc[item.category]) {
              acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
          }, {});

          setItems(itemsByCategory);
          setCategories(Object.keys(itemsByCategory));
        })
        .catch((error) => {
          console.log("error fetching all items: ", error);
        });
    }
  }, [token]);

  const handleAvailabilityChange = (category: string, index: number) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newItems = { ...items };
    newItems[category][index].available = event.target.checked;
    try {
      setLoading(true);
      const res = await updateItem(token, newItems[category][index]);
      const items: MenuItem[] = await fetchAllItems(token);
      const itemsByCategory = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});
      setItems(itemsByCategory);
      setCategories(Object.keys(itemsByCategory));
      setLoading(false);
      setAlert(true);
      setMessage("Availability updated successfully");
    } catch (error) {
      console.log("Error updating availability item ", error);
      setLoading(false);
      setAlert(true);
      setMessage("Something Went Wrong!");
    }
    // setItems(newItems);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, value?: string) => {
    const { name, value: targetValue } = e.target as HTMLInputElement;
    const fieldName = name as keyof MenuItem; // Ensure name is a valid key of MenuItem

    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      for (const category in updatedItems) {
        const itemIndex = updatedItems[category].findIndex((item) => item.item_id === editId);
        if (itemIndex !== -1) {
          // Use a type-safe utility function to update the item
          updatedItems[category][itemIndex] = {
            ...updatedItems[category][itemIndex],
            [fieldName]: castValueToFieldType(fieldName, targetValue, value),
          };
        }
      }
      return updatedItems;
    });
  };

  // Utility function to handle type-safe assignment
  function castValueToFieldType<T extends keyof MenuItem>(key: T, value: string, altValue?: string): MenuItem[T] {
    if (key === "price" || key === "time_to_prepare") {
      return Number(value) as MenuItem[T]; // Convert to number
    } else if (key === "type" || key === "category") {
      return (altValue || value) as MenuItem[T]; // Use alternative value if provided
    } else {
      return value as MenuItem[T]; // Default case, assume string
    }
  }

  function getItem(itemId: string): MenuItem | null {
    for (const category in items) {
      const item = items[category].find((item) => item.item_id === itemId);
      if (item) {
        return item;
      }
    }
    return null; // Return null if no item with the given item_id is found
  }

  return (
    <div className="m-10 max-xl:mx-5">
      <div className=" font-semibold text-slate-800 text-3xl">Menu Listing</div>
      <div className="text-[#636363] w-full my-5 ">
        <div className="w-full gap-x-3 flex justify-end">
          <Button
            onClick={() => {
              setAddItem(true);
            }}
            className=""
            variant="outlined"
            color="neutral"
            startDecorator={<Add />}
          >
            Add Item
          </Button>
          {/* <Button className="" variant="solid" color="primary">
                        Apply Changes
                    </Button> */}
        </div>
        {/* <AccordionGroup disableDivider transition="0.2s ease"> */}
        {Object.keys(items).map((key, index:number) => (
          <div key={index} className="my-5 border p-4 rounded-2xl shadow-md">
            <div>
              <div className="text-2xl px-4 text-black font-medium my-3 capitalize"> {key}</div>
            </div>
            <div className="w-full overflow-scroll " style={{scrollbarWidth:"none"}}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="font-bold border-b">
                  <th className="w-[20%] px-4 py-2 text-left">Item Name</th>
                  <th className="w-[10%] px-4 py-2 text-left">Price</th>
                  <th className="w-[10%] px-4 py-2 text-left">Base Price</th>
                  <th className="w-[10%] px-4 py-2 text-left">Time to Prepare</th>
                  <th className="w-[10%] px-4 py-2 text-center">Type</th>
                  <th className="w-[48%] min-w-40 px-4 py-2 text-left">Description</th>
                  <th className="w-[12%] px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items[key].map((item, index) => (
                  <tr key={item.item_id} className="border-b">
                    <td className="w-[20%] px-4 py-2 font-medium">{item.name}</td>
                    <td className="w-[10%] px-4 py-2">₹{item.price}</td>
                    <td className="w-[10%] px-4 py-2">₹{item.base_price}</td>
                    <td className="w-[10%] px-4 py-2">{item.time_to_prepare} mins</td>
                    <td className="w-[10%] px-4 py-2 ">
                      <Image
                        className="mx-auto"
                        width={18}
                        height={18}
                        alt={item.type}
                        src={item.type === "veg" ? veg.src : nonveg.src}
                      />
                    </td>
                    <td className="w-[48%] min-w-40 px-4 py-2">{item.description}</td>
                    <td className="w-[12%] px-4 py-2 ">
                      <div className="flex justify-around gap-x-3">
                        <Switch size="sm" checked={item.available} onChange={handleAvailabilityChange(key, index)} />
                        <IconButton
                          onClick={() => {
                            setEdit(true);
                            setEditId(item.item_id);
                          }}
                        >
                          <Edit className="text-slate-500" fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setDel(true);
                            setDelId(item.item_id);
                          }}
                        >
                          <DeleteForever className="text-red-700" fontSize="small" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        ))}
        {/* </AccordionGroup> */}
      </div>
      <div className=""></div>
      <Modal open={addItem} onClose={() => setAddItem(false)}>
        <ModalDialog size="lg" sx={{ width: 800, padding: 3 }}>
          <DialogTitle>
            <span className="text-2xl">Add New Item</span>
          </DialogTitle>
          <DialogContent>
            <span className="text-lg">Enter details of the new item.</span>{" "}
          <form
            className=""
            onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              // console.log("submit: ", newItem);
              try {
                setLoading(true);
                const res = await putItem(token, newItem);
                const items: MenuItem[] = await fetchAllItems(token);
                const itemsByCategory = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
                  if (!acc[item.category]) {
                    acc[item.category] = [];
                  }
                  acc[item.category].push(item);
                  return acc;
                }, {});
                setItems(itemsByCategory);
                setCategories(Object.keys(itemsByCategory));
                setLoading(false);
                setAlert(true);
                setAddItem(false);
                setMessage("Item inserted successfully");
              } catch (error) {
                console.log("Error inserting item ", error);
                setLoading(false);
                setAlert(true);
                setMessage("Something Went Wrong!");
              }
            }}
          >
            <Stack spacing={2}>
              <div className="gap-3 grid grid-cols-2 max-sm:grid-cols-1 ">
                <FormControl size="lg">
                  <FormLabel>Item Name</FormLabel>
                  <Input
                    value={newItem.name}
                    onChange={(e) => {
                      setNewItem({ ...newItem, name: e.target.value });
                    }}
                    placeholder="Paneer Butter Masala"
                    autoFocus
                    required
                  />
                </FormControl>
                <FormControl size="lg">
                  <FormLabel>Item Price</FormLabel>
                  <Input
                    value={newItem.price === 0 ? "" : newItem.price}
                    onChange={(e) => {
                      setNewItem({ ...newItem, price: Number(e.target.value) });
                    }}
                    type="number"
                    placeholder="250"
                    autoFocus
                    required
                  />
                </FormControl>
                <FormControl size="lg">
                  <FormLabel>Base Price</FormLabel>
                  <Input
                    value={newItem.base_price === 0 ? "" : newItem.base_price}
                    onChange={(e) => {
                      setNewItem({ ...newItem, base_price: Number(e.target.value) });
                    }}
                    type="number"
                    placeholder="200"
                    autoFocus
                    required
                  />
                </FormControl>
                <FormControl size="lg">
                  <FormLabel>Time to Prepare (in mins)</FormLabel>
                  <Input
                    value={newItem.time_to_prepare === 0 ? "" : newItem.time_to_prepare}
                    onChange={(e) => {
                      setNewItem({ ...newItem, time_to_prepare: Number(e.target.value) });
                    }}
                    type="25"
                    placeholder="Time To Prepare(in mins)"
                    autoFocus
                    required
                  />
                </FormControl>
                <FormControl size="lg">
                  <FormLabel>Type</FormLabel>
                  <Select
                    placeholder="veg"
                    required
                    value={newItem.type}
                    onChange={(event, value) => {
                      setNewItem({ ...newItem, type: value as string });
                    }}
                  >
                    {types.map((type) => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="lg">
                  <FormLabel>Category</FormLabel>
                  <Autocomplete
                    freeSolo
                    placeholder="lunch"
                    required
                    onInputChange={(e, value) => {
                      setNewItem({ ...newItem, category: value });
                    }}
                    onChange={(event, value) => {
                      if (value) {
                        setNewItem({ ...newItem, category: value });
                      }
                    }}
                    options={categories}
                  />
                </FormControl>
                <div className="sm:col-span-2">
                  <FormControl size="lg">
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      value={newItem.description}
                      onChange={(e) => {
                        setNewItem({ ...newItem, description: e.target.value });
                      }}
                      minRows={3}
                      placeholder="Paneer Butter Masala is a rich, creamy Indian dish featuring tender paneer cubes in a spiced tomato-based gravy, flavored with butter and aromatic spices"
                      autoFocus
                      required
                    />
                  </FormControl>
                </div>
              </div>
              <Button size="lg" loading={loading} type="submit">
                Add Item
              </Button>
            </Stack>
          </form>
          </DialogContent>
        </ModalDialog>
      </Modal>
      <Modal open={edit} onClose={() => setEdit(false)}>
        <ModalDialog size="lg" sx={{ width: 800, padding: 3 }}>
          <DialogTitle>
            <span className="text-2xl">Edit Item</span>
          </DialogTitle>
          <DialogContent>
            <span className="text-lg">Enter details of the item.</span>
          
          <form
            onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              try {
                if (getItem(editId)) {
                  setLoading(true);
                  const res = await updateItem(token, getItem(editId) as MenuItem);
                  const items: MenuItem[] = await fetchAllItems(token);
                  const itemsByCategory = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
                    if (!acc[item.category]) {
                      acc[item.category] = [];
                    }
                    acc[item.category].push(item);
                    return acc;
                  }, {});
                  setItems(itemsByCategory);
                  setCategories(Object.keys(itemsByCategory));
                  setLoading(false);
                  setAlert(true);
                  setEdit(false);
                  setMessage("Item updated successfully");
                }
              } catch (error) {
                console.log("Error updating item ", error);
                setLoading(false);
                setAlert(true);
                setMessage("Something Went Wrong!");
              }
            }}
          >
            <Stack spacing={2}>
              <div className="gap-3 grid grid-cols-2 max-sm:grid-cols-1">
                <FormControl size="lg">
                  <FormLabel>Item Name</FormLabel>
                  <Input
                    name="name"
                    value={getItem(editId)?.name}
                    onChange={handleEditChange}
                    placeholder="Item Name"
                    autoFocus
                    required
                  />
                </FormControl>

                <FormControl size="lg">
                  <FormLabel>Item Price</FormLabel>
                  <Input
                    name="price"
                    value={getItem(editId)?.price}
                    onChange={handleEditChange}
                    type="number"
                    placeholder="Price"
                    required
                  />
                </FormControl>

                <FormControl size="lg">
                  <FormLabel>Base Price</FormLabel>
                  <Input
                    name="base_price"
                    value={getItem(editId)?.base_price}
                    onChange={handleEditChange}
                    type="number"
                    placeholder="Base Price"
                    required
                  />
                </FormControl>

                <FormControl size="lg">
                  <FormLabel>Time to Prepare (in mins)</FormLabel>
                  <Input
                    name="time_to_prepare"
                    value={getItem(editId)?.time_to_prepare}
                    onChange={handleEditChange}
                    type="number"
                    placeholder="Time To Prepare (in mins)"
                    required
                  />
                </FormControl>

                <FormControl size="lg">
                  <FormLabel>Type</FormLabel>
                  <Select
                    name="type"
                    placeholder="Type"
                    value={getItem(editId)?.type || ""}
                    onChange={(event, value) => {
                      const name = "type";
                      setItems((prevItems) => {
                        const updatedItems = { ...prevItems };
                        for (const category in updatedItems) {
                          const itemIndex = updatedItems[category].findIndex((item) => item.item_id === editId);
                          if (itemIndex !== -1) {
                            updatedItems[category][itemIndex] = {
                              ...updatedItems[category][itemIndex],
                              [name]: value as string,
                            };
                          }
                        }
                        return updatedItems;
                      });
                    }}
                  >
                    {types.map((type) => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="lg">
                  <FormLabel>Category</FormLabel>
                  <Autocomplete
                    name="category"
                    freeSolo
                    placeholder="Category"
                    value={getItem(editId)?.category}
                    onInputChange={(_, value) =>
                      handleEditChange({ target: { name: "category" } } as React.ChangeEvent<HTMLInputElement>, value)
                    }
                    options={categories}
                  />
                </FormControl>

                <div className="sm:col-span-2">
                  <FormControl size="lg">
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      name="description"
                      value={getItem(editId)?.description}
                      onChange={handleEditChange}
                      minRows={3}
                      placeholder="Description"
                      autoFocus
                      required
                    />
                  </FormControl>
                </div>
              </div>
              <Button size="lg" loading={loading} type="submit">
                Edit Item
              </Button>
            </Stack>
          </form>
          </DialogContent>
        </ModalDialog>
      </Modal>

      <Snackbar
        open={alert}
        autoHideDuration={5000}
        // color="danger"
        onClose={() => {
          setAlert(false);
        }}
      >
        <div className="flex justify-between w-full">
          <div>
            <Info /> {message}
          </div>
          <div onClick={() => setAlert(false)} className="cursor-pointer hover:bg-[#f3eded]">
            <Close />
          </div>
        </div>
      </Snackbar>
      <Modal
        open={del}
        onClose={() => {
          setDel(false);
        }}
      >
        <ModalDialog variant="outlined" size="md">
          <DialogTitle>
            <WarningRounded />
            Confirmation
          </DialogTitle>
          <Divider />
          <div>Are you sure you want to delete this item?</div>
          <DialogActions>
            <Button
              variant="solid"
              color="danger"
              loading={loading}
              onClick={async () => {
                try {
                  setLoading(true);
                  await deleteItem(token, delId);
                  const items: MenuItem[] = await fetchAllItems(token);
                  const itemsByCategory = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
                    if (!acc[item.category]) {
                      acc[item.category] = [];
                    }
                    acc[item.category].push(item);
                    return acc;
                  }, {});
                  setItems(itemsByCategory);
                  setCategories(Object.keys(itemsByCategory));
                  setAlert(true);
                  setMessage("Item deleted successfully");
                  setLoading(false);
                  setDel(false);
                } catch (error) {
                  setLoading(false);
                  setDel(false);
                  setAlert(true);
                  setMessage("Something Went Wrong!");
                }
              }}
            >
              Confirm
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setDel(false)}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </div>
  );
}

export default Items;
