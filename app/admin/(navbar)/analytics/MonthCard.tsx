import { Chip } from "@mui/joy";
import React, { ReactFragment } from "react";
import MeetingRoomOutlined from "@mui/icons-material/MeetingRoomOutlined";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { CircularProgress, SvgIconTypeMap } from "@mui/material";
import { MeetingRoom, RamenDining, Restaurant, RoomOutlined } from "@mui/icons-material";

export type iconsType = "ROOM" | "MEAL" | "BREAKFAST";

export const ICONS_MAP = new Map<iconsType, any>([
  ["ROOM", <MeetingRoom className="text-[#4754cf] scale-125 " key={1} />],
  ["MEAL", <RamenDining className="text-[#d3a122] scale-125 " key={2} />],
  ["BREAKFAST", <Restaurant className="text-[#2497ea] scale-125 " key={3} />],
]);

function MonthCard({
  title,
  thisMonth,
  prevMonth,
  icon,
  cardType,
  loading,
}: {
  title: string;
  thisMonth: number;
  prevMonth: number;
  icon: iconsType;
  cardType: string | null;
  loading: boolean;
}) {
  return (
    <>
      {loading && (
        <div className="w-full shadow-md flex animate-pulse  rounded-xl border">
          <>
            <div className=" w-1/5   h-[200px]">
              <div
                className={`w-[50px] ml-auto my-10  h-[50px] bg-gray-200  rounded-full flex justify-center items-center`}
              >
              </div>
            </div>
            <div className="w-4/5 h-[200px] p-7">
              <div className=" mt-4 mb-2 w-52 h-6 rounded-2xl bg-gray-200 ">
              </div>
              <div className="text-3xl flex font-bold my-4 items-center">
                <div className="w-32 h-6 bg-gray-200 rounded-2xl"></div>
                <div className="ml-3 bg-gray-200 rounded-2xl w-24 h-6">
                </div>
              </div>
              <div className="flex mt-5 space-x-2 items-center w-40 bg-gray-200 rounded-2xl h-4">
              </div>
            </div>
          </>
        </div>
      )}
        {!loading && (
      <div className="w-full shadow-md flex  rounded-xl border">
          <>
            <div className=" w-1/5   h-[200px]">
              <div
                className={`w-[50px] ml-auto my-10  h-[50px] ${icon === "ROOM" && "bg-[#e3e6ff]"} ${
                  icon === "MEAL" && "bg-[#ffe9cc]"
                } ${icon === "BREAKFAST" && "bg-[#cfebff]"} rounded-full flex justify-center items-center`}
              >
                {ICONS_MAP.get(icon)}
              </div>
            </div>
            <div className="w-4/5 h-[200px] p-7">
              <div className=" mt-4 mb-2">
                <span className="text-gray-500  text-lg font-medium">{title}</span>
                <span className="text-gray-400 font-normal text-sm"> (This {cardType})</span>
              </div>
              <div className="text-3xl flex font-bold items-center">
                <div>{thisMonth}</div>
                <div className="ml-3">
                  {thisMonth !== prevMonth && (
                    <Chip size="lg" variant="outlined" color={thisMonth < prevMonth ? "danger" : "success"}>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          className={`mx-1 ${thisMonth < prevMonth && "rotate-180"}`}
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill={thisMonth < prevMonth ? "#cd3e3e" : "#27c29d"}
                            fillRule="evenodd"
                            d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z"
                          />
                        </svg>
                        {thisMonth > prevMonth && (
                          <div className="text-[#27c29d] ">
                            {prevMonth === 0 ? "+100%" : `+${(((thisMonth - prevMonth) / prevMonth) * 100).toFixed(2)} %`}
                          </div>
                        )}
                        {thisMonth < prevMonth && (
                          <div className="text-[#cd3e3e] ">
                            {prevMonth === 0 ? "-100%" : `${(((thisMonth - prevMonth) / prevMonth) * 100).toFixed(2)} %`}
                          </div>
                        )}
                      </div>
                    </Chip>
                  )}
                </div>
              </div>
              <div className="flex mt-5 space-x-2 items-center">
                <div className=" text-gray-400 font-medium text-sm">Previous {cardType}:</div>
                <div className=" font-bold ">{prevMonth}</div>
              </div>
            </div>
          </>
      </div>
        )}
    </>
  );
}

export default MonthCard;
