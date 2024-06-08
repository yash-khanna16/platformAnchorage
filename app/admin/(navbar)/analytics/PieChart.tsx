"use client";

import React from "react";
import { Pie } from "react-chartjs-2";

function PieChart(props: any) {
  const chartData = {
    labels: props.chartData.map((data: any) => data.company),
    datasets: [
      {
        label: "Bookings",
        data: props.chartData.map((data: any) => data.data),
        backgroundColor: [
          "rgba(75,192,192,0.2)",
          "rgba(54,162,235,0.2)",
          "rgba(255,206,86,0.2)",
          "rgba(75,192,192,0.2)",
          "rgba(153,102,255,0.2)",
          "rgba(255,159,64,0.2)",
          "rgba(255,99,132,0.2)"
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
        borderWidth: 1
      }
    ]
  };
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>{props.title}</h2>
      <Pie
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
          }
        }}
      />
    </div>
  );
}

export default PieChart;
