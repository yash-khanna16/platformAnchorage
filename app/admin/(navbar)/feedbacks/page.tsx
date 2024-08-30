"use client";
import React, { useEffect, useState } from "react";
import RatingCard from "./RatingCard";
import { Dashboard, EventAvailable, MeetingRoom, RamenDining } from "@mui/icons-material";
import { Table } from "@mui/joy";
import { fetchAllFeedback } from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";

type FeedbackType = {
  type: string;
  sno: number;
  name: string;
  room: string;
  rating: number;
  comment: string;
  date: string;
  order_id?: number;
};

function Feedback() {
  const [token, setToken] = useState("");
  const [allFeedbacks, setAllFeedbacks] = useState<FeedbackType[]>([]);
  const [averageAnchorage, setAverageAnchorage] = useState(0);
  const [orderAverage, setOrderAverage] = useState(0);
  const [expAverage, setExpAverage] = useState(0);
  const [timelineAverage, setTimelineAverage] = useState(0);
  const [anchorageCount, setAnchorageCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [expCount, setExpCount] = useState(0);
  const [timelineCount, setTimelineCount] = useState(0);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<FeedbackType[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  function formatDateToDDMMYYYYHHMM(isoDate: string): string {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      fetchAllFeedback(token)
        .then((feedback: FeedbackType[]) => {
          let anchorageTotal = 0,
            anchorageCount = 0;
          let expTotal = 0,
            expCount = 0;
          let timelineTotal = 0,
            timelineCount = 0;
          let orderTotal = 0,
            orderCount = 0;

          feedback.forEach((feedback: any, index: number) => {
            feedback.sno = index + 1;
            feedback.date = formatDateToDDMMYYYYHHMM(feedback.last_modified);
            if (feedback.type === "stay") {
              feedback.type = "Anchorage";
              anchorageTotal += Number(feedback.rating);
              anchorageCount++;
            }
            if (feedback.type === "cos") {
              feedback.type = "App Experience";
              expTotal += Number(feedback.rating);
              expCount++;
            }
            if (feedback.type === "order") {
              feedback.type = "Orders";
              orderTotal += Number(feedback.rating);
              orderCount++;
            }
            if (feedback.type === "timeline") {
              feedback.type ="Timeline";
              timelineTotal += Number(feedback.rating);
              timelineCount++;
            }
          });

          setAverageAnchorage(Number(anchorageCount === 0 ? 0 : (anchorageTotal / anchorageCount).toFixed(2)));
          setExpAverage(Number(expCount === 0 ? 0 : (expTotal / expCount).toFixed(2)));
          setTimelineAverage(Number(timelineCount === 0 ? 0 : (timelineTotal / timelineCount).toFixed(2)));
          setOrderAverage(Number(orderCount === 0 ? 0 : (orderTotal / orderCount).toFixed(2)));

          setAnchorageCount(anchorageCount);
          setExpCount(expCount);
          setOrderCount(orderCount);
          setTimelineCount(timelineCount);
          setAllFeedbacks(feedback);
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    }
  }, [token]);

  const handleCardClick = (type: string) => {
    if (selectedType === type) {
      setSelectedType(null); // Remove filter if the same card is clicked
      setFilteredFeedbacks([]); // Reset filtered feedbacks
    } else {
      setSelectedType(type);
      setFilteredFeedbacks(allFeedbacks.filter((feedback) => feedback.type === type));
    }
  };

  // Determine which feedback to display in the table
  const displayedFeedbacks = selectedType ? filteredFeedbacks : allFeedbacks;

  return (
    <div className="m-5 mx-8">
      <div className="text-4xl font-semibold mt-8 my-5">Feedbacks</div>
      <div className="flex max-2xl::justify-around max-2xl:flex-wrap gap-y-3 gap-x-3">
        <RatingCard
          count={anchorageCount}
          title="Anchorage"
          rating={averageAnchorage}
          selected={selectedType === "Anchorage"}
          icon={<MeetingRoom className="text-[#4754cf] scale-125" />}
          color="#e3e6ff"
          onClick={() => handleCardClick("Anchorage")} // Handle click
        />
        <RatingCard
          count={orderCount}
          title="Orders"
          rating={orderAverage}
          selected={selectedType === "Orders"}
          icon={<RamenDining className="text-[#d3a122] scale-125" />}
          color="#ffe9cc"
          onClick={() => handleCardClick("Orders")} // Handle click
        />
        <RatingCard
          count={expCount}
          title="App Experience"
          rating={expAverage}
          selected={selectedType === "App Experience"}
          icon={<Dashboard className="text-[#b8453d] scale-125" />}
          color="#ffc8bc"
          onClick={() => handleCardClick("App Experience")} // Handle click
        />
        <RatingCard
          count={timelineCount}
          title="Timeline"
          rating={timelineAverage}
          selected={selectedType === "Timeline"}
          icon={<EventAvailable className="text-[#6a46eb] scale-125" />}
          color="#ddddf8"
          onClick={() => handleCardClick("Timeline")} // Handle click
        />
      </div>
      <div className="my-8   w-full h-[70vh] overflow-auto">
        <div className="border min-w-[1000px]">
          <Table stickyHeader borderAxis="bothBetween">
            <thead className="">
              <tr className="font-semibold">
                <th>
                  <div className="p-2">S.No </div>
                </th>
                <th>
                  <div className="p-2">Name </div>
                </th>
                <th>
                  <div className="p-2">Type </div>
                </th>
                <th>
                  <div className="p-2">Order ID</div>
                </th>
                <th>
                  <div className="p-2">Room </div>
                </th>
                <th>
                  <div className="p-2">Rating </div>
                </th>
                <th>
                  <div className="p-2">Comment </div>
                </th>
                <th>
                  <div className="p-2">Date </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedFeedbacks.map((feedback, index) => (
                <tr key={index}>
                  <td>
                    <div className="p-2 ">{feedback.sno}</div>
                  </td>
                  <td>
                    <div className="p-2 ">{feedback.name}</div>
                  </td>
                  <td>
                    <div className="p-2 ">{feedback.type}</div>
                  </td>
                  <td>
                    <div className="p-2 ">{feedback?.order_id}</div>
                  </td>
                  <td>
                    <div className="p-2 ">{feedback.room}</div>
                  </td>
                  <td>
                    <div className="p-2 ">{feedback.rating}</div>
                  </td>
                  <td>
                    <div className="p-2 ">{feedback.comment}</div>
                  </td>
                  <td>
                    <div className="p-2 ">{feedback.date}</div>
                  </td>
                </tr>
              ))}
              {displayedFeedbacks.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="p-4 font-semibold text-center text-lg w-full">No rows</div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
