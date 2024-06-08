"use client";
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { CategoryScale } from "chart.js";
import LineChart from './LineChart';
import PieChart from './PieChart';
import { fetchRoomData, fetchMeals, fetchCompanies } from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const companyData = [
  { id: 1, company: "Anglo", data: 10 },
  { id: 2, company: "Synergy", data: 3 },
  { id: 3, company: "Esm", data: 7 },
  { id: 4, company: "Jindal", data: 4 },
  { id: 5, company: "Online", data: 6 }
];

const Data = [
  { id: 1, days: 1, data: 25 },
  { id: 2, days: 2, data: 26 },
  { id: 3, days: 3, data: 24 },
  { id: 4, days: 4, data: 26 },
  { id: 5, days: 5, data: 27 },
  { id: 6, days: 6, data: 28 },
  { id: 7, days: 7, data: 22 },
  { id: 8, days: 8, data: 24 },
  { id: 9, days: 9, data: 25 },
  { id: 10, days: 10, data: 26 },
  { id: 11, days: 11, data: 28 },
  { id: 12, days: 12, data: 26 },
  { id: 13, days: 13, data: 27 },
  { id: 14, days: 14, data: 29 },
  { id: 15, days: 15, data: 30 },
  { id: 16, days: 16, data: 28 },
  { id: 17, days: 17, data: 27 },
  { id: 18, days: 18, data: 22 },
  { id: 19, days: 19, data: 27 },
  { id: 20, days: 20, data: 29 },
  { id: 21, days: 21, data: 31 },
  { id: 22, days: 22, data: 32 },
  { id: 23, days: 23, data: 33 },
  { id: 24, days: 24, data: 21 },
  { id: 25, days: 25, data: 27 },
  { id: 26, days: 26, data: 28 },
  { id: 27, days: 27, data: 24 },
  { id: 28, days: 28, data: 25 },
  { id: 29, days: 29, data: 27 },
  { id: 30, days: 30, data: 28 }
];

Chart.register(CategoryScale);

function Analytics() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [bookings, setBookings] = useState(270);
  const [prevBookings, setPrevBookings] = useState(197);
  const [meal, setMeal] = useState(190);
  const [prevMeal, setPrevMeal] = useState(197);
  const [time, setTime] = useState("Month");

  const handleChange = (event: SelectChangeEvent) => {
    setTime(event.target.value as string);
  };

  useEffect(() => {
    getAuthAdmin().then(auth => {
      if (auth) setToken(auth.value);
    });
  }, []);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchRoomData(token), fetchMeals(token), fetchCompanies(token)]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    if (token) {
      fetchGraph();
    }
  }, [token]);

  return (
    <div className='p-5 bg-blue-50'>
      <div className='text-4xl text-center font-semibold'>Analytics</div>
      {loading ? (
        <div className='flex w-full h-screen justify-center items-center my-10'>
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className='flex justify-end'>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select value={time} onChange={handleChange} inputProps={{ 'aria-label': 'Without label' }}>
                <MenuItem value={"Month"}>Month</MenuItem>
                <MenuItem value={"Quarter"}>Quarter</MenuItem>
                <MenuItem value={"Year"}>Year</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className='flex mt-5 gap-5'>
            <div className='bg-white w-8/12 flex justify-around px-5 py-3 rounded-xl border'>
              <div className='flex items-center p-3'>
                <div className='bg-blue-300 p-3 rounded-full'>
                  <svg xmlns="http://www.w3.org/2000/svg" height="50" width="50" viewBox="0 0 640 512">
                    <path fill="#ffffff" d="M32 32c17.7 0 32 14.3 32 32V320H288V160c0-17.7 14.3-32 32-32H544c53 0 96 43 96 96V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V416H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zm144 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"/>
                  </svg>
                </div>
                <div className='ml-5'>
                  <div className='text-xl mb-3'>Bookings</div>
                  <div className='flex'>
                    <div className='text-lg mr-3'>{bookings}</div>
                    <div className='text-lg'>
                      {bookings > prevBookings ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="relative top-1.5" viewBox="0 0 16 16">
                          <path fill="#3fff3f" fillRule="evenodd" d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="relative top-1.5 rotate-180" width="16" height="16" viewBox="0 0 16 16">
                          <path fill="#ff0000" fillRule="evenodd" d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>Previous Month: {prevBookings}</div>
                </div>
              </div>
              <div className='flex items-center p-3'>
                <div className='bg-blue-300 p-3 rounded-full'>
                  <svg xmlns="http://www.w3.org/2000/svg" height="50" width="50" viewBox="0 0 512 512">
                    <path fill="#ffffff" d="M0 192c0-35.3 28.7-64 64-64c.5 0 1.1 0 1.6 0C73 91.5 105.3 64 144 64c15 0 29 4.1 40.9 11.2C198.2 49.6 225.1 32 256 32s57.8 17.6 71.1 43.2C339 68.1 353 64 368 64c38.7 0 71 27.5 78.4 64c.5 0 1.1 0 1.6 0c35.3 0 64 28.7 64 64c0 11.7-3.1 22.6-8.6 32H8.6C3.1 214.6 0 203.7 0 192zm0 91.4C0 268.3 12.3 256 27.4 256H484.6c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1L403.5 452c-2 16-15.6 28-31.8 28H140.2c-16.1 0-29.8-12-31.8-28l-1.8-14.4C44.4 414.1 0 353.9 0 283.4z"/>
                  </svg>
                </div>
                <div className='ml-5'>
                  <div className='text-xl mb-3'>Meals</div>
                  <div className='flex'>
                    <div className='text-lg mr-3'>{meal}</div>
                    <div className='text-lg'>
                      {meal > prevMeal ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="relative top-1.5" viewBox="0 0 16 16">
                          <path fill="#3fff3f" fillRule="evenodd" d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="relative top-1.5 rotate-180" width="16" height="16" viewBox="0 0 16 16">
                          <path fill="#ff0000" fillRule="evenodd" d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>Previous Month: {prevMeal}</div>
                </div>
              </div>
            </div>
            <div className='bg-white w-5/12 px-5 py-3 rounded-xl border text-xl text-center'>
              Today's Activities
              <div className="flex gap-5 text-lg">
                <div className='flex items-center flex-col'>
                  <div className='py-[10px] px-[8px] my-2 bg-blue-300 rounded-full text-white'>{bookings}</div>
                  <div className='text-center'>Rooms Booked</div>
                </div>
                <div className='flex items-center flex-col'>
                  <div className='py-[10px] px-[8px] my-2 bg-blue-300 rounded-full text-white'>{bookings}</div>
                  <div className='text-center'>Rooms Available</div>
                </div>
                <div className='flex items-center flex-col'>
                  <div className='py-[10px] px-[8px] my-2 bg-blue-300 rounded-full text-white'>{bookings}</div>
                  <div className='text-center'>Meals Served</div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-around mt-10'>
            <div className='w-5/12 my-auto'>
              <PieChart chartData={companyData} title="Company Wise Booking Per Day" />
            </div>
            <div className='w-6/12'>
              <div className='mb-5'>
                <LineChart chartData={Data} title="Rooms Booked Per Day" />
              </div>
              <div className='mt-5'>
                <LineChart chartData={Data} title="Meals Served Per Day" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;
