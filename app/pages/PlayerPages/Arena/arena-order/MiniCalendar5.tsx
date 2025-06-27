// import { useEffect, useState } from "react";
// import { Calendar, Modal } from "antd";
// import dayjs from "dayjs";
// import "dayjs/locale/uz";
// import {
//   LeftOutlined,
//   RightOutlined,
//   CalendarOutlined,
// } from "@ant-design/icons";
// import { useTranslation } from "@/hooks/translation";

// dayjs.locale("uz");

// const CustomCalendar = ({
//   getCurrentData,
// }: {
//   getCurrentData: (date: string) => void;
// }) => {
//   const t = useTranslation();
//   const [startDate, setStartDate] = useState(dayjs().startOf("day"));
//   const [activeDate, setActiveDate] = useState(
//     dayjs().startOf("day").toISOString()
//   );

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handlePrev = () => setStartDate((prev) => prev.subtract(1, "day"));
//   const handleNext = () => setStartDate((prev) => prev.add(1, "day"));

//   const days = Array.from({ length: 5 }, (_, i) =>
//     dayjs(startDate).add(i, "day")
//   );
//   const todayFormatted = dayjs().format("D-MMMM, dddd"); // Masalan: 28-iyun, juma
//   useEffect(() => {
//     getCurrentData(activeDate);
//   }, [activeDate]);

//   return (
//     <div className="rounded-xl  w-full relative">
//       {/* Sarlavha va bugungi sana */}
//       <div className="flex justify-between items-center mb-3">
//         <h2 className="text-lg font-bold">
//           {t({ uz: "Kalendar", en: "Calendar", ru: "Календарь" })}
//         </h2>
//         <div className="flex items-center gap-2 text-sm text-gray-700">
//           <span className=" sm:inline">{todayFormatted} </span>
//           <CalendarOutlined
//             onClick={() => setIsModalOpen(true)}
//             className="cursor-pointer text-lg hover:text-blue-500"
//           />
//         </div>
//       </div>

//       {/* 5 kunlik qator */}
//       <div className="px-2 py-1 flex gap-2 items-center justify-between h-[76px] w-full bg-white shadow-md rounded-xl">
//         {/* Oldinga tugma */}
//         <button
//           onClick={handlePrev}
//           className="min-w-[30px] h-full flex items-center justify-center rounded-l-xl bg-gray-50"
//         >
//           <LeftOutlined />
//         </button>

//         {/* Kunlar */}
//         {days.map((day) => {
//           const formatted = day.format("YYYY-MM-DD");
//           const doneFormated = `${formatted}T00:00:00.000Z`;
//           const isActive = activeDate === doneFormated;

//           return (
//             <button
//               key={formatted}
//               onClick={() => {
//                 getCurrentData(doneFormated);
//                 setActiveDate(doneFormated);
//               }}
//               className={`max-w-15 h-full border rounded-lg p-2  text-center transition-all ${
//                 isActive
//                   ? "border-green-500 bg-green-100"
//                   : "border-gray-300 bg-gray-50 hover:bg-gray-100"
//               }`}
//             >
//               <div className="text-sm text-gray-500 font-medium">
//                 {day.format("ddd")}
//               </div>
//               <div className="mt-2 text-xl font-semibold text-gray-800">
//                 {day.format("DD")}
//               </div>
//             </button>
//           );
//         })}

//         {/* Keyingisi tugma */}
//         <button
//           onClick={handleNext}
//           className="min-w-[30px] h-full flex items-center justify-center rounded-r-xl bg-gray-50"
//         >
//           <RightOutlined />
//         </button>
//       </div>

//       {/* To‘liq kalendar modal */}
//       {/* To‘liq kalendar modal */}
//       <Modal
//         title="To‘liq kalendar"
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         footer={null}
//         width={800}
//       >
//         <Calendar
//           fullscreen
//           value={dayjs(activeDate)}
//           onSelect={(date) => {
//             const formatted = date.startOf("day").toISOString(); // ✅
//             setActiveDate(formatted);
//             setStartDate(date.startOf("day"));
//             getCurrentData(formatted);
//             setIsModalOpen(false);
//           }}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default CustomCalendar;

/* === ✅ 1. CustomCalendar.tsx === */
import { useEffect, useState } from "react";
import { Calendar, Modal } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/uz";
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useTranslation } from "@/hooks/translation";

dayjs.locale("uz");

const CustomCalendar = ({
  getCurrentData,
}: {
  getCurrentData: (date: string) => void;
}) => {
  const t = useTranslation();
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [activeDate, setActiveDate] = useState(
    dayjs().startOf("day").add(5, "hour").toISOString()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrev = () => setStartDate((prev) => prev.subtract(1, "day"));
  const handleNext = () => setStartDate((prev) => prev.add(1, "day"));
  const days = Array.from({ length: 5 }, (_, i) =>
    dayjs(startDate).add(i, "day")
  );

  useEffect(() => {
    getCurrentData(activeDate);
  }, [activeDate]);

  return (
    <div className="rounded-xl w-full relative">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">
          {t({
            uz: "Kalendar",
            en: "Calendar",
            ru: "\u041a\u0430\u043b\u0435\u043d\u0434\u0430\u0440\u044c",
          })}
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>{dayjs().format("D-MMMM, dddd")}</span>
          <CalendarOutlined
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer text-lg hover:text-blue-500"
          />
        </div>
      </div>

      <div className="px-2 py-1 flex gap-2 items-center justify-between h-[76px] w-full bg-white shadow-md rounded-xl">
        <button
          onClick={handlePrev}
          className="min-w-[30px] h-full flex items-center justify-center rounded-l-xl bg-gray-50"
        >
          <LeftOutlined />
        </button>

        {days.map((day) => {
          const doneFormatted = day.startOf("day").add(5, "hour").toISOString();
          const isActive = activeDate === doneFormatted;

          return (
            <button
              key={doneFormatted}
              onClick={() => {
                setActiveDate(doneFormatted);
                getCurrentData(doneFormatted);
              }}
              className={`max-w-15 h-full border rounded-lg p-2 text-center transition-all ${
                isActive
                  ? "border-green-500 bg-green-100"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="text-sm text-gray-500 font-medium">
                {day.format("ddd")}
              </div>
              <div className="mt-2 text-xl font-semibold text-gray-800">
                {day.format("DD")}
              </div>
            </button>
          );
        })}

        <button
          onClick={handleNext}
          className="min-w-[30px] h-full flex items-center justify-center rounded-r-xl bg-gray-50"
        >
          <RightOutlined />
        </button>
      </div>

      <Modal
        title="To‘liq kalendar"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <Calendar
          fullscreen
          value={dayjs(activeDate)}
          onSelect={(date) => {
            const formatted = date.startOf("day").add(5, "hour").toISOString();
            setActiveDate(formatted);
            setStartDate(date.startOf("day"));
            getCurrentData(formatted);
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default CustomCalendar;
