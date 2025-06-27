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
  fetchProfitData,
  fetchProfitDataQuarter,
  fetchProfitDataYear,
} from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import CircularProgress from "@mui/material/CircularProgress";
import { KeyboardArrowDown, MeetingRoomOutlined, RoomOutlined } from "@mui/icons-material";
import { Chip, Option } from "@mui/joy";
import { Select, MenuItem, FormControl } from "@mui/joy";

import MonthCard from "./MonthCard";

Chart.register(CategoryScale);

type GraphData = {
  date: string;
  data: string;
};

function Analytics() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [bookings, setBookings] = useState(0.0);
  const [prevBookings, setPrevBookings] = useState(0.0);
  const [breakfast, setBreakfast] = useState(0.0);
  const [prevBreakfast, setPrevBreakfast] = useState(0.0);
  const [profit, setProfit] = useState(0.0);
  const [prevProfit, setPrevProfit] = useState(0.0);
  const [prevTotalProfit, setPrevTotalProfit] = useState(0);
  const [meal, setMeal] = useState(0.0);
  const [prevMeal, setPrevMeal] = useState(0.0);
  const [roomData, setRoomData] = useState<GraphData[]>([]);
  const [mealData, setMealData] = useState<GraphData[]>([]);
  const [breakfastData, setBreakfastData] = useState<GraphData[]>([]);
  const [profitData, setProfitData] = useState<GraphData[]>([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [companyData, setCompanyData] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"quarter" | "year" | "month" | null>(
    "month"
  );

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
      let profit;
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
        profit = await fetchProfitData(token, currentMonth, currentYear);

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
          (entry: { booking_date: string; average_breakfasts_per_day: string }) => ({
            date: entry.booking_date.slice(8, 10),
            data: entry.average_breakfasts_per_day,
          })
        );
        const transformedProfit = profit.map(
          (entry: { order_date: string; total_profit: string }) => ({
            date: entry.order_date.slice(8, 10),
            data: entry.total_profit,
          })
        );
        await fetchUpDown(
          transformedMeal,
          transformedRoom,
          transformedBreakfast,
          transformedProfit
        );
        setRoomData(transformedRoom);
        setMealData(transformedMeal);
        setBreakfastData(transformedBreakfast);
        setProfitData(transformedProfit);
      }
      if (selectedOption === "quarter") {
        room = await fetchRoomDataQuarter(token, currentQuarter, currentYear);
        meal = await fetchMealsQuarter(token, currentQuarter, currentYear);
        company = await fetchCompaniesQuarter(token, currentQuarter, currentYear);
        breakfast = await fetchBreakfastQuarter(token, currentQuarter, currentYear);
        profit = await fetchProfitDataQuarter(token, currentQuarter, currentYear);
        const transformedRoom = room.map(
          (entry: { booking_date: string; rooms_booked: string }) => {
            const date = new Date(entry.booking_date);
            return {
              date: monthNames[date.getMonth()],
              data: entry.rooms_booked,
            };
          }
        );

        const transformedMeal = meal.map(
          (entry: { booking_date: string; average_meals_per_day: string }) => {
            const date = new Date(entry.booking_date);
            return {
              date: monthNames[date.getMonth()],
              data: entry.average_meals_per_day,
            };
          }
        );

        const transformedBreakfast = breakfast.map(
          (entry: { booking_date: string; average_breakfasts_per_day: string }) => {
            const date = new Date(entry.booking_date);
            return {
              date: monthNames[date.getMonth()],
              data: entry.average_breakfasts_per_day,
            };
          }
        );
        const transformedProfit = profit.map(
          (entry: { order_date: string; total_profit: string }) => {
            const date = new Date(entry.order_date);
            return {
              date: monthNames[date.getMonth()],
              data: entry.total_profit,
            };
          }
        );
        await fetchUpDown(
          transformedMeal,
          transformedRoom,
          transformedBreakfast,
          transformedProfit
        );
        setRoomData(transformedRoom);
        setMealData(transformedMeal);
        setBreakfastData(transformedBreakfast);
        setProfitData(transformedProfit);
      }
      if (selectedOption === "year") {
        room = await fetchRoomDataYear(token, currentYear);
        meal = await fetchMealsYear(token, currentYear);
        company = await fetchCompaniesYear(token, currentYear);
        breakfast = await fetchBreakfastYear(token, currentYear);
        profit = await fetchProfitDataYear(token, currentYear);
        const transformedRoom = room.map(
          (entry: { booking_date: string; rooms_booked: string }) => {
            const date = new Date(entry.booking_date);
            return {
              date: monthNames[date.getMonth()],
              data: entry.rooms_booked,
            };
          }
        );

        const transformedMeal = meal.map(
          (entry: { booking_date: string; average_meals_per_day: string }) => {
            const date = new Date(entry.booking_date);
            return {
              date: monthNames[date.getMonth()],
              data: entry.average_meals_per_day,
            };
          }
        );

        const transformedBreakfast = breakfast.map(
          (entry: { booking_date: string; average_breakfasts_per_day: string }) => {
            const date = new Date(entry.booking_date);
            return {
              date: monthNames[date.getMonth()],
              data: entry.average_breakfasts_per_day,
            };
          }
        );
        const transformedProfit = profit.map(
          (entry: { order_date: string; total_profit: string }) => {
            const date = new Date(entry.order_date);
            return {
              date: monthNames[date.getMonth()],
              data: entry.total_profit,
            };
          }
        );
        await fetchUpDown(
          transformedMeal,
          transformedRoom,
          transformedBreakfast,
          transformedProfit
        );
        const groupedRoom = transformedRoom.reduce(
          (acc: any, element: { date: string; data: string }) => {
            // If the date doesn't exist in the accumulator, initialize it
            if (!acc[element.date]) {
              acc[element.date] = {
                date: element.date,
                data: 0,
              };
            }

            // Sum the data for the same date
            acc[element.date].data += parseFloat(element.data); // Ensure data is treated as a number
            return acc;
          },
          {}
        );
        const groupedMeals = transformedMeal.reduce(
          (acc: any, element: { date: string; data: string }) => {
            // If the date doesn't exist in the accumulator, initialize it
            if (!acc[element.date]) {
              acc[element.date] = {
                date: element.date,
                data: 0,
              };
            }

            // Sum the data for the same date
            acc[element.date].data += parseFloat(element.data); // Ensure data is treated as a number
            return acc;
          },
          {}
        );
        const groupedBreakfast = transformedBreakfast.reduce(
          (acc: any, element: { date: string; data: string }) => {
            // If the date doesn't exist in the accumulator, initialize it
            if (!acc[element.date]) {
              acc[element.date] = {
                date: element.date,
                data: 0,
              };
            }

            // Sum the data for the same date
            acc[element.date].data += parseFloat(element.data); // Ensure data is treated as a number
            return acc;
          },
          {}
        );
        const groupedProfit = transformedProfit.reduce(
          (acc: any, element: { date: string; data: string }) => {
            // If the date doesn't exist in the accumulator, initialize it
            if (!acc[element.date]) {
              acc[element.date] = {
                date: element.date,
                data: 0,
              };
            }

            // Sum the data for the same date
            acc[element.date].data += parseFloat(element.data); // Ensure data is treated as a number
            return acc;
          },
          {}
        );

        const modifiedTransformedRoom: { date: string; data: string }[] =
          Object.values(groupedRoom);
        const modifiedTransformedMeals: { date: string; data: string }[] =
          Object.values(groupedMeals);
        const modifiedTransformedBreakfast: { date: string; data: string }[] =
          Object.values(groupedBreakfast);
        const modifiedTransformedProfit: { date: string; data: string }[] =
          Object.values(groupedProfit);
        setRoomData(modifiedTransformedRoom);
        setMealData(modifiedTransformedMeals);
        setBreakfastData(modifiedTransformedBreakfast);
        setProfitData(modifiedTransformedProfit);
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

  const fetchUpDown = async (mealData: [], roomData: [], breakfastData: [], profitData: []) => {
    setLoading(true);
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString();
    const prevMonth = currentMonth === "1" ? "12" : currentDate.getMonth().toString();
    const currentYear = currentDate.getFullYear().toString();
    const prevYear = (currentDate.getFullYear() - 1).toString();

    const currentQuarter = Math.ceil(parseInt(currentMonth) / 3);

    // Calculate previous quarter
    let prevQuarter, prevQuarterYear;

    if (currentQuarter === 1) {
      prevQuarter = "4"; // Previous quarter is Q4
      prevQuarterYear = (parseInt(currentYear) - 1).toString();
    } else {
      prevQuarter = (currentQuarter - 1).toString();
      prevQuarterYear = currentYear;
    }
    let prevMonthYear;
    if (currentMonth === "1") {
      prevMonthYear = (parseInt(currentYear) - 1).toString();
    } else {
      prevMonthYear = currentYear;
    }
    prevQuarter = prevQuarter.toString();
    let room;
    let meal;
    let breakfast;
    let profit;

    if (selectedOption === "month") {
      room = await fetchRoomData(token, prevMonth, prevMonthYear);
      meal = await fetchMeals(token, prevMonth, prevMonthYear);
      breakfast = await fetchBreakfast(token, prevMonth, prevMonthYear);
      profit = await fetchProfitData(token, prevMonth, prevMonthYear);
    }
    if (selectedOption === "quarter") {
      room = await fetchRoomDataQuarter(token, prevQuarter, prevQuarterYear);
      meal = await fetchMealsQuarter(token, prevQuarter, prevQuarterYear);
      breakfast = await fetchBreakfastQuarter(token, prevQuarter, prevQuarterYear);
      profit = await fetchProfitDataQuarter(token, prevQuarter, prevQuarterYear);
    }
    if (selectedOption === "year") {
      room = await fetchRoomDataYear(token, prevYear);
      meal = await fetchMealsYear(token, prevYear);
      breakfast = await fetchBreakfastYear(token, prevYear);
      profit = await fetchProfitDataYear(token, prevYear);
    }

    let prevTotal: number = 0;
    let numberOfdays: number = 0;

    room.map((entry: { booking_date: string; rooms_booked: string }) => {
      prevTotal = prevTotal + Number(entry.rooms_booked);
      numberOfdays++;
    });

    const prevAvg = Number((prevTotal / numberOfdays).toFixed(2));

    // console.log("prevQuarter: ", prevQuarter, "prevQuarterYear: ", prevQuarterYear)
    // console.log("prevMonth: ", prevMonth, "prevMonthYear: ", prevMonthYear)

    setPrevBookings(prevAvg);
    let currentTotal = 0;

    roomData.map((entry: { date: string; data: string }) => {
      currentTotal = currentTotal + Number(entry.data);
    });

    const Avg = Number((currentTotal / roomData.length).toFixed(2));
    setBookings(Avg);

    let prevMeal: number = 0;

    meal.map((entry: { booking_date: string; average_meals_per_day: string }) => {
      prevMeal = prevMeal + Number(entry.average_meals_per_day);
    });

    const avgMeal = Number((prevMeal / meal.length).toFixed(2));
    console.log("prevMeal: ", meal, prevMeal, meal.length, avgMeal);
    setPrevMeal(avgMeal);

    let currentMeal = 0;

    mealData.map((entry: { date: string; data: string }) => {
      currentMeal = currentMeal + Number(entry.data);
    });

    const avgCurrentMeal = Number((currentMeal / mealData.length).toFixed(2));
    setMeal(avgCurrentMeal);

    let prevBreakfast: number = 0;

    breakfast?.map((entry: { booking_date: string; average_breakfasts_per_day: string }) => {
      prevBreakfast = prevBreakfast + Number(entry.average_breakfasts_per_day);
    });

    const avgBreakfast = Number((prevBreakfast / breakfast.length).toFixed(2));
    setPrevBreakfast(avgBreakfast);

    let currentBreakfast = 0;

    breakfastData.map((entry: { date: string; data: string }) => {
      currentBreakfast = currentBreakfast + Number(entry.data);
    });

    const avgCurrentBreakfast = Number((currentBreakfast / breakfastData.length).toFixed(2));
    setBreakfast(avgCurrentBreakfast);

    let prevProfit: number = 0;

    profit.map((entry: { order_date: string; total_profit: string }) => {
      prevProfit = prevProfit + Number(entry.total_profit);
    });
    const avgPrevProfit = Number((prevProfit / profit.length).toFixed(2));
    setPrevProfit(avgPrevProfit);
    setPrevTotalProfit(prevProfit);

    let currentProfit: number = 0;

    profitData.map((entry: { date: string; data: string }) => {
      currentProfit = currentProfit + Number(entry.data);
    });
    setTotalProfit(currentProfit);
    const avgCurrentProfit = Number((currentProfit / profitData.length).toFixed(2));
    setProfit(avgCurrentProfit);
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
        {loading && <div className="w-32 h-8 bg-gray-200 animate-pulse rounded-md "></div>}
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
            <MonthCard
              title="Profit"
              thisMonth={profit}
              totalProfit={totalProfit}
              totalPrevProfit={prevTotalProfit}
              icon="PROFIT"
              loading={loading}
              cardType={selectedOption}
              prevMonth={prevProfit}
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
              <LineChart
                graphType={selectedOption}
                theme="blue"
                chartData={mealData}
                title={`Meals Served Per ${selectedOption}`}
              />
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
              <PieChart
                chartData={companyData}
                title={`Company Wise Booking Per ${selectedOption}`}
              />
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
              <LineChart
                graphType={selectedOption}
                theme="cyan"
                chartData={roomData}
                title={`Bookings Per ${selectedOption}`}
              />
            </div>
          )}
          {!loading && (
            <div className="p-5 shadow-md w-full xl:h-[45vh]  border rounded-xl max-lg:p-0">
              <LineChart
                graphType={selectedOption}
                theme="cyan"
                chartData={profitData}
                title={`Profit Per ${selectedOption}`}
              />
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
              <LineChart
                graphType={selectedOption}
                theme="red"
                chartData={breakfastData}
                title={`Breakfast Served Per ${selectedOption}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
