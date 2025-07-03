import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  activeColor?: boolean;
}
const YoutubeSvg: React.FC<IconProps> = ({
  width = 24,
  height = 24,
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
      <path
        d="M23.4982 6.44323C23.3625 5.92235 23.0951 5.44696 22.7227 5.06464C22.3503 4.68232 21.8861 4.40647 21.3764 4.26472C19.5 3.75 12 3.75 12 3.75C12 3.75 4.5 3.75 2.62364 4.26472C2.11393 4.40647 1.64966 4.68232 1.27729 5.06464C0.904916 5.44696 0.637506 5.92235 0.501818 6.44323C5.96046e-08 8.36577 0 12.375 0 12.375C0 12.375 5.96046e-08 16.3842 0.501818 18.3068C0.637506 18.8277 0.904916 19.303 1.27729 19.6854C1.64966 20.0677 2.11393 20.3435 2.62364 20.4853C4.5 21 12 21 12 21C12 21 19.5 21 21.3764 20.4853C21.8861 20.3435 22.3503 20.0677 22.7227 19.6854C23.0951 19.303 23.3625 18.8277 23.4982 18.3068C24 16.3842 24 12.375 24 12.375C24 12.375 24 8.36577 23.4982 6.44323Z"
        fill={activeColor ? "red" : "#CDCFD0"}
      />
      <path d="M9.75 15.75V9L15.75 12.375L9.75 15.75Z" fill="#FEFEFE" />
    </svg>
  );
};

export default YoutubeSvg;
