"use client";
import React, { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Cancel, Check, CheckCircle, Close, Info, Warning, WarningRounded } from "@mui/icons-material";
import veg from "@/app/assets/veg.svg";
import nonveg from "@/app/assets/nonveg.svg";
import Image from "next/image";
import { getAuthAdmin } from "@/app/actions/cookie";
import { deleteOrder, fetchAllOrders, updateDelay, updateOrderStatus } from "@/app/actions/api";
import { convertUTCToIST } from "@/app/actions/utils";
import { getSocket } from "@/app/actions/websocket";
import { Socket, io } from "socket.io-client";
import { DialogActions, IconButton, Modal } from "@mui/material";
import {
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  Input,
  ModalClose,
  ModalDialog,
  ButtonGroup,
  Sheet,
  Snackbar,
  Typography,
  Alert,
  Chip,
} from "@mui/joy";

export type ItemType = {
  item_id: string;
  name: string;
  description: string;
  price: number;
  qty: number;
  type: "veg" | "nonveg";
  category: string;
  available: boolean;
  time_to_prepare: number;
};

export type OrderType = {
  order_id: string;
  booking_id: string;
  room: string;
  remarks: string;
  created_at: number;
  total_time_to_prepare: number;
  delay: number;
  discount: number;
  status: string;
  guest_name: string;
  items: ItemType[];
};

