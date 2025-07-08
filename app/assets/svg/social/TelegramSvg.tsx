import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  activeColor?: boolean;
}

const TelegramSvg: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#AEAFB0",
  activeColor = true,
  className,
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0)">
        <path
          d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
          fill={activeColor ? "#2AABEE" : color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.89368 12.1659C8.38334 10.4724 10.7103 9.356 11.8746 8.81659C15.199 7.27646 15.8897 7.00893 16.34 7.00009C16.439 6.99815 16.6604 7.02549 16.8038 7.15511C16.9249 7.26457 16.9583 7.41242 16.9742 7.5162C16.9902 7.61997 17.01 7.85637 16.9942 8.04108C16.8141 10.1494 16.0346 15.2657 15.638 17.6271C15.4702 18.6263 15.1398 18.9613 14.8199 18.9941C14.1248 19.0653 13.5969 18.4823 12.9236 17.9908C11.8701 17.2215 11.2749 16.7426 10.2522 15.992C9.07035 15.1245 9.8365 14.6477 10.51 13.8685C10.6863 13.6646 13.7492 10.5615 13.8084 10.28C13.8159 10.2448 13.8227 10.1136 13.7527 10.0443C13.6828 9.97498 13.5794 9.99868 13.5049 10.0175C13.3992 10.0442 11.7162 11.2833 8.45566 13.7348C7.97793 14.1002 7.54521 14.2783 7.1575 14.2689C6.7301 14.2586 5.90793 13.9998 5.29673 13.7785C4.54708 13.507 3.95127 13.3635 4.00315 12.9026C4.03017 12.6625 4.32702 12.4169 4.89368 12.1659Z"
          fill="white"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="12"
          y1="0"
          x2="12"
          y2="23.822"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="##AEAFB0" />
          <stop offset="1" stopColor="#AEAFB0" />
        </linearGradient>
        <clipPath id="clip0">
          <rect width={width} height={height} fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
};

export default TelegramSvg;
