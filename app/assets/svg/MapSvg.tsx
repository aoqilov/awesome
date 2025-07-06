import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}
const MapSvg: React.FC<IconProps> = ({
  width = 18,
  height = 16,
  color = "#6C7072",
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
      <g clipPath="url(#clip0_22166_9782)">
        <path
          d="M6.09091 12.2L1 15V3.8L6.09091 1M6.09091 12.2L11.9091 15M6.09091 12.2V1M11.9091 15L17 12.2V1L11.9091 3.8M11.9091 15V3.8M11.9091 3.8L6.09091 1"
          stroke="#6C7072"
          strokeWidth="0.9375"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_22166_9782">
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

export default MapSvg;
