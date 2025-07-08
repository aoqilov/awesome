import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}
const ShareSvg: React.FC<IconProps> = ({
  width = 14,
  height = 16,
  color = "#0078FF",
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 16"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_21750_10757)">
        <path
          d="M4.72667 9.057L9.28 11.843M9.27333 4.157L4.72667 6.943M13 3.1C13 4.2598 12.1046 5.2 11 5.2C9.89543 5.2 9 4.2598 9 3.1C9 1.9402 9.89543 1 11 1C12.1046 1 13 1.9402 13 3.1ZM5 8C5 9.1598 4.10457 10.1 3 10.1C1.89543 10.1 1 9.1598 1 8C1 6.8402 1.89543 5.9 3 5.9C4.10457 5.9 5 6.8402 5 8ZM13 12.9C13 14.0598 12.1046 15 11 15C9.89543 15 9 14.0598 9 12.9C9 11.7402 9.89543 10.8 11 10.8C12.1046 10.8 13 11.7402 13 12.9Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_21750_10757">
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

export default ShareSvg;
