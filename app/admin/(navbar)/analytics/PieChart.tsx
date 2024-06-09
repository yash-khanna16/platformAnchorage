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
          "rgba(75,192,192,1)",
          "rgba(54,162,235,1)",
          "rgba(255,206,86,1)",
          "rgba(75,192,192,1)",
          "rgba(153,102,255,1)",
          "rgba(255,159,64,1)",
          "rgba(255,99,132,1)"
        ],
        borderWidth: 1,
        offset:5,
        hoverOffset:10,
        cutout:120
      }
    ]
  };
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>{props.title}</h2>
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
          cutout: '50%' // Added to create a Donut chart
        }}
      />
    </div>
  );
}

export default DonutChart; // Renamed export to DonutChart
