"use client";
import React, { useEffect, useState } from "react";
import { Button, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Check, CheckCircle } from "@mui/icons-material";
import veg from "@/app/assets/veg.svg";
import nonveg from "@/app/assets/nonveg.svg";
import Image from "next/image";
import { getAuthAdmin } from "@/app/actions/cookie";
import { fetchAllOrders } from "@/app/actions/api";

function Orders() {
  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = ["Preparing", "Ready", "Delivered"];
  const [token, setToken] = useState("");
  const initialCount = 10;
  const [counter, setCounter] = useState(initialCount);

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

  useEffect(()=>{
    if (token !== "") {
      fetchAllOrders(token).then((orders) => {
        console.log("orders: ", orders)
      }).catch((error)=>{
        console.log("error fetching orders: ", error)
      })
    }
  },[token])

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prevCounter) => (prevCounter > 0 ? prevCounter - 0.01 : 0));
    }, 10);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds) % 60;
    return `${minutes}.${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="my-10 mx-10">
      <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab} className="">
        <TabList className="flex  gap-x-5">
          {tabs.map((tab, index) => (
            <Tab className="border outline-none data-[selected]:text-[#ef4f5f]  px-4 font-medium cursor-pointer flex gap-x-2 shadow-md py-2 w-fit text-[#b9b9b9]  rounded-xl">
              <div> {tab} </div>
              <div className={`${selectedTab === index ? "border-[#ff7e8b]" : "border-[#c2c2c2]"} border  px-1 rounded-md`}>
                2
              </div>
            </Tab>
          ))}
        </TabList>
        <TabPanels className="my-5">
          <TabPanel className="space-y-3">
            <div className="w-full max-md:flex-col text-[#636363] flex shadow-md px-6  py-8 font-medium rounded-3xl">
              <div className="w-2/5 max-md:w-full  pr-3 md:border-r border-dashed ">
                <div className="space-y-2 border-b  pb-5 ">
                  <div className="text-green-600 bg-green-[#fdfffe] text-2xl border w-fit px-2 py-1 rounded-lg">604</div>
                  <div className=" text-lg text-[#636363]">ORDER NO: 3433 </div>
                  <div className="text-[#7c7c7c] my-2 font-semibold"> Yash's Order</div>
                </div>
                <div className="">
                  <div className="text-[#7a7a7a] my-2 items-center gap-x-2 flex text-sm ">
                    <div>
                      <CheckCircle className="scale-[80%] z-10 text-green-600" />
                    </div>
                    <div> Delivered </div>
                  </div>
                  <div className="w-[2px] ml-[10px] h-3 bg-green-600 -z-10 scale-y-[300%]"></div>
                  <div className="text-[#7a7a7a] my-2 items-center gap-x-2 flex text-sm ">
                    <div>
                      <CheckCircle className="scale-[80%] z-10 text-green-600" />
                    </div>
                    <div> Prepared </div>
                  </div>
                </div>
              </div>
              <div className="w-3/5 md:mx-6 max-md:w-full ">
                <div className="">
                  <div className="flex justify-between items-center w-full">
                    <div className=" md:px-6 py-2 flex gap-x-3">
                      <Image width={16} height={16} alt="veg" src={veg.src} /> <div> 1 x Paneer Kabaab </div>
                    </div>
                    <div className="">₹400</div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div className=" md:px-6 py-2 flex gap-x-3">
                      <Image width={16} height={16} alt="veg" src={nonveg.src} /> <div> 1 x Chicken Tikka Kabaab </div>
                    </div>
                    <div className="">₹450</div>
                  </div>
                </div>
                <div className="my-4 py-4 md:pl-6  border-t flex w-full justify-between">
                  <div>Total Bill:</div> <div> ₹850</div>
                </div>
                <div className="md:ml-6 overflow-hidden h-[56px] my-2 font-medium relative">
                  <div className="absolute left-0 bg-[#538cee] rounded-2xl h-[56px] w-full"></div>
                  <div className="absolute z-10 left-0 text-white w-full py-4 text-center">
                    Order Ready {"("}
                    {formatTime(counter)}
                    {")"}
                  </div>
                  <div className="w-full overflow-clip absolute rounded-2xl">
                    <div
                      className={`bg-[#256fef] py-4 rounded-2xl text-white h-[56px]  `}
                      style={{ width: `${(counter / initialCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-md:flex-col text-[#636363] flex shadow-md px-6  py-8 font-medium rounded-3xl">
              <div className="w-2/5 max-md:w-full  pr-3 md:border-r border-dashed ">
                <div className="space-y-2 border-b  pb-5 ">
                  <div className="text-green-600 bg-green-[#fdfffe] text-2xl border w-fit px-2 py-1 rounded-lg">604</div>
                  <div className=" text-lg text-[#636363]">ORDER NO: 3433 </div>
                  <div className="text-[#7c7c7c] my-2 font-semibold"> Yash's Order</div>
                </div>
                <div className="">
                  <div className="text-[#7a7a7a] my-2 items-center gap-x-2 flex text-sm ">
                    <div>
                      <CheckCircle className="scale-[80%] z-10 text-green-600" />
                    </div>
                    <div> Delivered </div>
                  </div>
                  <div className="w-[2px] ml-[10px] h-3 bg-green-600 -z-10 scale-y-[300%]"></div>
                  <div className="text-[#7a7a7a] my-2 items-center gap-x-2 flex text-sm ">
                    <div>
                      <CheckCircle className="scale-[80%] z-10 text-green-600" />
                    </div>
                    <div> Prepared </div>
                  </div>
                </div>
              </div>
              <div className="w-3/5 md:mx-6 max-md:w-full ">
                <div className="">
                  <div className="flex justify-between items-center w-full">
                    <div className=" md:px-6 py-2 flex gap-x-3">
                      <Image width={16} height={16} alt="veg" src={veg.src} /> <div> 1 x Paneer Kabaab </div>
                    </div>
                    <div className="">₹400</div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div className=" md:px-6 py-2 flex gap-x-3">
                      <Image width={16} height={16} alt="veg" src={nonveg.src} /> <div> 1 x Chicken Tikka Kabaab </div>
                    </div>
                    <div className="">₹450</div>
                  </div>
                </div>
                <div className="my-4 py-4 md:pl-6  border-t flex w-full justify-between">
                  <div>Total Bill:</div> <div> ₹850</div>
                </div>
                <div className="md:ml-6 overflow-hidden h-[56px] my-2 font-medium relative">
                  <div className="absolute left-0 bg-[#538cee] rounded-2xl h-[56px] w-full"></div>
                  <div className="absolute z-10 left-0 text-white w-full py-4 text-center">
                    Order Ready {"("}
                    {formatTime(counter)}
                    {")"}
                  </div>
                  <div className="w-full overflow-clip absolute rounded-2xl">
                    <div
                      className={`bg-[#256fef] py-4 rounded-2xl text-white h-[56px]  `}
                      style={{ width: `${(counter / initialCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-md:flex-col text-[#636363] flex shadow-md px-6  py-8 font-medium rounded-3xl">
              <div className="w-2/5 max-md:w-full  pr-3 md:border-r border-dashed ">
                <div className="space-y-2 border-b  pb-5 ">
                  <div className="text-green-600 bg-green-[#fdfffe] text-2xl border w-fit px-2 py-1 rounded-lg">604</div>
                  <div className=" text-lg text-[#636363]">ORDER NO: 3433 </div>
                  <div className="text-[#7c7c7c] my-2 font-semibold"> Yash's Order</div>
                </div>
                <div className="">
                  <div className="text-[#7a7a7a] my-2 items-center gap-x-2 flex text-sm ">
                    <div>
                      <CheckCircle className="scale-[80%] z-10 text-green-600" />
                    </div>
                    <div> Delivered </div>
                  </div>
                  <div className="w-[2px] ml-[10px] h-3 bg-green-600 -z-10 scale-y-[300%]"></div>
                  <div className="text-[#7a7a7a] my-2 items-center gap-x-2 flex text-sm ">
                    <div>
                      <CheckCircle className="scale-[80%] z-10 text-green-600" />
                    </div>
                    <div> Prepared </div>
                  </div>
                </div>
              </div>
              <div className="w-3/5 md:mx-6 max-md:w-full ">
                <div className="">
                  <div className="flex justify-between items-center w-full">
                    <div className=" md:px-6 py-2 flex gap-x-3">
                      <Image width={16} height={16} alt="veg" src={veg.src} /> <div> 1 x Paneer Kabaab </div>
                    </div>
                    <div className="">₹400</div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div className=" md:px-6 py-2 flex gap-x-3">
                      <Image width={16} height={16} alt="veg" src={nonveg.src} /> <div> 1 x Chicken Tikka Kabaab </div>
                    </div>
                    <div className="">₹450</div>
                  </div>
                </div>
                <div className="my-4 py-4 md:pl-6  border-t flex w-full justify-between">
                  <div>Total Bill:</div> <div> ₹850</div>
                </div>
                <div className="md:ml-6 overflow-hidden h-[56px] my-2 font-medium relative">
                  <div className="absolute left-0 bg-[#538cee] rounded-2xl h-[56px] w-full"></div>
                  <div className="absolute z-10 left-0 text-white w-full py-4 text-center">
                    Order Ready {"("}
                    {formatTime(counter)}
                    {")"}
                  </div>
                  <div className="w-full overflow-clip absolute rounded-2xl">
                    <div
                      className={`bg-[#256fef] py-4 rounded-2xl text-white h-[56px]  `}
                      style={{ width: `${(counter / initialCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-md:flex-col text-[#636363] flex shadow-md px-6  py-8 font-medium rounded-3xl">
              <div className="w-2/5 max-md:w-full  pr-3 md:border-r border-dashed ">
                <div className="space-y-2 border-b  pb-5 ">
                  <div className="text-green-600 bg-green-[#fdfffe] text-2xl border w-fit px-2 py-1 rounded-lg">604</div>
                  <div className=" text-lg text-[#636363]">ORDER NO: 3433 </div>
                  <div className="text-[#7c7c7c] my-2 font-semibold"> Yash's Order</div>
                </div>
                <div className="">
                  <div className="text-[#7a7a7a] my-2 items-center gap-x-2 flex text-sm ">
                    <div>
                      <CheckCircle className="scale-[80%] z-10 text-green-600" />
                    </div>
                    <div> Delivered </div>
                  </div>
                  <div className="w-[2px] ml-[10px] h-3 bg-green-600 -z-10 scale-y-[300%]"></div>
                  <div className="text-[#7a7a7a] my-2 items-center gap-x-2 flex text-sm ">
                    <div>
                      <CheckCircle className="scale-[80%] z-10 text-green-600" />
                    </div>
                    <div> Prepared </div>
                  </div>
                </div>
              </div>
              <div className="w-3/5 md:mx-6 max-md:w-full ">
                <div className="">
                  <div className="flex justify-between items-center w-full">
                    <div className=" md:px-6 py-2 flex gap-x-3">
                      <Image width={16} height={16} alt="veg" src={veg.src} /> <div> 1 x Paneer Kabaab </div>
                    </div>
                    <div className="">₹400</div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div className=" md:px-6 py-2 flex gap-x-3">
                      <Image width={16} height={16} alt="veg" src={nonveg.src} /> <div> 1 x Chicken Tikka Kabaab </div>
                    </div>
                    <div className="">₹450</div>
                  </div>
                </div>
                <div className="my-4 py-4 md:pl-6  border-t flex w-full justify-between">
                  <div>Total Bill:</div> <div> ₹850</div>
                </div>
                <div className="md:ml-6 overflow-hidden h-[56px] my-2 font-medium relative">
                  <div className="absolute left-0 bg-[#538cee] rounded-2xl h-[56px] w-full"></div>
                  <div className="absolute z-10 left-0 text-white w-full py-4 text-center">
                    Order Ready {"("}
                    {formatTime(counter)}
                    {")"}
                  </div>
                  <div className="w-full overflow-clip absolute rounded-2xl">
                    <div
                      className={`bg-[#256fef] py-4 rounded-2xl text-white h-[56px]  `}
                      style={{ width: `${(counter / initialCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel>Ready</TabPanel>
          <TabPanel>Delivered</TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}

export default Orders;
