import { star } from "@/assets/icons";
import React, { useState } from "react";

function RatingCard({
  title,
  rating,
  icon,
  color,
  count,
  onClick,
  selected,
}: {
  title: string;
  rating: number;
  icon: React.JSX.Element;
  color: string;
  count: number;
  onClick: () => void;
  selected: boolean;
}) {
  const [rippleStyle, setRippleStyle] = useState<{ top: string; left: string } | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Calculate ripple position
    const card = event.currentTarget;
    const { top, left, width, height } = card.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;

    // Set ripple style
    setRippleStyle({
      top: `${y}px`,
      left: `${x}px`,
    });

    // Reset ripple after animation duration
    setTimeout(() => {
      setRippleStyle(null);
    }, 600); // Match this duration with your CSS animation duration

    // Call the onClick function
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`${selected && 'bg-blue-50'} relative min-w-[300px] cursor-pointer max-lg:w-full w-1/4 shadow-md flex rounded-xl border overflow-hidden`} // Added overflow-hidden
    >
      {rippleStyle && (
        <span
          className="ripple absolute" // Added absolute positioning
          style={{
            top: rippleStyle.top,
            left: rippleStyle.left,
            width: '100px', // Fixed size for ripple
            height: '100px',
            borderRadius: '50%', // Make the ripple circular
            backgroundColor: 'rgba(0, 0, 0, 0.15)', // Adjust color for visibility
            transform: 'scale(0)', // Start scaled down
            animation: 'ripple-animation 0.4s linear forwards', // Use animation
          }}
        />
      )}
      <div className="max-lg:h-[20px] flex px-4 justify-center w-1/4 h-[100px]">
        <div
          style={{ backgroundColor: color }}
          className={`w-[50px] my-10 h-[50px] rounded-full flex justify-center items-center`}
        >
          {icon}
        </div>
      </div>
      <div className="min-w-[200px] w-3/4 h-[200px] p-7">
        <div className="mt-4 mb-2 text-gray-500 text-lg font-medium">{title}</div>
        <div className="text-3xl flex font-bold items-center">
          <div>{rating}</div>
          <div className="ml-3 flex items-center">{star}</div>
        </div>
        <div className="flex mt-5 space-x-2 items-center">
          <div className="text-gray-400 font-medium text-sm">{count} review{count > 1 && 's'}</div>
        </div>
      </div>
    </div>
  );
}

export default RatingCard;
