/* eslint-disable @typescript-eslint/no-explicit-any */
import BootsBig from "@/assets/boots/bootsBig";
import BootsMin from "@/assets/boots/bootsMin";

const SetDefaultCard = ({
  field,
  onClick,
}: {
  field: any;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="min-w-[60px] min-h-[70px] px-9 border border-gray-300 bg-white rounded-xl hover:bg-gray-50 p-2 flex flex-col items-center justify-center cursor-pointer text-center"
  >
    <h4 className="text-sm font-semibold  mb-2">{field.name}</h4>

    <div className="mb-1">
      {field.type === "grass" ? <BootsBig /> : <BootsMin />}
    </div>
  </div>
);
export default SetDefaultCard;
