import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}
const CalendarSvg: React.FC<IconProps> = ({
  width = 18,
  height = 18,
  color = "#fff",
  className = "",
}) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_22429_9783)">
        <path
          d="M12.6365 0.750244V4.09202M5.36381 0.750244V4.09202M0.818359 7.43379H17.182M2.63654 2.21227H15.3638C16.368 2.21227 17.182 2.96035 17.182 3.88316V15.5794C17.182 16.5022 16.368 17.2502 15.3638 17.2502H2.63654C1.63239 17.2502 0.81836 16.5022 0.81836 15.5794V3.88316C0.81836 2.96035 1.63239 2.21227 2.63654 2.21227Z"
          stroke="#fff"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M7.36355 12.2727L4.09082 12.2727"
          stroke="#fff"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M13.909 12.2727H10.6362"
          stroke="#fff"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_22429_9783">
          <rect
            width={width}
            height={height}
            fill={color}
            className={className}
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default CalendarSvg;
