import BootsMin from "@/assets/boots/bootsMin";
import CalendarSvg from "@/assets/svg/CalendarSvg";
import LocationSvg from "@/assets/svg/LocationSvg";
import StarFullSvg from "@/assets/svg/StarFullSvg";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/translation";

const OrderCard: React.FC = () => {
  const t = useTranslation();
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
            <h1 className="font-semibold text-sm">SmartArena</h1>
            <StarFullSvg color="#FFB323" width={20} />
            <h1>4.9</h1>
          </div>
          <div className="flex items-center justify-start gap-2 ">
            <LocationSvg width={20} />{" "}
            <div>
              <h1>
                {t({
                  uz: "Toshkent shahri",
                  en: "Tashkent city",
                  ru: "Город Ташкент",
                })}
              </h1>
              <p className="text-[12px]">
                {t({
                  uz: "Bektemir tumani",
                  en: "Bektemir district",
                  ru: "Бектемирский район",
                })}
              </p>
            </div>
          </div>
        </div>
        <div>
          {" "}
          <div className="bg-[#F2F4F5] rounded-md px-2">
            {t({ uz: "000 000 uzs", en: "000 000 UZS", ru: "000 000 сум" })}
          </div>
          <div className="flex justify-end mt-2 gap-1 items-center">
            <BootsMin />
            <h1 className="text-sm my-1">
              {t({ uz: "8-maydon", en: "Field 8", ru: "Поле 8" })}
            </h1>
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
          <h1 className="text-sm">
            {t({
              uz: "00.00, chorshanba",
              en: "00.00, Wednesday",
              ru: "00.00, среда",
            })}
          </h1>
        </div>
        <div className="bg-green-500/20 text-center px-1 text-green-500 rounded-md ">
          00:00-00:00
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;
