"use client";
import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import {
  fetchRoomData,
  fetchMeals,
  fetchCompanies,
  fetchBreakfast,
  fetchRoomDataQuarter,
  fetchMealsQuarter,
  fetchCompaniesQuarter,
  fetchBreakfastQuarter,
  fetchRoomDataYear,
  fetchMealsYear,
  fetchBreakfastYear,
  fetchCompaniesYear,
} from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import CircularProgress from "@mui/material/CircularProgress";
import {
  KeyboardArrowDown,
  MeetingRoomOutlined,
  RoomOutlined,
} from "@mui/icons-material";
import { Chip, Option } from "@mui/joy";
import { Select, MenuItem, FormControl } from "@mui/joy";

import MonthCard from "./MonthCard";

Chart.register(CategoryScale);

function Analytics() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [bookings, setBookings] = useState(0.0);
  const [prevBookings, setPrevBookings] = useState(0.0);
  const [breakfast, setBreakfast] = useState(0.0);
  const [prevBreakfast, setPrevBreakfast] = useState(0.0);
  const [meal, setMeal] = useState(0.0);
  const [prevMeal, setPrevMeal] = useState(0.0);
  const [time, setTime] = useState("Month");
  const [roomData, setRoomData] = useState([]);
  const [mealData, setMealData] = useState([]);
  const [breakfastData, setBreakfastData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [cardLoading, setCardLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState<
    "quarter" | "year" | "month" | null
  >("month");

  // const handleChange = (event: SelectChangeEvent) => {
  //   setTime(event.target.value as string);
  // };

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

  async function handleSelectChange() {}

  const fetchGraph = async () => {
    try {
      setLoading(true);
      const currentDate = new Date();
      const currentMonth = (currentDate.getMonth() + 1).toString();
      const currentYear = currentDate.getFullYear().toString();
      const currentQuarter = Math.ceil(parseInt(currentMonth) / 3).toString();

      let room;
      let meal;
      let company;
      let breakfast;

      if (selectedOption === "month") {
        room = await fetchRoomData(token, currentMonth, currentYear);
        meal = await fetchMeals(token, currentMonth, currentYear);
        company = await fetchCompanies(token, currentMonth, currentYear);
        breakfast = await fetchBreakfast(token, currentMonth, currentYear);
      }
      if (selectedOption === "quarter") {
        room = await fetchRoomDataQuarter(token, currentQuarter, currentYear);
        meal = await fetchMealsQuarter(token, currentQuarter, currentYear);
        company = await fetchCompaniesQuarter(
          token,
          currentQuarter,
          currentYear
        );
        breakfast = await fetchBreakfastQuarter(
          token,
          currentQuarter,
          currentYear
        );
      }
      if (selectedOption === "year") {
        room = await fetchRoomDataYear(token, currentYear);
        meal = await fetchMealsYear(token, currentYear);
        company = await fetchCompaniesYear(token, currentYear);
        breakfast = await fetchBreakfastYear(token, currentYear);
      }

      const transformedRoom = room.map(
        (entry: { booking_date: string; rooms_booked: string }) => ({
          date: entry.booking_date.slice(8, 10),
          data: entry.rooms_booked,
        })
      );
      const transformedMeal = meal.map(
        (entry: { booking_date: string; average_meals_per_day: string }) => ({
          date: entry.booking_date.slice(8, 10),
          data: entry.average_meals_per_day,
        })
      );

      const transformedBreakfast = breakfast.map(
        (entry: {
          booking_date: string;
          average_breakfasts_per_day: string;
        }) => ({
          date: entry.booking_date.slice(8, 10),
          data: entry.average_breakfasts_per_day,
        })
      );

      setRoomData(transformedRoom);
      setMealData(transformedMeal);
      setBreakfastData(transformedBreakfast);
      setCompanyData(company);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchGraph();
    }
  }, [token, selectedOption]);

  const fetchUpDown = async () => {
    setCardLoading(true)
    const currentDate = new Date();
    const prevMonth = currentDate.getMonth().toString();
    const currentYear = currentDate.getFullYear().toString();
    const prevYear = (currentDate.getFullYear() - 1).toString();
    const prevQuarter = Math.ceil(parseInt(prevMonth) / 3 - 1).toString();

    let room;
    let meal;
    let breakfast;

    if (selectedOption === "month") {
      room = await fetchRoomData(token, prevMonth, currentYear);
      meal = await fetchMeals(token, prevMonth, currentYear);
      breakfast = await fetchBreakfast(token, prevMonth, currentYear);
    }
    if (selectedOption === "quarter") {
      room = await fetchRoomDataQuarter(token, prevQuarter, currentYear);
      meal = await fetchMealsQuarter(token, prevQuarter, currentYear);
      breakfast = await fetchBreakfastQuarter(token, prevQuarter, currentYear);
    }
    if (selectedOption === "year") {
      room = await fetchRoomDataYear(token, prevYear);
      meal = await fetchMealsYear(token, prevYear);
      breakfast = await fetchBreakfastYear(token, prevYear);
    }

    console.log("meals: ", meal);

    let prevTotal: number = 0;
    let numberOfdays: number = 0;

    room.map((entry: { booking_date: string; rooms_booked: string }) => {
      prevTotal = prevTotal + Number(entry.rooms_booked);
      numberOfdays++;
    });

    const prevAvg = Number((prevTotal / numberOfdays).toFixed(2));

    setPrevBookings(prevAvg);
    let currentTotal = 0;
    numberOfdays = 0;

    roomData.map((entry: { date: string; data: string }) => {
      currentTotal = currentTotal + Number(entry.data);
      numberOfdays++;
    });

    const Avg = Number((currentTotal / numberOfdays).toFixed(2));
    setBookings(Avg);

    let prevMeal: number = 0;

    meal?.map(
      (entry: { booking_date: string; average_meals_per_day: string }) => {
        prevMeal = prevMeal + Number(entry.average_meals_per_day);
        numberOfdays++;
      }
    );

    const avgMeal = Number((prevMeal / numberOfdays).toFixed(2));
    setPrevMeal(avgMeal);

    let currentMeal = 0;
    numberOfdays = 0;

    mealData.map((entry: { date: string; data: string }) => {
      currentMeal = currentMeal + Number(entry.data);
      numberOfdays++;
    });

    const avgCurrentMeal = Number((currentMeal / numberOfdays).toFixed(2));
    setMeal(avgCurrentMeal);

    let prevBreakfast: number = 0;

    console.log("prev breakfast: ", breakfast);

    breakfast?.map(
      (entry: { booking_date: string; average_breakfasts_per_day: string }) => {
        prevBreakfast =
          prevBreakfast + Number(entry.average_breakfasts_per_day);
        numberOfdays++;
      }
    );

    const avgBreakfast = Number((prevBreakfast / numberOfdays).toFixed(2));
    setPrevBreakfast(avgBreakfast);

    let currentBreakfast = 0;
    numberOfdays = 0;

    breakfastData.map((entry: { date: string; data: string }) => {
      currentBreakfast = currentBreakfast + Number(entry.data);
      numberOfdays++;
    });

    const avgCurrentBreakfast = Number(
      (currentBreakfast / numberOfdays).toFixed(2)
    );
    setBreakfast(avgCurrentBreakfast);
    setCardLoading(false)

  };

  useEffect(() => {
    if (token) {
      fetchUpDown();
    }
  }, [token, roomData]);

  return (
    <div className="p-5 ">
      <div className="text-4xl mx-5 px-5 flex justify-between items-center  font-semibold">
        <div>Analytics</div>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Select
            indicator={<KeyboardArrowDown />}
            value={selectedOption}
            onChange={(e, newValue) => {
              setSelectedOption(newValue);
              handleSelectChange();
            }}
            aria-label="Without label"
            size="sm"
          >
            <Option className="font-medium" value="month">
              Month
            </Option>
            <Option className="font-medium" value="quarter">
              Quarter
            </Option>
            <Option className="font-medium" value="year">
              Year
            </Option>
          </Select>
        </FormControl>
      </div>
      {loading ? (
        <div className="flex w-full h-screen justify-center items-center ">
          <CircularProgress />
        </div>
      ) : (
        <div className=" m-5 rounded-xl p-5">
          <div className="flex justify-end"></div>
          <div className="flex gap-5">
            {/* <div className=" w-1/2 shadow-md flex justify-around p-3 rounded-xl border">
              <div className="flex items-center p-3 ">
                <div className="bg-black p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="50"
                    width="50"
                    viewBox="0 0 640 512"
                  >
                    <path
                      fill="#ffffff"
                      d="M32 32c17.7 0 32 14.3 32 32V320H288V160c0-17.7 14.3-32 32-32H544c53 0 96 43 96 96V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V416H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zm144 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"
                    />
                  </svg>
                </div>
                <div className="ml-5">
                  <div className="text-xl mb-3">Bookings</div>
                  <div className="flex">
                    <div className="text-lg mr-3">{bookings}</div>
                    <div className="text-lg">
                      {bookings > prevBookings && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          className="relative top-1.5"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill="#3fff3f"
                            fillRule="evenodd"
                            d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z"
                          />
                        </svg>
                      )}
                      {bookings < prevBookings && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="relative top-1.5 rotate-180"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill="#ff0000"
                            fillRule="evenodd"
                            d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>Previous Month: {prevBookings}</div>
                </div>
              </div>
              <div className="flex items-center p-3">
                <div className="bg-black p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="50"
                    width="50"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#ffffff"
                      d="M0 192c0-35.3 28.7-64 64-64c.5 0 1.1 0 1.6 0C73 91.5 105.3 64 144 64c15 0 29 4.1 40.9 11.2C198.2 49.6 225.1 32 256 32s57.8 17.6 71.1 43.2C339 68.1 353 64 368 64c38.7 0 71 27.5 78.4 64c.5 0 1.1 0 1.6 0c35.3 0 64 28.7 64 64c0 11.7-3.1 22.6-8.6 32H8.6C3.1 214.6 0 203.7 0 192zm0 91.4C0 268.3 12.3 256 27.4 256H484.6c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1L403.5 452c-2 16-15.6 28-31.8 28H140.2c-16.1 0-29.8-12-31.8-28l-1.8-14.4C44.4 414.1 0 353.9 0 283.4z"
                    />
                  </svg>
                </div>
                <div className="ml-5">
                  <div className="text-xl mb-3">Meals</div>
                  <div className="flex">
                    <div className="text-lg mr-3">{meal}</div>
                    <div className="text-lg">
                      {meal > prevMeal && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          className="relative top-1.5"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill="#3fff3f"
                            fillRule="evenodd"
                            d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z"
                          />
                        </svg>
                      )}
                      {meal < prevMeal && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="relative top-1.5 rotate-180"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill="#ff0000"
                            fillRule="evenodd"
                            d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>Previous Month: {prevMeal}</div>
                </div>
              </div>
            </div> */}
            <div className="w-full flex max-md:flex-col   gap-3">
              <MonthCard
                title="Bookings"
                thisMonth={bookings}
                icon="ROOM"
                loading={cardLoading}
                cardType={selectedOption}
                prevMonth={prevBookings}
              />
              <MonthCard
                title="Meals"
                thisMonth={meal}
                icon="MEAL"
                loading={cardLoading}
                cardType={selectedOption}
                prevMonth={prevMeal}
              />
              <MonthCard
                title="Breakfast"
                thisMonth={breakfast}
                icon="BREAKFAST"
                loading={cardLoading}
                cardType={selectedOption}
                prevMonth={prevBreakfast}
              />
            </div>
            {/* <div className="w-1/2 p-3 shadow-md  rounded-xl border text-xl text-center">
              {"Today's Activities"}
              <div className="flex justify-between text-lg">
                <div className="flex items-center flex-col">
                  <div className="py-[10px] px-[8px] my-2 bg-[#4ca6e6] rounded-full text-white">
                    {bookings}
                  </div>
                  <div className="text-center">Rooms Booked</div>
                </div>
                <div className="flex items-center flex-col">
                  <div className="py-[10px] px-[8px] my-2 bg-[#4ca6e6] rounded-full text-white">
                    {bookings}
                  </div>
                  <div className="text-center">Rooms Available</div>
                </div>
                <div className="flex items-center flex-col">
                  <div className="py-[10px] px-[8px] my-2 bg-[#4ca6e6] rounded-full text-white">
                    {bookings}
                  </div>
                  <div className="text-center">Meals Served</div>
                </div>
              </div>
            </div> */}
          </div>
          <div className="flex max-md:flex-col  justify-between gap-5 mt-5">
            <div className="w-1/2 max-md:w-full flex-col   flex items-center  ">
              <div className="p-3 shadow-md w-full  border rounded-xl">
                <LineChart
                  graphType={selectedOption}
                  theme="blue"
                  chartData={mealData}
                  title="Meals Served Per Day"
                />
              </div>
              <div className=" w-full h-full  mt-5 shadow-md border flex justify-center   rounded-xl">
                <PieChart
                  chartData={companyData}
                  title="Company Wise Booking Per Day"
                />
              </div>
            </div>
            <div className="w-1/2 max-md:w-full">
              <div className="mb-5 p-3 shadow-md  border rounded-xl">
                <LineChart
                  graphType={selectedOption}
                  theme="cyan"
                  chartData={roomData}
                  title="Rooms Booked Per Day"
                />
              </div>
              <div className=" p-3 w-full shadow-md  border rounded-xl">
                <LineChart
                  graphType={selectedOption}
                  theme="red"
                  chartData={breakfastData}
                  title="Breakfast Served Per Day"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
