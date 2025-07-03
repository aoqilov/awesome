import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}
const BatafsilSvg: React.FC<IconProps> = ({
  width = 18,
  height = 16,
  color = "#0078FF",
  className = "",
}) => {
  return (
    <svg
      width="18"
      height="16"
      viewBox="0 0 18 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_22124_10013)">
        <path
          d="M6.51357 15.3687H11.4873C15.632 15.3687 17.2899 13.895 17.2899 10.2108V5.78973C17.2899 2.10552 15.632 0.631836 11.4873 0.631836H6.51357C2.36883 0.631836 0.710938 2.10552 0.710938 5.78973V10.2108C0.710938 13.895 2.36883 15.3687 6.51357 15.3687Z"
          stroke="#0078FF"
          strokeWidth="1.3125"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.3135 8H12.3203"
          stroke="#0078FF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.99609 8H9.00304"
          stroke="#0078FF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.67993 8H5.625"
          stroke="#0078FF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_22124_10013">
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

export default BatafsilSvg;
