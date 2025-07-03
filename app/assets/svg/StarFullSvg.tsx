import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}
const StarFullSvg: React.FC<IconProps> = ({
  width = 20,
  height = 20,
  color = "orange",
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      viewBox="0 0 24 24"
      strokeWidth={0}
      stroke="orange"
      className={className}
      width={width}
      height={height}
    >
      <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
};

export default StarFullSvg;
