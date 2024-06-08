"use client";

import React from "react";
import { Line } from "react-chartjs-2";

function LineChart(props: any) {
  const chartData = {
    labels: props.chartData.map((data: any) => data.days),
    datasets: [
      {
        label: "Bookings",
        data: props.chartData.map((data: any) => data.data),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)"
      }
    ]
  };
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  return (
    <div className="chart-container ">
      <h2 style={{ textAlign: "center" }}>{props.title}</h2>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: `For the month of ${currentMonth}`
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
}

export default LineChart;
