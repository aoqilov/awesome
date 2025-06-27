import React from "react";
interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}
const EditSvg: React.FC<IconProps> = ({
  width = 20,
  height = 20,
  color = "black",
  className = "",
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_22419_9726)">
        <path
          d="M9.091 2.72754H2.72736C2.24515 2.72754 1.78269 2.9191 1.44171 3.26008C1.10074 3.60105 0.90918 4.06351 0.90918 4.54573V17.273C0.90918 17.7552 1.10074 18.2177 1.44171 18.5586C1.78269 18.8996 2.24515 19.0912 2.72736 19.0912H15.4546C15.9368 19.0912 16.3993 18.8996 16.7403 18.5586C17.0813 18.2177 17.2728 17.7552 17.2728 17.273V10.9094M15.9092 1.36391C16.2708 1.00225 16.7614 0.799072 17.2728 0.799072C17.7843 0.799072 18.2748 1.00225 18.6365 1.36391C18.9981 1.72557 19.2013 2.21608 19.2013 2.72754C19.2013 3.23901 18.9981 3.72952 18.6365 4.09118L10.0001 12.7275L6.36373 13.6366L7.27282 10.0003L15.9092 1.36391Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_22419_9726">
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

export default EditSvg;
