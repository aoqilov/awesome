import BootsMin from "@/assets/boots/bootsMin";
import CalendarSvg from "@/assets/svg/CalendarSvg";
import LocationSvg from "@/assets/svg/LocationSvg";
import StarFullSvg from "@/assets/svg/StarFullSvg";
import { motion } from "framer-motion";
import { DeepOrderType } from "@/types/pocketbaseTypes";
import useNumberFormat from "@/hooks/useNumberFormat ";
import BootsBig from "@/assets/boots/bootsBig";
import dayjs from "dayjs";
import "dayjs/locale/uz"; // yoki 'ru', 'en', qaysi til kerak bo‘lsa
dayjs.locale("uz");

interface OrderCardProps {
  item: DeepOrderType;
}

const OrderCard: React.FC<OrderCardProps> = ({ item }) => {
  console.log(item?.expand?.field?.name);
  console.log("OrderCard item", item);
  const formatMoney = useNumberFormat();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className=" mb-3  flex flex-col items-center justify-center bg-white rounded-lg  shadow-md p-4"
    >
      {/* Top Section */}
      <div className="w-full flex items-start justify-between ">
        <div>
          <div className="flex items-center justify-start gap-2">
            <h1 className="font-semibold text-sm">
              {item?.expand?.field?.expand?.stadium?.name}
            </h1>
            <StarFullSvg color="#FFB323" width={20} />
            <h1>{item?.expand?.field?.expand?.stadium?.score}</h1>
          </div>
          <div className="flex items-center justify-start gap-2 ">
            <LocationSvg width={20} />{" "}
            <div>
              <h1>
                {
                  item?.expand?.field?.expand?.stadium?.expand?.city?.expand
                    ?.region?.expand?.name.key
                }
              </h1>
              <p className="text-[12px]">
                {item?.expand?.field?.expand?.stadium?.expand?.city?.expand
                  ?.name?.key ?? ""}{" "}
                tumani
              </p>
            </div>
          </div>
        </div>
        <div>
          {" "}
          <div className="bg-[#F2F4F5] rounded-md px-2">
            {formatMoney(item?.totalPrice ?? 0)} SO'M
          </div>
          <div className="flex justify-end mt-2 gap-1 items-center">
            {item?.expand?.field?.type == "grass" ? <BootsBig /> : <BootsMin />}

            <h1 className="text-sm my-1">{item?.expand?.field?.name}</h1>
          </div>
        </div>
      </div>
      <div
        className="relative w-full my-2"
        style={{
          borderWidth: "0.5px",
          borderStyle: "dashed",
          borderImage:
            "repeating-linear-gradient(to right, #22c55e 0, #22c55e 4px, transparent 4px, transparent 8px) 1",
        }}
      >
        <div className="absolute rounded-r-full w-5 h-5 bg-gradient-to-br from-gray-50 to-gray-100 -mt-2 -left-6.5"></div>
        <div className="absolute rounded-l-full w-5 h-5 bg-gradient-to-br from-gray-50 to-gray-100 -mt-2 -right-6.5"></div>
      </div>

      {/* Bottom Section */}
      <div className="w-full flex items-center justify-between ">
        {" "}
        <div className="flex items-center justify-between gap-1">
          <CalendarSvg />
          <h1 className="text-sm">{dayjs(item?.date).format("DD.MM, dddd")}</h1>
        </div>
        <div className="bg-green-500/20 text-center px-1 text-green-500 rounded-md ">
          00:00-00:00
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;
