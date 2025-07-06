import { Calendar, Modal } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/uz";
import { CalendarOutlined } from "@ant-design/icons";
import { useTranslation } from "@/hooks/translation";
import { useEffect, useRef, useState } from "react";

dayjs.locale("uz");

const CustomCalendar = ({
  getCurrentData,
}: {
  getCurrentData: (date: string) => void;
}) => {
  const t = useTranslation();
  const today = dayjs().startOf("day");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [startDate] = useState(today); // markaz — bugungi kun
  const [activeDate, setActiveDate] = useState(
    today.add(5, "hour").toISOString()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ -10 dan +30 kungacha massiv
  const days = Array.from({ length: 41 }, (_, i) =>
    dayjs(startDate).add(i - 10, "day")
  );

  useEffect(() => {
    getCurrentData(activeDate);
  }, [activeDate]);

  // ✅ Scroll startni bugungi kunga to‘g‘rilash (1-chi bo‘lishi uchun)
  useEffect(() => {
    setTimeout(() => {
      const el = scrollRef.current?.querySelector('[data-today="true"]');
      el?.scrollIntoView({ behavior: "smooth", inline: "start" });
    }, 100);
  }, []);

  return (
    <div className="rounded-xl w-full relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">
          {t({ uz: "Kalendar", en: "Calendar", ru: "Календарь" })}
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>{dayjs(activeDate).format("D-MMMM, dddd")}</span>

          <CalendarOutlined
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer text-lg hover:text-blue-500"
          />
        </div>
      </div>

      {/* Scrollable kunlar */}
      <div className="bg-white shadow-md rounded-xl px-2 py-1">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide gap-2 scroll-snap-x snap-mandatory scroll-smooth px-1 pb-2"
        >
          {days.map((day) => {
            const doneFormatted = day
              .startOf("day")
              .add(5, "hour")
              .toISOString();
            const isActive = activeDate === doneFormatted;
            const isPast = day.isBefore(today, "day");
            const isToday = day.isSame(today, "day");

            return (
              <button
                key={doneFormatted}
                onClick={() => {
                  if (!isPast) {
                    setActiveDate(doneFormatted);
                    getCurrentData(doneFormatted);
                  }
                }}
                disabled={isPast}
                data-today={isToday || undefined} // For auto-scroll
                className={`min-w-[72px] flex-shrink-0 h-[64px] border rounded-lg p-2 text-center scroll-snap-start transition-all
                  ${
                    isPast
                      ? "bg-orange-50 text-gray-300 border-orange-100 cursor-not-allowed"
                      : isActive
                      ? "border-green-500 bg-green-100"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  }`}
              >
                <div className="text-sm font-medium">{day.format("ddd")}</div>
                <div className="mt-2 text-xl font-semibold">
                  {day.format("DD")}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
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
          disabledDate={(current) => current && current.isBefore(today, "day")}
          onSelect={(date) => {
            const formatted = date.startOf("day").add(5, "hour").toISOString();
            setActiveDate(formatted);
            getCurrentData(formatted);
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default CustomCalendar;
