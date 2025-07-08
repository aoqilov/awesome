/* eslint-disable @typescript-eslint/no-explicit-any */
import BootsBig from "@/assets/boots/bootsBig";
import BootsMin from "@/assets/boots/bootsMin";
import useNumberFormat from "@/hooks/useNumberFormat ";

const SetactveCard = ({
  field,
  onClick,
  getActiveField,
}: {
  field: any;
  onClick: () => void;
  getActiveField?: (field: any) => void;
}) => {
  const formatMoney = useNumberFormat();
  if (field && typeof getActiveField === "function") {
    getActiveField(field);
  }
  return (
    <div
      onClick={onClick}
      className="min-w-[150px] min-h-[70px] bg-green-50 border-2 border-green-500 rounded-xl shadow-sm flex items-start gap-1"
    >
      <div className="h-full border-r-1 border-green-500 border-dashed flex flex-col items-center justify-between p-2 w-[70%] ">
        <h4 className="text-sm font-semibold">{field.name}</h4>
        <p className="text-sm font-semibold text-green-600">
          {formatMoney(field.price)}
        </p>
      </div>
      <div className="flex flex-col items-center justify-between w-[30%] h-full p-2">
        <p className="text-sm font-medium text-gray-700">
          {field?.expand.size.name}
        </p>
        <div className="mb-1">
          {field.type === "grass" ? <BootsBig /> : <BootsMin />}
        </div>
      </div>
    </div>
  );
};
export default SetactveCard;
