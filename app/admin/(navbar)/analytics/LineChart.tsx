import React, { useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function LineChart(props: any) {

  const chartData = {
    labels: props.chartData.map((data: any) => data.date),
    datasets: [
      {
        label: "Bookings",
        data: props.chartData.map((data: any) => data.data),
        backgroundColor: (context: any) => {
          const bgColor = [
            'rgba(51, 153, 255, 0.4)',  // Light blue
            'rgba(102, 204, 255, 0.4)', // Lighter blue
            'rgba(153, 204, 255, 0.4)', // Even lighter blue
            'rgba(204, 229, 255, 0.4)', // Very light blue
            'rgba(255, 255, 255, 0.4)'  // White
          ];
          
          if (!context.chart.chartArea) {
            return;
          }
          const { ctx, chartArea: { top, bottom } } = context.chart;
          const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
          const colorTranches = 1 / (bgColor.length - 1);
          for (let i = 0; i < bgColor.length - 1; i++) {
            gradientBg.addColorStop(0 + i * colorTranches, bgColor[i])
          }
          return gradientBg;
        },
        borderColor: 'rgba(51, 153, 255, 0.5)', // Blue border color
        fill: true,
        tension: 0.3 // Adjust this value for a smoother curve
      }
    ]
  };

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="chart-container">
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
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              grid: {
                display: false
              }
            }
          }
        }}
      />
    </div>
  );
}

export default LineChart;
