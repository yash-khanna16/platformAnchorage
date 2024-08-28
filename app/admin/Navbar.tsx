"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Close, Info, Logout, WarningRounded } from "@mui/icons-material";
import Drawer from "@mui/joy/Drawer";
import {
  addNewBooking,
  addPersonIcon,
  analyticsIcon,
  cabIcon,
  calenderIcon,
  mailIcon,
  searchIcon,
  addMovementIcon,
  table,
  mealIcon,
  tableIcon,
  auditLogs,
  foodIcon,
  manageItems,
} from "../../assets/icons";
import { deleteAuthAdmin, getAuthAdmin } from "../actions/cookie";
import { parseJwt } from "../actions/utils";
import logo from "../assets/anchorage_logo1.png";
import { OrderType } from "./(navbar)/orders/page";
import {
  Badge,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Snackbar,
} from "@mui/joy";
import Image from "next/image";
import veg from "@/app/assets/veg.svg";
import nonveg from "@/app/assets/nonveg.svg";
import { deleteOrder, fetchAllOrders, updateDelay, updateOrderStatus } from "../actions/api";
import { getSocket } from "@/app/actions/websocket";

function Navbar() {
  const [search, setSearch] = useState("");
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(false);
  const [newOrder, setNewOrder] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [del, setDel] = useState(false);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");
  const [ordersQueue, setOrdersQueue] = useState<OrderType[]>([]);
  const [currentOrder, setCurrentOrder] = useState<OrderType | null>(null);
  const [currentExpiredOrder, setCurrentExpiredOrder] = useState<OrderType | null>(null);
  const [expiredOrdersQueue, setExpiredOrdersQueue] = useState<OrderType[]>([]);
  const [expiredOrder, setExpiredOrder] = useState(false);
  const [delay, setDelay] = useState(0);
  const [delayModal, setDelayModal] = useState(false);

  const router = useRouter();
  const params = usePathname();
  const socket = getSocket();

  const path = (params as string).split("/")[2];

  async function handleLogout() {
    await deleteAuthAdmin();
    router.push("/");
  }

  useEffect(() => {
    const getSocket = async () => {
      if (socket) {
        await socket.on("order_received", (orders: OrderType[]) => {
          let activeOrders: OrderType[] = [];
          const currentTime = Date.now();
          orders.forEach((order) => {
            order.total_time_to_prepare = Math.max(...order.items.map((item) => item.time_to_prepare));
            const expiryTime = Number(order.created_at) + order.total_time_to_prepare * 60 * 1000;
            if (expiryTime > currentTime) {
              activeOrders.push(order);
            }
          });
          if (activeOrders.length > 0) {
            setOrdersQueue((prevQueue) => [...prevQueue, activeOrders[0]]);
          }
        });
      }
    };
    getSocket();
  }, [socket]);

  useEffect(() => {
    if (!currentOrder && ordersQueue.length > 0) {
      const nextOrder = ordersQueue[0];
      setCurrentOrder(nextOrder);
      setOrdersQueue((prevQueue) => prevQueue.slice(1));
      setNewOrder(true);
    }
  }, [ordersQueue, currentOrder]);

  useEffect(() => {
    if (!currentExpiredOrder && expiredOrdersQueue.length > 0) {
      const nextOrder = expiredOrdersQueue[0];
      setCurrentExpiredOrder(nextOrder);
      setExpiredOrdersQueue((prevQueue) => prevQueue.slice(1));
      setExpiredOrder(true);
    }
  }, [expiredOrdersQueue, currentExpiredOrder]);

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

  useEffect(() => {
    const getAdmin = async () => {
      const payload = await parseJwt(token);
      if (payload.role === "superadmin") {
        setAdmin(true);
      }
    };
    if (token) {
      getAdmin();
    }
  }, [token]);

  useEffect(() => {
    if (token !== "") {
      fetchOrders();
    }
  }, [token]);

  function fetchOrders() {
    setLoading(true);
    fetchAllOrders(token)
      .then((orders: OrderType[]) => {
        let activeOrders: OrderType[] = [];
        let expiredOrdersQueue: OrderType[] = [];
        const currentTime = Date.now();

        orders.map((order) => {
          order.delay = Number(order.delay);
          const maxTimeToPrepare = Math.max(...order.items.map((item) => item.time_to_prepare));
          order.total_time_to_prepare = maxTimeToPrepare + order.delay;
          const expiryTime = Number(order.created_at) + order.total_time_to_prepare * 60 * 1000;
          if (expiryTime > currentTime && order.status !== "Delivered") {
            activeOrders.push(order);
            if (order.status === "Placed" && !ordersQueue.some((o) => o.order_id === order.order_id)) {
              setOrdersQueue((prevQueue) => [...prevQueue, order]);
            }
          }
          if (expiryTime <= currentTime && order.status === "Accepted") {
            expiredOrdersQueue.push(order);
          }
        });
        setOrders(activeOrders);
        setExpiredOrdersQueue((prevQueue) => {
          const updatedQueue = [...prevQueue, ...expiredOrdersQueue.filter((order) => !prevQueue.includes(order))];
          return updatedQueue;
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error fetching orders: ", error);
      });
  }

  useEffect(() => {
    const timeInterval = setInterval(() => {
      let tempOrder = orders;
      let activeOrders: OrderType[] = [];
      let expiredOrdersQueue: OrderType[] = [];
      const currentTime = Date.now();

      tempOrder.map((order) => {
        order.delay = Number(order.delay);
        const maxTimeToPrepare = Math.max(...order.items.map((item) => item.time_to_prepare));
        order.total_time_to_prepare = maxTimeToPrepare + order.delay;
        const expiryTime = Number(order.created_at) + order.total_time_to_prepare * 60 * 1000;
        if (expiryTime > currentTime && order.status !== "Delivered") {
          activeOrders.push(order);
        }
        if (expiryTime <= currentTime && order.status === "Accepted") {
          expiredOrdersQueue.push(order);
        }
      });
      setOrders(activeOrders);
      setExpiredOrdersQueue((prevQueue) => {
        const updatedQueue = [...prevQueue, ...expiredOrdersQueue.filter((order) => !prevQueue.includes(order))];
        return updatedQueue;
      });
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [orders]);

  const options = [
    { icon: searchIcon, route: "search-guests", value: "Search Reservations" },
    { icon: addNewBooking, route: "add-booking", value: "Add Booking" },
    { icon: calenderIcon, route: "manage-rooms", value: "Manage Rooms" },
    { icon: mealIcon, route: "manage-meals", value: "Manage Meals" },
    { icon: addMovementIcon, route: "add-movement", value: "Add Movement" },
    { icon: table, route: "manage-movement", value: "Manage Movement" },
    { icon: cabIcon, route: "movement-info", value: "Movement Info" },
    { icon: analyticsIcon, route: "analytics", value: "Analytics" },
    { icon: tableIcon, route: "master-table", value: "Master Table" },
    { icon: addPersonIcon, route: "add-guest", value: "Add Guest" },
    { icon: foodIcon, route: "orders", value: "Orders" },
    { icon: manageItems, route: "manage-items", value: "Manage Items" },
    { icon: mailIcon, route: "emails", value: "Emails" },
    { icon: searchIcon, route: "check-logs", value: "Check Logs" },
    { icon: auditLogs, route: "audit-logs", value: "Audit Logs" },
  ];
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (inOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setOpen(inOpen);
  };

  const handleRejectOrder = async () => {
    try {
      if (currentOrder) {
        setLoadingDelete(true);
        const res = await deleteOrder(token, currentOrder?.order_id, reason, true);
        setLoadingDelete(false);
        setDel(false);
        setNewOrder(false);
        setCurrentOrder(null);
        fetchOrders();
        setAlert(true);
        setMessage("Order rejected");
      }
    } catch (error) {
      setAlert(true);
      setMessage("Something went wrong!");
    }
  };

  return (
    <div className="fixed bg-white z-50 flex flex-col items-center space-y-5 top-0 left-0 h-screen w-80 max-xl:w-60 border px-10 py-5 max-lg:px-3 max-xl:px-3 max-lg:h-20 max-lg:w-screen max-lg:flex-row max-lg:py-3 max-lg:space-y-1 max-lg:justify-between">
      <div className="flex items-center font-medium text-xl max-lg:w-full">
        <img src={logo.src} alt="logo" style={{ height: "40px" }} />
        <span className="ml-3 max-lg:text-lg">Anchorage Admin</span>
      </div>
      <div className="text-sm space-y-2 w-full px-2 max-lg:hidden">
        {options.map((option, index) => {
          if (option.value === "Analytics" && !admin) {
            return null;
          }
          return (
            <div
              key={index}
              onClick={() => {
                router.push(`/admin/${option.route}`);
              }}
              className={`flex space-x-3 font-medium rounded-xl ${
                option.route === path ? "bg-[#E8EDF5]" : ""
              } cursor-pointer items-center px-3  py-2 max-lg:hidden`}
            >
              {option.icon}
              <div className="flex space-x-3  items-center">
                <div>{option.value}</div>{" "}
                {option.value === "Orders" && orders.length > 0 && (
                  <div className="bg-blue-600 text-white px-2 rounded-full">{orders.length}</div>
                )}
              </div>
            </div>
          );
        })}
        <div
          onClick={handleLogout}
          className="flex space-x-3 font-medium rounded-xl text-red-600 cursor-pointer items-center px-3 py-2 max-lg:hidden"
        >
          <Logout />
          <div>Logout</div>
        </div>
      </div>
      <div className="hidden max-lg:flex w-10 items-center justify-center">
        <button className="relative -top-1 right-2 w-10 h-10" onClick={toggleDrawer(true)} aria-label="Menu">
          <div
            className={`absolute top-1/2 left-1/2 w-8 h-1 bg-black transition-transform duration-300 ease-in-out ${
              open ? "rotate-45" : "-translate-y-2"
            } transform origin-center`}
          ></div>
          <div
            className={`absolute top-1/2 left-1/2 w-8 h-1 bg-black transition-opacity duration-300 ease-in-out ${
              open ? "opacity-0" : ""
            }`}
          ></div>
          <div
            className={`absolute top-1/2 left-1/2 w-8 h-1 bg-black transition-transform duration-300 ease-in-out ${
              open ? "-rotate-45" : "translate-y-2"
            } transform origin-center`}
          ></div>
        </button>
      </div>
      <Drawer size="md" variant="outlined" open={open} onClose={toggleDrawer(false)}>
        <div className="p-2">
          <div className="flex items-center my-3 font-medium text-xl max-lg:flex max-lg:items-center">
            <img src={logo.src} alt="logo" style={{ height: "40px" }} />
            <span className="ml-3">Anchorage Admin</span>
          </div>
          <div className="text-sm space-y-3 mt-10">
            {options.map((option, index) => {
              if (option.value === "Analytics" && !admin) {
                return null;
              }
              return (
                <div
                  key={index}
                  onClick={() => {
                    router.push(`/admin/${option.route}`);
                    setOpen(false);
                  }}
                  className={`flex space-x-3 font-medium rounded-xl ${
                    option.route === path ? "bg-[#E8EDF5]" : ""
                  } cursor-pointer items-center px-3 py-2 `}
                >
                  {option.icon}
                  <div>{option.value}</div>
                </div>
              );
            })}
            <div
              onClick={handleLogout}
              className="flex space-x-3 font-medium rounded-xl text-red-600 cursor-pointer items-center px-3 py-2 "
            >
              <Logout />
              <div>Logout</div>
            </div>
          </div>
        </div>
      </Drawer>
      {/* Order Expired Modal */}
      <Modal
        open={expiredOrder}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            setNewOrder(false);
          }
        }}
      >
        <ModalDialog size="lg" sx={{ width: 650 }}>
          <DialogTitle>
            <div className="">
              <div>Order Expired</div>
              <div className="text-lg text-slate-500">
                This order has passed its preparation time. How would you like to proceed?
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="p-2 px-6 border rounded-md text-[#7a7a7a]">
              <div className="w-full items-center my-2 font-medium justify-between text-md  flex">
                <div className="flex items-center gap-x-2">
                  <div>Order No: {currentExpiredOrder?.order_id}</div>
                  <div className="text-green-600 bg-green-[#fdfffe]  border w-fit px-2 py-1 rounded-xl">
                    {currentExpiredOrder?.room}
                  </div>
                </div>
                <div>Order by {currentExpiredOrder?.guest_name}</div>
              </div>
              <div className="w-full text-[#636363]  border-t border-b py-2 my-2">
                {currentExpiredOrder?.items.map((item, index: number) => (
                  <div key={index} className="flex justify-between items-center w-full">
                    <div className="p-2 flex gap-x-3">
                      <Image width={16} height={16} alt="veg" src={item.type === "veg" ? veg.src : nonveg.src} />
                      <div>
                        {item.qty} x {item.name}
                      </div>
                    </div>
                    <div>₹{item.price * item.qty}</div>
                  </div>
                ))}
              </div>
              <div className="my-4 pl-2 text-[#636363] flex w-full justify-between">
                <div>Total Bill:</div>
                <div>₹{currentExpiredOrder?.items.reduce((total, item) => total + item.price * item.qty, 0)}</div>
              </div>
            </div>
            <DialogActions className="flex  space-x-3">
              <Button
                onClick={async () => {
                  if (currentExpiredOrder) {
                    try {
                      await updateOrderStatus(token, currentExpiredOrder?.order_id, "Delivered");
                      setCurrentExpiredOrder(null);
                      setExpiredOrder(false);
                      setAlert(true);
                      setMessage("Order Status updated successfully!");
                      if (expiredOrdersQueue.length === 0) {
                        if (params === "/admin/orders") window.location.reload();
                        else router.push("/admin/orders");
                      }
                    } catch (error) {
                      console.log("error updating order status: ", error);
                      setAlert(true);
                      setMessage("Something went wrong!");
                    }
                  }
                }}
                variant="solid"
                size="lg"
                color="success"
              >
                Set as Delivered
              </Button>
              <Button
                onClick={() => {
                  // delay order logic
                  setExpiredOrder(false);
                  setDelayModal(true)
                }}
                size="lg"
                variant="outlined"
                color="danger"
              >
                Delay
              </Button>
            </DialogActions>
          </DialogContent>
        </ModalDialog>
      </Modal>
      <Modal
        open={newOrder}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            setNewOrder(false);
          }
        }}
      >
        <ModalDialog size="lg" sx={{ width: 650 }}>
          <DialogTitle>1 New Order</DialogTitle>
          <DialogContent>
            <div className="p-2 px-6 border rounded-md text-[#7a7a7a]">
              <div className="w-full items-center my-2 font-medium justify-between text-md  flex">
                <div className="flex items-center gap-x-2">
                  <div>Order No: {currentOrder?.order_id}</div>
                  <div className="text-green-600 bg-green-[#fdfffe]  border w-fit px-2 py-1 rounded-xl">{currentOrder?.room}</div>
                </div>
                <div>Order by {currentOrder?.guest_name}</div>
              </div>
              <div className="w-full text-[#636363]  border-t border-b py-2 my-2">
                {currentOrder?.items.map((item, index: number) => (
                  <div key={index} className="flex justify-between items-center w-full">
                    <div className="p-2 flex gap-x-3">
                      <Image width={16} height={16} alt="veg" src={item.type === "veg" ? veg.src : nonveg.src} />
                      <div>
                        {item.qty} x {item.name}
                      </div>
                    </div>
                    <div>₹{item.price * item.qty}</div>
                  </div>
                ))}
              </div>
              <div className="my-4 pl-2 text-[#636363] flex w-full justify-between">
                <div>Total Bill:</div>
                <div>₹{currentOrder?.items.reduce((total, item) => total + item.price * item.qty, 0)}</div>
              </div>
            </div>
            <DialogActions className="flex  space-x-3">
              <Button
                onClick={async () => {
                  if (currentOrder) {
                    await updateOrderStatus(token, currentOrder?.order_id, "Accepted");
                    setNewOrder(false);
                    setCurrentOrder(null);
                    setNewOrder(false);
                    if (ordersQueue.length === 0) {
                      if (params === "/admin/orders") window.location.reload();
                      else router.push("/admin/orders");
                    }
                  }
                }}
                variant="solid"
                size="lg"
                color="success"
              >
                Accept
              </Button>
              <Button
                onClick={() => {
                  setDel(true);
                  setNewOrder(false);
                }}
                size="lg"
                variant="plain"
                color="danger"
              >
                Reject
              </Button>
            </DialogActions>
          </DialogContent>
        </ModalDialog>
      </Modal>
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
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await handleRejectOrder();
            }}
          >
            <div>Are you sure you want to reject this order?</div>
            <Input
              required
              className="my-5"
              placeholder="Reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
              }}
            />
            <div className="flex gap-x-3 justify-end ml-5">
              <Button
                variant="plain"
                color="neutral"
                onClick={() => {
                  setDel(false);
                  setNewOrder(true);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="solid" color="danger" loading={loadingDelete}>
                Confirm
              </Button>
            </div>
          </form>
        </ModalDialog>
      </Modal>
      <Modal
        open={delayModal}
        onClose={() => {
          setDelayModal(false);
        }}
      >
        <ModalDialog variant="outlined" size="md">
          <DialogTitle>
            <WarningRounded />
            Set Delay
          </DialogTitle>
          <Divider />
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                if (currentExpiredOrder) {
                  await updateDelay(token, currentExpiredOrder?.order_id, Number(delay).toString());
                  setAlert(true);
                  setMessage(`Order delayed for ${delay} mins`);
                  setDelay(0);
                  setDelayModal(false);
                  setExpiredOrder(false);
                  setCurrentExpiredOrder(null)
                  if (expiredOrdersQueue.length === 0) {
                    if (params === "/admin/orders") window.location.reload();
                    else router.push("/admin/orders");
                  }
                }
              } catch (error) {
                console.log("Error updating delay ", error);
                setAlert(true);
                setMessage("Something went wrong!");
              }
            }}
          >
            <div>Enter the time to delay (in mins)</div>
            <Input
              required
              className="my-5"
              placeholder="Delay (in mins)"
              value={delay}
              type="number"
              slotProps={{
                input: {
                  min: 0,
                  step: 1,
                  onKeyDown: (e) => {
                    if (e.key === "-" || e.key === "." || e.key === "e") {
                      e.preventDefault();
                    }
                  },
                },
              }}
              onChange={(e) => {
                setDelay(Number(e.target.value));
              }}
            />
            <div className="flex gap-x-3 justify-end ml-5">
              <Button
                variant="plain"
                color="neutral"
                onClick={() => {
                  setDelayModal(false);
                  setExpiredOrder(true)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="solid" color="danger" loading={loadingDelete}>
                Confirm
              </Button>
            </div>
          </form>
        </ModalDialog>
      </Modal>
      <Snackbar
        open={alert}
        autoHideDuration={5000}
        onClose={() => {
          setAlert(false);
        }}
      >
        <div className="flex justify-between w-full">
          <div>
            <Info />
            {message}
          </div>
          <div onClick={() => setAlert(false)} className="cursor-pointer hover:bg-[#f3eded]">
            <Close />
          </div>
        </div>
      </Snackbar>
    </div>
  );
}

export default Navbar;
