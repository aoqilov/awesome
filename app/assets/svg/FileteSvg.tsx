import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}
const FileterSvg: React.FC<IconProps> = ({
  width = 18,
  height = 16,
  color = "#42BA3D",
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
      <g clipPath="url(#clip0_22166_9789)">
        <path
          d="M17.0999 13.2363L10.7999 13.2363M7.1999 13.2363L0.899902 13.2363M17.0999 7.99995L8.9999 7.99995M5.3999 7.99995L0.899902 7.99995M17.0999 2.76359L12.5999 2.76359M8.9999 2.76359L0.899903 2.76359M10.7999 15.2L10.7999 11.2727M5.3999 9.96359L5.3999 6.03632M12.5999 4.72722L12.5999 0.799951"
          stroke={color}
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_22166_9789">
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

export default FileterSvg;
