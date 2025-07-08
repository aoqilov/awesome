import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}
const StadionSvgBlue: React.FC<IconProps> = ({
  width = 24,
  height = 18,
  color = "#fff",
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 24 18"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.75 16L0.749999 2C0.749999 1.30964 1.30964 0.75 2 0.75L22 0.749999C22.6904 0.749999 23.25 1.30964 23.25 2L23.25 16C23.25 16.6904 22.6904 17.25 22 17.25L2 17.25C1.30964 17.25 0.75 16.6904 0.75 16Z"
        stroke="#0078FF"
        stroke-width="1.5"
      />
      <path
        d="M0 13L3 13C3.55229 13 4 12.5523 4 12L4 6C4 5.44772 3.55228 5 3 5L-3.49691e-07 5"
        stroke="#0078FF"
        stroke-width="1.5"
      />
      <path
        d="M24 5L21 5C20.4477 5 20 5.44772 20 6L20 12C20 12.5523 20.4477 13 21 13L24 13"
        stroke="#0078FF"
        stroke-width="1.5"
      />
      <path d="M12 18L12 5.36442e-07" stroke="#0078FF" stroke-width="1.5" />
      <path
        d="M8.75 9C8.75 7.20508 10.2051 5.75 12 5.75C13.7949 5.75 15.25 7.20507 15.25 9C15.25 10.7949 13.7949 12.25 12 12.25C10.2051 12.25 8.75 10.7949 8.75 9Z"
        stroke="#0078FF"
        stroke-width="1.5"
      />
    </svg>
  );
};

export default StadionSvgBlue;
