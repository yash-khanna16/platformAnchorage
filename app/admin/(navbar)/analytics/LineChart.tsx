import React, { useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Option, Select } from "@mui/joy";
import { KeyboardArrowDown } from "@mui/icons-material";

Chart.register(...registerables);

type themeType = "blue" | "red" | "cyan" | "pink" | "green";

export const THEME_MAP = new Map<themeType, any>([
  [
    "blue",
    {
      backgroundColor: (context: any) => {
        const bgColor = [
          "rgba(51, 153, 255, 0.4)", // Light blue
          "rgba(102, 204, 255, 0.4)", // Lighter blue
          "rgba(153, 204, 255, 0.4)", // Even lighter blue
          "rgba(204, 229, 255, 0.4)", // Very light blue
          "rgba(255, 255, 255, 0.4)", // White
        ];

        if (!context.chart.chartArea) {
          return;
        }
        const {
          ctx,
          chartArea: { top, bottom },
        } = context.chart;
        const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
        const colorTranches = 1 / (bgColor.length - 1);
        for (let i = 0; i < bgColor.length - 1; i++) {
          gradientBg.addColorStop(0 + i * colorTranches, bgColor[i]);
        }
        return gradientBg;
      },
      borderColor: "#08acf8", // Blue border color
      pointBorderColor: "#08acf8",
    },
  ],
  [
    "red",
    {
      backgroundColor: (context: any) => {
        const bgColor = [
          "rgba(255, 51, 51, 0.4)", // Light red
          "rgba(255, 102, 102, 0.4)", // Lighter red
          "rgba(255, 153, 153, 0.4)", // Even lighter red
          "rgba(255, 204, 204, 0.4)", // Very light red
          "rgba(255, 255, 255, 0.4)", // White
        ];

        if (!context.chart.chartArea) {
          return;
        }
        const {
          ctx,
          chartArea: { top, bottom },
        } = context.chart;
        const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
        const colorTranches = 1 / (bgColor.length - 1);
        for (let i = 0; i < bgColor.length - 1; i++) {
          gradientBg.addColorStop(0 + i * colorTranches, bgColor[i]);
        }
        return gradientBg;
      },
      borderColor: "#ff3333", // Red border color
      pointBorderColor: "#ff3333",
    },
  ],
  [
    "green",
    {
      backgroundColor: (context: any) => {
        const bgColor = [
          "rgba(0, 153, 0, 0.4)", // Dark green
          "rgba(51, 204, 51, 0.4)", // Lighter green
          "rgba(102, 255, 102, 0.4)", // Even lighter green
          "rgba(153, 255, 153, 0.4)", // Very light green
          "rgba(255, 255, 255, 0.4)", // White
        ];

        if (!context.chart.chartArea) {
          return;
        }
        const {
          ctx,
          chartArea: { top, bottom },
        } = context.chart;
        const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
        const colorTranches = 1 / (bgColor.length - 1);
        for (let i = 0; i < bgColor.length - 1; i++) {
          gradientBg.addColorStop(0 + i * colorTranches, bgColor[i]);
        }
        return gradientBg;
      },
      borderColor: "#03c203", // Dark green border color
      pointBorderColor: "#03c203",
    },
  ],
  [
    "pink",
    {
      backgroundColor: (context: any) => {
        const bgColor = [
          "rgba(255, 97, 176, 0.4)", // Light pink
          "rgba(255, 102, 178, 0.4)", // Lighter pink
          "rgba(255, 153, 204, 0.4)", // Even lighter pink
          "rgba(255, 204, 229, 0.4)", // Very light pink
          "rgba(255, 255, 255, 0.4)", // White
        ];

        if (!context.chart.chartArea) {
          return;
        }
        const {
          ctx,
          chartArea: { top, bottom },
        } = context.chart;
        const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
        const colorTranches = 1 / (bgColor.length - 1);
        for (let i = 0; i < bgColor.length - 1; i++) {
          gradientBg.addColorStop(0 + i * colorTranches, bgColor[i]);
        }
        return gradientBg;
      },
      borderColor: "#ff3399", // Pink border color
      pointBorderColor: "#ff3399",
    },
  ],
  [
    "cyan",
    {
      backgroundColor: (context: any) => {
        const bgColor = [
          "rgba(51, 255, 255, 0.4)", // Light cyan
          "rgba(102, 255, 255, 0.4)", // Lighter cyan
          "rgba(153, 255, 255, 0.4)", // Even lighter cyan
          "rgba(204, 255, 255, 0.4)", // Very light cyan
          "rgba(255, 255, 255, 0.4)", // White
        ];

        if (!context.chart.chartArea) {
          return;
        }
        const {
          ctx,
          chartArea: { top, bottom },
        } = context.chart;
        const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
        const colorTranches = 1 / (bgColor.length - 1);
        for (let i = 0; i < bgColor.length - 1; i++) {
          gradientBg.addColorStop(0 + i * colorTranches, bgColor[i]);
        }
        return gradientBg;
      },
      borderColor: "#28b1b1", // Cyan border color
      pointBorderColor: "#28b1b1",
    },
  ],
]);

function LineChart({
  title,
  chartData,
  theme,
  graphType,
}: {
  title: string;
  chartData: { date: any; data: any }[];
  theme: themeType;
  graphType: "month" | "quarter" | "year" | null;
}) {
  const chartDataGraph = {
    labels: chartData.map((data: any) => data.date),
    datasets: [
      {
        data: chartData.map((data: any) => data.data),
        // backgroundColor: (context: any) => {
        //   const bgColor = [
        //     "rgba(51, 153, 255, 0.4)", // Light blue
        //     "rgba(102, 204, 255, 0.4)", // Lighter blue
        //     "rgba(153, 204, 255, 0.4)", // Even lighter blue
        //     "rgba(204, 229, 255, 0.4)", // Very light blue
        //     "rgba(255, 255, 255, 0.4)", // White
        //   ];

        //   if (!context.chart.chartArea) {
        //     return;
        //   }
        //   const {
        //     ctx,
        //     chartArea: { top, bottom },
        //   } = context.chart;
        //   const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
        //   const colorTranches = 1 / (bgColor.length - 1);
        //   for (let i = 0; i < bgColor.length - 1; i++) {
        //     gradientBg.addColorStop(0 + i * colorTranches, bgColor[i]);
        //   }
        //   return gradientBg;
        // },
        // borderColor: "#08acf8", // Blue border color
        // pointBorderColor: "#08acf8",
        ...THEME_MAP.get(theme),
        pointRadius: 0, // Size of the data points
        pointHoverRadius: 8, // Size of the data points when hovered
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: "white",
        pointBorderWidth: 2,
        tension: 0.3, // Adjust this value for a smoother curve
      },
    ],
  };

  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  return (
    <div className="chart-container ">
      <div className="flex justify-between">
        <div className="text-lg max-xl:text-center w-full font-bold text-[#353738]">{title}</div>
        {/* <Select indicator={<KeyboardArrowDown />} size="sm" defaultValue="June">
          <Option value="June">June</Option>
          <Option value="May">May</Option>
          <Option value="April">April</Option>
        </Select> */}
      </div>
      <Line
        data={chartDataGraph}
        options={{
          plugins: {
            title: {
              display: true,
              // text: `For the month of ${currentMonth}`,
            },
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
                color: "rgba(0, 0, 0, 0.1)", // Set grid line color with 0.5 opacity
              },
            },
            y: {
              grid: {
                display: true,
                color: "rgba(165, 165, 165, 0.1)", // Set grid line color with 0.5 opacity
              },
            },
          },
        }}
      />
    </div>
  );
}

export default LineChart;
