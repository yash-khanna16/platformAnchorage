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
import { KeyboardArrowDown, MeetingRoomOutlined, RoomOutlined } from "@mui/icons-material";
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
  // const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"quarter" | "year" | "month" | null>("month");

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
      console.log("fetching data for: ", currentMonth, currentYear);

      let room;
      let meal;
      let company;
      let breakfast;

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      if (selectedOption === "month") {
        room = await fetchRoomData(token, currentMonth, currentYear);
        meal = await fetchMeals(token, currentMonth, currentYear);
        company = await fetchCompanies(token, currentMonth, currentYear);
        breakfast = await fetchBreakfast(token, currentMonth, currentYear);
        console.log("meals: ", meal);
        const transformedRoom = room.map((entry: { booking_date: string; rooms_booked: string }) => ({
          date: entry.booking_date.slice(8, 10),
          data: entry.rooms_booked,
        }));
        const transformedMeal = meal.map((entry: { booking_date: string; average_meals_per_day: string }) => ({
          date: entry.booking_date.slice(8, 10),
          data: entry.average_meals_per_day,
        }));

        const transformedBreakfast = breakfast.map((entry: { booking_date: string; average_breakfasts_per_day: string }) => ({
          date: entry.booking_date.slice(8, 10),
          data: entry.average_breakfasts_per_day,
        }));
        await fetchUpDown(transformedMeal, transformedRoom, transformedBreakfast)
        setRoomData(transformedRoom);
        setMealData(transformedMeal);
        setBreakfastData(transformedBreakfast);
      }
      if (selectedOption === "quarter") {
        room = await fetchRoomDataQuarter(token, currentQuarter, currentYear);
        meal = await fetchMealsQuarter(token, currentQuarter, currentYear);
        company = await fetchCompaniesQuarter(token, currentQuarter, currentYear);
        breakfast = await fetchBreakfastQuarter(token, currentQuarter, currentYear);
        const transformedRoom = room.map((entry: { booking_date: string; rooms_booked: string }) => {
          const date = new Date(entry.booking_date);
          return {
            date: monthNames[date.getMonth()],
            data: entry.rooms_booked,
          };
        });

        const transformedMeal = meal.map((entry: { booking_date: string; average_meals_per_day: string }) => {
          const date = new Date(entry.booking_date);
          return {
            date: monthNames[date.getMonth()],
            data: entry.average_meals_per_day,
          };
        });

        const transformedBreakfast = breakfast.map((entry: { booking_date: string; average_breakfasts_per_day: string }) => {
          const date = new Date(entry.booking_date);
          return {
            date: monthNames[date.getMonth()],
            data: entry.average_breakfasts_per_day,
          };
        });
        await fetchUpDown(transformedMeal, transformedRoom, transformedBreakfast)
        setRoomData(transformedRoom);
        setMealData(transformedMeal);
        setBreakfastData(transformedBreakfast);
      }
      if (selectedOption === "year") {
        room = await fetchRoomDataYear(token, currentYear);
        meal = await fetchMealsYear(token, currentYear);
        company = await fetchCompaniesYear(token, currentYear);
        breakfast = await fetchBreakfastYear(token, currentYear);
        const transformedRoom = room.map((entry: { booking_date: string; rooms_booked: string }) => {
          const date = new Date(entry.booking_date);
          return {
            date: monthNames[date.getMonth()],
            data: entry.rooms_booked,
          };
        });

        const transformedMeal = meal.map((entry: { booking_date: string; average_meals_per_day: string }) => {
          const date = new Date(entry.booking_date);
          return {
            date: monthNames[date.getMonth()],
            data: entry.average_meals_per_day,
          };
        });

        const transformedBreakfast = breakfast.map((entry: { booking_date: string; average_breakfasts_per_day: string }) => {
          const date = new Date(entry.booking_date);
          return {
            date: monthNames[date.getMonth()],
            data: entry.average_breakfasts_per_day,
          };
        });

        setRoomData(transformedRoom);
        setMealData(transformedMeal);
        setBreakfastData(transformedBreakfast);
        await fetchUpDown(transformedMeal, transformedRoom, transformedBreakfast)
      }

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

  const fetchUpDown = async (mealData: [], roomData: [], breakfastData: []) => {
    setLoading(true);
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

    meal?.map((entry: { booking_date: string; average_meals_per_day: string }) => {
      prevMeal = prevMeal + Number(entry.average_meals_per_day);
      numberOfdays++;
    });

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

    breakfast?.map((entry: { booking_date: string; average_breakfasts_per_day: string }) => {
      prevBreakfast = prevBreakfast + Number(entry.average_breakfasts_per_day);
      numberOfdays++;
    });

    const avgBreakfast = Number((prevBreakfast / numberOfdays).toFixed(2));
    setPrevBreakfast(avgBreakfast);

    let currentBreakfast = 0;
    numberOfdays = 0;

    breakfastData.map((entry: { date: string; data: string }) => {
      currentBreakfast = currentBreakfast + Number(entry.data);
      numberOfdays++;
    });

    const avgCurrentBreakfast = Number((currentBreakfast / numberOfdays).toFixed(2));
    setBreakfast(avgCurrentBreakfast);
    setLoading(false);
  };

  // useEffect(() => {
  //   if (token) {
  //     fetchUpDown();
  //   }
  // }, [token, roomData]);

  return (
    <div className="p-5 max-lg:p-1 ">
      <div className="text-4xl mx-5 px-5 flex justify-between items-center font-semibold max-lg:px-2 max-lg:mx-0">
        <div className={`${loading && "animate-pulse"}`}>Analytics</div>
        {loading && (
          <div className="w-32 h-8 bg-gray-200 animate-pulse rounded-md ">

          </div>
        )}
        {!loading && (
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
        )}
      </div>

      <div className=" m-5 rounded-xl p-5 max-lg:m-0 max-lg:p-2">
        <div className="flex justify-end"></div>
        <div className="flex gap-5">
          <div className="w-[100%] grid grid-cols-3 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1 max-md:w-8/12 max-sm:w-full max-md:mx-auto">
            <MonthCard
              title="Bookings"
              thisMonth={bookings}
              icon="ROOM"
              loading={loading}
              cardType={selectedOption}
              prevMonth={prevBookings}
            />
            <MonthCard
              title="Meals"
              thisMonth={meal}
              icon="MEAL"
              loading={loading}
              cardType={selectedOption}
              prevMonth={prevMeal}
            />
            <MonthCard
              title="Breakfast"
              thisMonth={breakfast}
              icon="BREAKFAST"
              loading={loading}
              cardType={selectedOption}
              prevMonth={prevBreakfast}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 mt-5 max-xl:grid-cols-1">
          {loading && (
            <div className="p-5 animate-pulse shadow-md w-full xl:h-[45vh] border flex flex-col gap-y-5 py-6 rounded-xl max-lg:p-0">
              <div className="w-36 h-5 rounded-2xl bg-gray-200"></div>
              <div className="w-full h-full bg-gray-200 rounded-md"></div>
            </div>
          )}
          {!loading && (
            <div className="p-5 shadow-md w-full xl:h-[45vh] border rounded-xl max-lg:p-0">
              <LineChart graphType={selectedOption} theme="blue" chartData={mealData} title="Meals Served Per Day" />
            </div>
          )}
          {loading && (
            <div className="p-5 animate-pulse shadow-md w-full xl:h-[45vh] border flex flex-col gap-y-5 py-6 rounded-xl max-lg:p-0">
              <div className="w-36 h-5 rounded-2xl bg-gray-200"></div>
              <div className="w-full h-full bg-gray-200 rounded-md"></div>
            </div>
          )}
          {!loading && (
            <div className="p-5 shadow-md w-full  xl:h-[45vh]  border rounded-xl max-lg:p-0">
              <PieChart chartData={companyData} title="Company Wise Booking Per Day" />
            </div>
          )}
          {loading && (
            <div className="p-5 animate-pulse shadow-md w-full xl:h-[45vh] border flex flex-col gap-y-5 py-6 rounded-xl max-lg:p-0">
              <div className="w-36 h-5 rounded-2xl bg-gray-200"></div>
              <div className="w-full h-full bg-gray-200 rounded-md"></div>
            </div>
          )}
          {!loading && (
            <div className="p-5 shadow-md w-full xl:h-[45vh]  border rounded-xl max-lg:p-0">
              <LineChart graphType={selectedOption} theme="cyan" chartData={roomData} title="Bookings Per Day" />
            </div>
          )}

          {loading && (
            <div className="p-5 animate-pulse shadow-md w-full xl:h-[45vh] border flex flex-col gap-y-5 py-6 rounded-xl max-lg:p-0">
              <div className="w-36 h-5 rounded-2xl bg-gray-200"></div>
              <div className="w-full h-full bg-gray-200 rounded-md"></div>
            </div>
          )}
          {!loading && (
            <div className="p-5 shadow-md w-full xl:h-[45vh]  border rounded-xl max-lg:p-0">
              <LineChart graphType={selectedOption} theme="red" chartData={breakfastData} title="Breakfast Served Per Day" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
