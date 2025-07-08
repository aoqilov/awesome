import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  activeColor?: boolean;
}
const FacebookSvg: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "currentColor",
  className,
  activeColor = false,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_21736_10602)">
        <path
          d="M23.9995 12.0441C23.9995 5.39238 18.627 0 11.9998 0C5.37253 0 0 5.39238 0 12.0441C0 17.6923 3.87448 22.4319 9.1011 23.7336V15.7248H6.62675V12.0441H9.1011V10.4581C9.1011 6.35879 10.9495 4.45872 14.9594 4.45872C15.7197 4.45872 17.0315 4.60855 17.5681 4.75789V8.0941C17.2849 8.06423 16.7929 8.0493 16.1819 8.0493C14.2144 8.0493 13.4541 8.79748 13.4541 10.7424V12.0441H17.3737L16.7003 15.7248H13.4541V24C19.3959 23.2798 24 18.202 24 12.0441H23.9995Z"
          fill={activeColor ? "#1877F2" : color}
        />
        <path
          d="M16.4172 15.6917L17.0634 12.0353H13.302V10.7422C13.302 8.81015 14.0316 8.0669 15.9197 8.0669C16.5061 8.0669 16.9782 8.08174 17.25 8.11141V4.7972C16.735 4.64836 15.4761 4.5 14.7465 4.5C10.8984 4.5 9.12453 6.38754 9.12453 10.4598V12.0353H6.75V15.6917H9.12453V23.6478C10.0154 23.8775 10.9472 24 11.9063 24C12.3784 24 12.8441 23.9698 13.3015 23.9124V15.6917H16.4167H16.4172Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_21736_10602">
          <rect
            width={width}
            height={height}
            fill="white"
            className={className}
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default FacebookSvg;