function Orders() {
  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = ["Preparing", "Ready", "Delivered"];
  const [token, setToken] = useState("");
  const [orderData, setOrderData] = useState<OrderType[]>([]);
  const [deliveredData, setDeliveredData] = useState<OrderType[]>([]);
  const [timers, setTimers] = useState<{ [key: string]: number }>({});
  const [neworderData, setNewOrderData] = useState<OrderType>();
  const [newOrder, setNewOrder] = useState(false);
  const [del, setDel] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");
  const [delay, setDelay] = useState(0);
  const [delOrder, setDelOrder] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [delayModal, setDelayModal] = useState(false);
  const [delayId, setDelayId] = useState("");
  const [mealCount, setMealCount] = useState({
    BREAKFAST: { veg: 0, nonVeg: 0 },
    LUNCH: { veg: 0, nonVeg: 0 },
    DINNER: { veg: 0, nonVeg: 0 },
  });

  let dummy = [1, 1, 1, 1, 1, 1];

  const MEAL_IDS: Record<"BREAKFAST" | "LUNCH" | "DINNER", { veg: string; nonVeg: string }> = {
    BREAKFAST: {
      veg: process.env.NEXT_PUBLIC_BREAKFAST_VEG_ID || "",
      nonVeg: process.env.NEXT_PUBLIC_BREAKFAST_NON_VEG_ID || "",
    },
    LUNCH: {
      veg: process.env.NEXT_PUBLIC_LUNCH_VEG_ID || "",
      nonVeg: process.env.NEXT_PUBLIC_LUNCH_NON_VEG_ID || "",
    },
    DINNER: {
      veg: process.env.NEXT_PUBLIC_DINNER_VEG_ID || "",
      nonVeg: process.env.NEXT_PUBLIC_DINNER_NON_VEG_ID || "",
    },
  };

  const isMealOrder = (order: OrderType): Boolean => {
    return order.items.some((item) =>
      Object.values(MEAL_IDS).some(
        (meal) => meal.veg === item.item_id || meal.nonVeg === item.item_id || item.item_id === process.env.NEXT_PUBLIC_TEA_ID
      )
    );
  };

  const handleRejectOrder = async () => {
    try {
      if (neworderData) {
        setLoadingDelete(true);
        const res = await deleteOrder(token, neworderData?.order_id, reason, true);
        console.log("Current orderData:", orderData);
        convertAndSetOrderDetails(res.details);
        setLoadingDelete(false);
        setDel(false);
        setReason("");
        setNewOrder(false);
        setAlert(true);
        setMessage("Order rejected");
      }
    } catch (error) {
      setAlert(true);
      setMessage("Something went wrong!");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      setLoadingDelete(true);
      const res = await deleteOrder(token, orderId, reason, true);
      convertAndSetOrderDetails(res.details);
      setLoadingDelete(false);
      setDelOrder(false);
      setNewOrder(false);
      setReason("");
      setAlert(true);
      setMessage("Order deleted");
    } catch (error) {
      setAlert(true);
      setMessage("Something went wrong!");
    }
  };

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      setLoading(true);
      fetchAllOrders(token)
        .then((orders: OrderType[]) => {
          console.log("orders: ", orders);
          setLoading(false);
          convertAndSetOrderDetails(orders);
        })
        .catch((error) => {
          setLoading(false);
          console.log("error fetching orders: ", error);
        });
    }
  }, [token]);

  const convertAndSetOrderDetails = (orders: OrderType[]) => {
    const initialTimers: { [key: string]: number } = {};
    const deliveredOrders: OrderType[] = [];

    orders.forEach((order) => {
      order.delay = Number(order.delay);
      const maxTimeToPrepare = Math.max(...order.items.map((item) => item.time_to_prepare));
      order.total_time_to_prepare = maxTimeToPrepare + order.delay;
      const currentTime = new Date();
      const timeElapsed = (currentTime.getTime() - Number(order.created_at)) / 1000; // elapsed time in seconds
      let remainingTime = 0;
      if (timeElapsed > 0) {
        remainingTime = Math.max(order.total_time_to_prepare * 60 - timeElapsed, 0); // remaining time in seconds
      }
      if (remainingTime > 0) {
        initialTimers[order.order_id] = remainingTime;
      }

      if (remainingTime === 0 || order.status === "Delivered") {
        deliveredOrders.push(order);
      }
    });
    console.log(
      "all orders: ",
      orders.filter((order) => !deliveredOrders.includes(order))
    );
    setOrderData(orders.filter((order) => !deliveredOrders.includes(order)));
    setDeliveredData((prevDeliveredData) => [...prevDeliveredData, ...deliveredOrders]);
    setTimers(initialTimers);
  };

  useEffect(() => {
    const getMealCount = () => {
      const now = new Date(); // Current time
      const minutesUntilMidnight = (24 - now.getHours()) * 60 - now.getMinutes(); // Minutes left until midnight

      // Filter orders whose total_time_to_prepare is less than minutes until midnight
      const validOrders = orderData.filter((order: OrderType) => {
        return order.total_time_to_prepare <= minutesUntilMidnight;
      });

      const updatedMealCount = {
        BREAKFAST: { veg: 0, nonVeg: 0 },
        LUNCH: { veg: 0, nonVeg: 0 },
        DINNER: { veg: 0, nonVeg: 0 },
      };

      // Count meals for valid orders
      validOrders.forEach((order: OrderType) => {
        order.items.forEach((item: ItemType) => {
          Object.entries(MEAL_IDS).forEach(([mealType, mealData]) => {
            if (item.item_id === mealData.veg) {
              updatedMealCount[mealType as keyof typeof MEAL_IDS].veg++;
            }
            if (item.item_id === mealData.nonVeg) {
              updatedMealCount[mealType as keyof typeof MEAL_IDS].nonVeg++;
            }
          });
        });
      });

      setMealCount(updatedMealCount);
    };

    getMealCount();
  }, [orderData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimers((prevTimers) => {
        const newTimers = { ...prevTimers };
        const newDeliveredData: OrderType[] = [];
        Object.keys(newTimers).forEach((orderId) => {
          if (Math.floor(newTimers[orderId]) > 0) {
            newTimers[orderId] -= 1;
            newTimers[orderId] = Math.floor(newTimers[orderId]);
          } else {
            const deliveredOrder = orderData.find((order) => order.order_id === orderId);
            if (deliveredOrder) {
              newDeliveredData.push(deliveredOrder);
            }
          }
        });
        if (newDeliveredData.length > 0) {
          setOrderData((prevOrderData) =>
            prevOrderData.filter(
              (order) => !newDeliveredData.some((deliveredOrder) => deliveredOrder.order_id === order.order_id)
            )
          );
          setDeliveredData((prevDeliveredData) => [...prevDeliveredData, ...newDeliveredData]);
        }
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [orderData]);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / 86400); // 86400 seconds in a day
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds) % 60;

    const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const paddedSecs = secs < 10 ? `0${secs}` : `${secs}`;

    if (days > 0) {
      return `${days}d:${paddedHours}:${paddedMinutes}:${paddedSecs}`;
    } else if (hours > 0) {
      return `${paddedHours}:${paddedMinutes}:${paddedSecs}`;
    } else {
      return `${paddedMinutes}:${paddedSecs}`;
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(token, orderId, status);
      const tempTimers = timers;
      tempTimers[orderId] = 0;
      setTimers(tempTimers);
      setAlert(true);
      setMessage("Order Status updated successfully!");
    } catch (error) {
      setAlert(true);
      setMessage("Something went wrong!");
    }
  };

  return (
    <div className="my-10 mx-10">
      <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab} className="">
        <TabList className="flex gap-x-5">
          <Tab className="border outline-none data-[selected]:text-[#ef4f5f] px-4 font-medium cursor-pointer flex gap-x-2 shadow-md py-2 w-fit text-[#b9b9b9] rounded-xl">
            <div>Preparing</div>
            <div className={`${selectedTab === 0 ? "border-[#ff7e8b]" : "border-[#c2c2c2]"} border px-1 rounded-md`}>
              {orderData.length}
            </div>
          </Tab>
          <Tab className="border outline-none data-[selected]:text-[#ef4f5f] px-4 font-medium cursor-pointer flex gap-x-2 shadow-md py-2 w-fit text-[#b9b9b9] rounded-xl">
            <div>Delivered</div>
            <div className={`${selectedTab === 1 ? "border-[#ff7e8b]" : "border-[#c2c2c2]"} border px-1 rounded-md`}>
              {deliveredData.length}
            </div>
          </Tab>
        </TabList>
        <TabPanels className="my-5">
          <TabPanel className="space-y-3">
            {/* <div className="grid my-5 gap-3 [grid-template-columns:repeat(2,150px)] sm:[grid-template-columns:repeat(3,150px)] md:[grid-template-columns:repeat(4,150px)] lg:[grid-template-columns:repeat(6,150px)] justify-start"> */}
            <div className="sm:flex gap-3 sm:flex-wrap grid [grid-template-columns:repeat(2,150px)] sm:[grid-template-columns:repeat(3,150px)]">
              <div className="text-sm border border-green-300 px-2 h-fit  sm:min-w-fit font-medium py-1 rounded-2xl bg-green-50 text-green-800">
                Breakfast Veg: {mealCount.BREAKFAST.veg}
              </div>
              <div className="text-sm border border-red-300 px-2 h-fit  sm:min-w-fit font-medium py-1 rounded-2xl bg-red-50 text-red-800">
                Breakfast N.Veg: {mealCount.BREAKFAST.nonVeg}
              </div>
              <div className="text-sm border border-green-300 px-2 h-fit  sm:min-w-fit font-medium py-1 rounded-2xl bg-green-50 text-green-800">
                Lunch Veg: {mealCount.LUNCH.veg}
              </div>
              <div className="text-sm border border-red-300 px-2 h-fit  sm:min-w-fit font-medium py-1 rounded-2xl bg-red-50 text-red-800">
                Lunch N.Veg: {mealCount.LUNCH.nonVeg}
              </div>
              <div className="text-sm border border-green-300 px-2 h-fit  sm:min-w-fit font-medium py-1 rounded-2xl bg-green-50 text-green-800">
                Dinner Veg: {mealCount.DINNER.veg}
              </div>
              <div className="text-sm border border-red-300 px-2 h-fit  sm:min-w-fit font-medium py-1 rounded-2xl bg-red-50 text-red-800">
                Dinner N.Veg: {mealCount.DINNER.nonVeg}
              </div>
            </div>

            {/* <div className="flex gap-x-3">
              <div className="text-sm border px-2 font-medium py-1 rounded-2xl bg-green-50 text-green-800">Breakfast Veg: 6</div>
              <div className="text-sm border px-2 font-medium py-1 rounded-2xl bg-green-50 text-green-800">Lunch Veg: 6</div>
              <div className="text-sm border px-2 font-medium py-1 rounded-2xl bg-green-50 text-green-800">Dinner Veg: 6</div>
            </div>
            <div className="flex gap-x-3">
              <div className="text-sm border px-2 font-medium py-1 rounded-2xl bg-red-50 text-red-800">Breakfast N.Veg: 6</div>
              <div className="text-sm border px-2 font-medium py-1 rounded-2xl bg-red-50 text-red-800">Lunch N.Veg: 6</div>
              <div className="text-sm border px-2 font-medium py-1 rounded-2xl bg-red-50 text-red-800">Dinner N.Veg: 6</div>
            </div> */}
            {loading &&
              dummy.map((index) => {
                return (
                  <div
                    key={index}
                    className="animate-pulse min-h-[340px] border max-sm:flex-col max-sm:gap-5  text-[#636363] flex shadow-md px-6 py-8 font-medium rounded-3xl max-sm:px-3 max-sm:py-5 "
                  >
                    <div className="space-y-4 w-2/5 max-sm:w-full">
                      <div className="space-y-2">
                        <div className="h-10 w-16 bg-gray-200 rounded-2xl"></div>
                        <div className="h-8 w-28 bg-gray-200 rounded-2xl"></div>
                        <div className="h-6 w-28 bg-gray-200 rounded-2xl"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 bg-gray-200 rounded-2xl"></div>
                          <div className="h-6 my-4 w-28 bg-gray-200 rounded-2xl"></div>
                        </div>
                        <div className="h-8 my-4 w-48 bg-gray-200 rounded-2xl"></div>
                      </div>
                    </div>
                    <div className="w-3/5 mx-6 flex flex-col gap-y-3 max-sm:mx-auto max-sm:w-full">
                      <div className="flex justify-between w-full">
                        <div className="flex gap-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-2xl"></div>
                          <div className="w-36 h-8 bg-gray-200 rounded-2xl"></div>
                        </div>
                        <div className="w-16 h-8 bg-gray-200 rounded-2xl"></div>
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="flex gap-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-2xl"></div>
                          <div className="w-36 h-8 bg-gray-200 rounded-2xl"></div>
                        </div>
                        <div className="w-16 h-8 bg-gray-200 rounded-2xl"></div>
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="flex gap-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-2xl"></div>
                          <div className="w-36 h-8 bg-gray-200 rounded-2xl"></div>
                        </div>
                        <div className="w-16 h-8 bg-gray-200 rounded-2xl"></div>
                      </div>
                      <div className="flex my-5 justify-between w-full">
                        <div className="w-24 h-8 bg-gray-200 rounded-2xl"></div>
                        <div className="w-16 h-8 bg-gray-200 rounded-2xl"></div>
                      </div>
                      <div className="w-full h-14  bg-gray-200 rounded-2xl"></div>
                    </div>
                  </div>
                );
              })}
            <div className="flex max-lg:flex-col gap-x-6  w-full">
              <div className="space-y-6 w-full">
                {!loading &&
                  orderData.length > 0 &&
                  orderData.map(
                    (order, index) =>
                      !isMealOrder(order) && (
                        <div
                          key={index}
                          className="w-full border relative max-md:flex-col  text-[#636363] flex shadow-md px-6 py-8 font-medium rounded-3xl"
                        >
                          <IconButton
                            onClick={() => {
                              setDelOrder(true);
                              setDeleteId(order.order_id);
                            }}
                            className="absolute  -top-2 -right-3"
                          >
                            <Cancel className="text-red-700 text-lg" />
                          </IconButton>
                          <div className="w-2/5 max-md:w-full pr-3 md:border-r border-dashed">
                            <div className="space-y-2 border-b pb-5">
                              <div className="flex gap-x-3">
                                <div className="text-green-600 h-fit bg-green-[#fdfffe] text-2xl border w-fit px-2 py-1 rounded-lg">
                                  {order.room}
                                </div>
                                {order.delay > 0 && (
                                  <div>
                                    <Alert color="warning">
                                      <Warning className="text-yellow-600" />
                                      {isMealOrder(order) ? (
                                        <>
                                          Meal Scheduled for{" "}
                                          {new Date(
                                            Number(order.created_at) + order.total_time_to_prepare * 60000 + order.delay * 60000
                                          ).toDateString()}
                                        </>
                                      ) : (
                                        <>Order Delayed for {order.delay} mins</>
                                      )}
                                    </Alert>
                                  </div>
                                )}
                              </div>
                              <div className="text-lg text-[#636363]">ORDER NO: {order.order_id}</div>
                              <div className="text-[#7c7c7c] my-2 font-semibold">
                                {order.guest_name !== null && (
                                  <>
                                    {order.guest_name}
                                    {"'s"} Order
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="">
                              <div className="text-[#7a7a7a] my-2 items-center gap-x-2 flex text-sm">
                                <div>
                                  <CheckCircle className="scale-[80%] z-10 text-green-600" />
                                </div>
                                <div>Accepted</div>
                              </div>
                              <div className="my-5  border w-fit  text-[#7a7a7a] text-sm px-2 py-1 bg-slate-100 rounded-md ">
                                Instructions: {order.remarks}
                              </div>
                            </div>
                          </div>
                          <div className="w-3/5 md:mx-6 max-md:w-full">
                            <div className="">
                              {order.items.map((item) => (
                                <div key={item.item_id} className="flex justify-between items-center w-full">
                                  <div className="md:px-6 py-2 flex gap-x-3">
                                    <Image width={16} height={16} alt="veg" src={item.type === "veg" ? veg.src : nonveg.src} />
                                    <div>
                                      {item.qty} x {item.name}
                                    </div>
                                  </div>
                                  <div>₹{item.price * item.qty}</div>
                                </div>
                              ))}
                            </div>
                            <div className="my-4 py-4 md:pl-6 border-t flex w-full justify-between">
                              <div>Total Bill:</div>
                              <div>₹{order.items.reduce((total, item) => total + item.price * item.qty, 0)}</div>
                            </div>
                            <div className="flex items-center gap-x-2">
                              <div className="md:ml-6 overflow-hidden h-[56px] my-2 w-[100%] font-medium relative">
                                <div className="absolute left-0 bg-[#538cee] rounded-2xl h-[56px] w-full"></div>
                                <div className="absolute z-10 left-0 text-white w-full py-4 text-center">
                                  Order Ready ({formatTime(timers[order.order_id] || 0)})
                                </div>
                                <div className="w-full overflow-clip absolute rounded-2xl">
                                  <div
                                    className={`bg-[#256fef] py-4 rounded-2xl text-white h-[56px]`}
                                    style={{
                                      width: `${((timers[order.order_id] || 0) / (order.total_time_to_prepare * 60)) * 100}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-3 lg:ml-6 my-3">
                              <button
                                onClick={() => {
                                  handleUpdateOrderStatus(order.order_id, "Delivered");
                                }}
                                className="w-full py-3 border hover:bg-green-50 border-green-500 text-green-500 rounded-2xl"
                              >
                                Set as Delivered
                              </button>
                              <button
                                onClick={() => {
                                  setDelayModal(true);
                                  setDelayId(order.order_id);
                                  setDelay(order.delay);
                                }}
                                className="w-full py-3 border text-white hover:bg-red-600 border-red-500 bg-red-500 rounded-2xl"
                              >
                                Delay Order
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                  )}

                {!loading && orderData.filter((order) => !isMealOrder(order)).length === 0 && (
                  <div className="text-[#7c7c7c] w-full  my-5 font-medium text-xl text-center">No orders yet</div>
                )}
              </div>
              <div className="space-y-6 w-full">
                {!loading &&
                  orderData.length > 0 &&
                  orderData.map(
                    (order, index) =>
                      isMealOrder(order) && (
                        <div
                          key={index}
                          className="w-full border relative max-md:flex-col text-[#636363] flex shadow-md px-6 py-8 font-medium rounded-3xl"
                        >
                          <IconButton
                            onClick={() => {
                              setDelOrder(true);
                              setDeleteId(order.order_id);
                            }}
                            className="absolute  -top-2 -right-3"
                          >
                            <Cancel className="text-red-700 text-lg" />
                          </IconButton>
                          <div className="w-2/5 max-md:w-full pr-3 md:border-r border-dashed">
                            <div className="space-y-2 border-b pb-5">
                              <div className="flex gap-x-3">
                                <div className="text-green-600 h-fit bg-green-[#fdfffe] text-2xl border w-fit px-2 py-1 rounded-lg">
                                  {order.room}
                                </div>
                                {order.delay > 0 && (
                                  <div>
                                    <Alert color="warning">
                                      Meal Scheduled for{" "}
                                      {new Date(
                                        Number(order.created_at) + order.total_time_to_prepare * 60000 + order.delay * 60000
                                      ).toLocaleDateString()}{" "}
                                      {new Date(
                                        Number(order.created_at) + order.total_time_to_prepare * 60 * 1000
                                      ).toLocaleTimeString("en-US", {  hour: "2-digit", minute: "2-digit" })}
                                    </Alert>
                                  </div>
                                )}
                              </div>
                              <div className="text-lg text-[#636363]">ORDER NO: {order.order_id}</div>
                              <div className="text-[#7c7c7c] my-2 font-semibold">
                                {order.guest_name !== null && (
                                  <>
                                    {order.guest_name}
                                    {"'s"} Order
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="">
                              <div className="text-[#7a7a7a] my-2 items-center gap-x-2 flex text-sm">
                                <div>
                                  <CheckCircle className="scale-[80%] z-10 text-green-600" />
                                </div>
                                <div>Accepted</div>
                              </div>
                              <div className="my-5  border w-fit  text-[#7a7a7a] text-sm px-2 py-1 bg-slate-100 rounded-md ">
                                Instructions: {order.remarks}
                              </div>
                            </div>
                          </div>
                          <div className="w-3/5 md:mx-6 max-md:w-full">
                            <div className="">
                              {order.items.map((item) => (
                                <div key={item.item_id} className="flex justify-between items-center w-full">
                                  <div className="md:px-6 py-2 flex gap-x-3">
                                    <Image width={16} height={16} alt="veg" src={item.type === "veg" ? veg.src : nonveg.src} />
                                    <div>
                                      {item.qty} x {item.name}
                                    </div>
                                  </div>
                                  <div>₹{item.price * item.qty}</div>
                                </div>
                              ))}
                            </div>
                            <div className="my-4 py-4 md:pl-6 border-t flex w-full justify-between">
                              <div>Total Bill:</div>
                              <div>₹{order.items.reduce((total, item) => total + item.price * item.qty, 0)}</div>
                            </div>
                            <div className="flex items-center gap-x-2">
                              <div className="md:ml-6 overflow-hidden h-[56px] my-2 w-[100%] font-medium relative">
                                <div className="absolute left-0 bg-[#538cee] rounded-2xl h-[56px] w-full"></div>
                                <div className="absolute z-10 left-0 text-white w-full py-4 text-center">
                                  Order Ready ({formatTime(timers[order.order_id] || 0)})
                                </div>
                                <div className="w-full overflow-clip absolute rounded-2xl">
                                  <div
                                    className={`bg-[#256fef] py-4 rounded-2xl text-white h-[56px]`}
                                    style={{
                                      width: `${((timers[order.order_id] || 0) / (order.total_time_to_prepare * 60)) * 100}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-3 lg:ml-6 my-3">
                              <button
                                onClick={() => {
                                  handleUpdateOrderStatus(order.order_id, "Delivered");
                                }}
                                className="w-full py-3 border hover:bg-green-50 border-green-500 text-green-500 rounded-2xl"
                              >
                                Set as Delivered
                              </button>
                              <button
                                onClick={() => {
                                  setDelayModal(true);
                                  setDelayId(order.order_id);
                                  setDelay(order.delay);
                                }}
                                className="w-full py-3 border text-white hover:bg-red-600 border-red-500 bg-red-500 rounded-2xl"
                              >
                                Delay Order
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                  )}
                {!loading && orderData.filter((order) => isMealOrder(order)).length === 0 && (
                  <div className="text-[#7c7c7c] w-full  my-5 font-medium text-xl text-center">No orders yet</div>
                )}
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            {loading &&
              dummy.map((index) => {
                return (
                  <div
                    key={index}
                    className="animate-pulse h-[340px] border max-md:flex-col text-[#636363] flex shadow-md px-6 py-8 font-medium rounded-3xl "
                  >
                    <div className="space-y-4 w-2/5">
                      <div className="space-y-2">
                        <div className="h-10 w-16 bg-gray-200 rounded-2xl"></div>
                        <div className="h-8 w-28 bg-gray-200 rounded-2xl"></div>
                        <div className="h-6 w-28 bg-gray-200 rounded-2xl"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 bg-gray-200 rounded-2xl"></div>
                          <div className="h-6 my-4 w-28 bg-gray-200 rounded-2xl"></div>
                        </div>
                        <div className="h-8 my-4 w-48 bg-gray-200 rounded-2xl"></div>
                      </div>
                    </div>
                    <div className="w-3/5 mx-6 flex flex-col gap-y-3">
                      <div className="flex justify-between w-full">
                        <div className="flex gap-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-2xl"></div>
                          <div className="w-36 h-8 bg-gray-200 rounded-2xl"></div>
                        </div>
                        <div className="w-16 h-8 bg-gray-200 rounded-2xl"></div>
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="flex gap-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-2xl"></div>
                          <div className="w-36 h-8 bg-gray-200 rounded-2xl"></div>
                        </div>
                        <div className="w-16 h-8 bg-gray-200 rounded-2xl"></div>
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="flex gap-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-2xl"></div>
                          <div className="w-36 h-8 bg-gray-200 rounded-2xl"></div>
                        </div>
                        <div className="w-16 h-8 bg-gray-200 rounded-2xl"></div>
                      </div>
                      <div className="flex my-5 justify-between w-full">
                        <div className="w-24 h-8 bg-gray-200 rounded-2xl"></div>
                        <div className="w-16 h-8 bg-gray-200 rounded-2xl"></div>
                      </div>
                      <div className="w-full h-14  bg-gray-200 rounded-2xl"></div>
                    </div>
                  </div>
                );
              })}
            {!loading &&
              deliveredData.length > 0 &&
              deliveredData.map((order) => (
                <div
                  key={order.order_id}
                  className="w-full max-md:flex-col text-[#636363] grayscale-[90%] flex shadow-md px-6 py-8 font-medium rounded-3xl"
                >
                  <div className="w-2/5 max-md:w-full pr-3 md:border-r border-dashed">
                    <div className="space-y-2 border-b pb-5">
                      <div className="text-green-600 bg-green-[#fdfffe] text-2xl border w-fit px-2 py-1 rounded-lg">
                        {order.room}
                      </div>
                      <div className="text-lg text-[#636363]">ORDER NO: {order.order_id}</div>
                      <div className="text-[#7c7c7c] my-2 font-semibold">
                        {order.guest_name !== null && (
                          <>
                            {order.guest_name}
                            {"'s"} Order
                          </>
                        )}
                      </div>
                    </div>
                    <div className="">
                      <div className="text-[#7a7a7a] my-2 items-center gap-x-2 flex text-sm">
                        <div>
                          <CheckCircle className="scale-[80%] z-10 text-green-600" />
                        </div>
                        <div>Accepted</div>
                      </div>
                      <div className="my-5  border w-fit  text-[#7a7a7a] text-sm px-2 py-1 bg-slate-100 rounded-md ">
                        Instructions: {order.remarks}
                      </div>
                    </div>
                  </div>
                  <div className="w-3/5 md:mx-6 max-md:w-full">
                    <div className="">
                      {order.items.map((item) => (
                        <div key={item.item_id} className="flex justify-between items-center w-full">
                          <div className="md:px-6 py-2 flex gap-x-3">
                            <Image width={16} height={16} alt="veg" src={item.type === "veg" ? veg.src : nonveg.src} />
                            <div>
                              {item.qty} x {item.name}
                            </div>
                          </div>
                          <div>₹{item.price * item.qty}</div>
                        </div>
                      ))}
                    </div>
                    <div className="my-4 py-4 md:pl-6 border-t flex w-full justify-between">
                      <div>Total Bill:</div>
                      <div>₹{order.items.reduce((total, item) => total + item.price * item.qty, 0)}</div>
                    </div>
                    <div className="md:ml-6 overflow-hidden h-[56px] my-2 font-medium relative">
                      <div className="absolute z-10 left-0 text-white bg-[#538cee]  rounded-2xl w-full py-4 text-center">
                        Delivered
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {!loading && deliveredData.length === 0 && (
              <div className="text-[#7c7c7c] my-5 font-medium text-xl text-center">No orders yet</div>
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>

      <Modal open={newOrder} onClose={() => setNewOrder(false)}>
        <ModalDialog size="lg" sx={{ width: 650 }}>
          <ModalClose
            onClick={() => {
              setNewOrder(false);
            }}
          />
          <DialogTitle>1 New Order</DialogTitle>
          <DialogContent>
            <div className="p-2 px-6 border rounded-md text-[#7a7a7a]">
              <div className="w-full items-center my-2 font-medium justify-between text-md  flex">
                <div className="flex items-center gap-x-2">
                  <div>Order No: {neworderData?.order_id}</div>
                  <div className="text-green-600 bg-green-[#fdfffe]  border w-fit px-2 py-1 rounded-xl">{neworderData?.room}</div>
                </div>
                <div>Order by {neworderData?.guest_name}</div>
              </div>
              <div className="w-full text-[#636363]  border-t border-b py-2 my-2">
                {neworderData?.items.map((item, index) => (
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
                <div>₹{neworderData?.items.reduce((total, item) => total + item.price * item.qty, 0)}</div>
              </div>
            </div>
            <DialogActions className="space-x-3">
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
              <Button
                onClick={() => {
                  setNewOrder(false);
                }}
                variant="solid"
                size="lg"
                color="success"
              >
                Accept
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
        open={delOrder}
        onClose={() => {
          setDelOrder(false);
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
              await handleDeleteOrder(deleteId);
            }}
          >
            <div>Are you sure you want to delete Order No: {deleteId}</div>
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
                  setDelOrder(false);
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
                await updateDelay(token, delayId, Number(delay).toString());
                const orders = orderData;
                orders.map((order) => {
                  if (order.order_id === delayId) {
                    order.delay = delay;
                  }
                });
                convertAndSetOrderDetails(orders);
                setAlert(true);
                setMessage(`Order delayed for ${delay} mins`);
                setDelay(0);
                setDelayModal(false);
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
        // color="danger"
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

export default Orders;
