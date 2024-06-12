"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2"; // Changed Pie to Doughnut

function DonutChart(props: any) { // Renamed PieChart to DonutChart
  const chartData = {
    labels: props.chartData.map((data: any) => data.company),
    datasets: [
      {
        label: "Bookings",
        data: props.chartData.map((data: any) => data.average_rooms_booked),
        backgroundColor: [
          "rgba(54,162,235,0.7)",
          "rgba(255,206,86,0.7)",
          "rgba(75,192,192,0.7)",
          "rgba(75,192,192,0.7)",
          "rgba(153,102,255,0.7)",
          "rgba(255,159,64,0.7)",
          "rgba(255,99,132,0.7)"
        ],
        borderColor: [
          "rgba(54,162,235,0.7)",
          "rgba(255,206,86,0.7)",
          "rgba(75,192,192,0.7)",
          "rgba(75,192,192,0.7)",
          "rgba(153,102,255,0.7)",
          "rgba(255,159,64,0.7)",
          "rgba(255,99,132,0.7)"
        ],
        borderWidth: 1,
        offset:10,
        hoverOffset:30,
        cutout:70
      }
    ]
  };
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  return (
    <div className="chart-container h-full w-full  px-8 py-4 ">
        <div className="text-lg  font-bold text-[#353738]">{props.title}</div>
        <div className="w-1/2 h-full mx-auto my-2">

        <Doughnut // Changed Pie to Doughnut
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: `For the month of ${currentMonth}`
            },
            legend: {
              display: true,
              position: 'bottom'
            }
          },
          cutout: '50%',
        }}
      />
        </div>
    </div>
  );
}

export default DonutChart; // Renamed export to DonutChart
