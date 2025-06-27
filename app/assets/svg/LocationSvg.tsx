import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}
const LocationSvg: React.FC<IconProps> = ({
  width = 18,
  height = 22,
  color = "#72777A",
  className = "",
}) => {
  return (
    <svg
      width="18"
      height="22"
      viewBox="0 0 18 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_22429_9797)">
        <path
          d="M17.0999 9.16626C17.0999 15.5829 8.9999 21.0829 8.9999 21.0829C8.9999 21.0829 0.899902 15.5829 0.899902 9.16626C0.899902 6.97822 1.75329 4.8798 3.27234 3.33263C4.79138 1.78545 6.85165 0.91626 8.9999 0.91626C11.1482 0.91626 13.2084 1.78545 14.7275 3.33263C16.2465 4.8798 17.0999 6.97822 17.0999 9.16626Z"
          stroke="#72777A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.9999 11.9163C10.4911 11.9163 11.6999 10.685 11.6999 9.16626C11.6999 7.64748 10.4911 6.41626 8.9999 6.41626C7.50873 6.41626 6.2999 7.64748 6.2999 9.16626C6.2999 10.685 7.50873 11.9163 8.9999 11.9163Z"
          stroke="#72777A"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_22429_9797">
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

export default LocationSvg;
