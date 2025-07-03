/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from "@/hooks/translation";
import useNumberFormat from "@/hooks/useNumberFormat ";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const BASE_TIMES = [
  { time: "06–07", status: "available", number_forBack: 6 },
  { time: "07–08", status: "available", number_forBack: 7 },
  { time: "08–09", status: "available", number_forBack: 8 },
  { time: "09–10", status: "available", number_forBack: 9 },
  { time: "10–11", status: "available", number_forBack: 10 },
  { time: "11–12", status: "available", number_forBack: 11 },
  { time: "12–13", status: "available", number_forBack: 12 },
  { time: "13–14", status: "available", number_forBack: 13 },
  { time: "14–15", status: "available", number_forBack: 14 },
  { time: "15–16", status: "available", number_forBack: 15 },
  { time: "16–17", status: "available", number_forBack: 16 },
  { time: "17–18", status: "available", number_forBack: 17 },
  { time: "18–19", status: "available", number_forBack: 18 },
  { time: "19–20", status: "available", number_forBack: 19 },
  { time: "20–21", status: "available", number_forBack: 20 },
  { time: "21–22", status: "available", number_forBack: 21 },
  { time: "22–23", status: "available", number_forBack: 22 },
  { time: "23–00", status: "available", number_forBack: 23 },
];

const TimeGrid = ({
  activeField,
  dataOrder,
  selectedDate,
  getSelectedClock,
}: {
  activeField: any;
  dataOrder: any;
  selectedDate: any;
  getSelectedClock: (
    selectedTimes: { clock: number }[],
    totalPrice: number
  ) => void;
}) => {
  console.log("Active Field:", activeField);
  console.log("Data Order:", dataOrder);
  console.log("Selected Date:", selectedDate);
  const t = useTranslation();
  const formatMoney = useNumberFormat();
  const [times, setTimes] = useState(BASE_TIMES);
  const [selectedTimes, setSelectedTimes] = useState<{ clock: number }[]>([]);
  const totalPrice = selectedTimes.length * (activeField?.price || 0);

  // ⛔ Band bo'lgan vaqtlarni o'rnatish
  useEffect(() => {
    if (!activeField || !Array.isArray(dataOrder)) return;

    const updated = BASE_TIMES.map((time) => ({ ...time }));
    setSelectedTimes([]); // har doim yangi field uchun tozalash

    for (let i = 0; i < dataOrder.length; i++) {
      const order = dataOrder[i]?.expand?.order;
      const index = dataOrder[i]?.time_from - 6;
      if (updated[index]) {
        updated[index].status = order?.type === "reserve" ? "reserve" : "order";
      }
    }

    setTimes(updated);
  }, [dataOrder, activeField]);

  // ⏰ Bugungi kundagi o'tgan vaqtni aniqlash
  const isPastTime = (slotTime: string): boolean => {
    if (!selectedDate) return false;

    const now = dayjs();
    const localSelected = dayjs(selectedDate).subtract(5, "hour"); // UTC dan localga
    const isToday = now.isSame(localSelected, "day");

    if (!isToday) return false;

    const fromHour = Number(slotTime.split("–")[0]);
    const slotDate = localSelected.hour(fromHour).minute(0).second(0);

    return slotDate.isBefore(now);
  };

  // ✅ User tanlovni bosganda
  const handleSelect = (index: number) => {
    const updated = times.map((slot, i) => {
      if (i === index) {
        return {
          ...slot,
          status: slot.status === "selected" ? "available" : "selected",
        };
      }
      return slot;
    });
    setTimes(updated);

    const selected = updated
      .filter((slot) => slot.status === "selected")
      .map((slot) => ({
        clock: slot.number_forBack,
      }));

    setSelectedTimes(selected);

    // totalPrice ni hisoblash va parent componentga yuborish
    const newTotalPrice = selected.length * (activeField?.price || 0);
    getSelectedClock(selected, newTotalPrice);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "order":
        return "bg-red-200 border border-red-100 text-red-800 cursor-not-allowed";
      case "reserve":
        return "bg-yellow-200 border border-yellow-100 text-yellow-800 cursor-not-allowed";
      case "selected":
        return "bg-green-200 border border-green-300 text-green-800";
      case "available":
      default:
        return "bg-gray-200 border border-gray-300 text-gray-800";
    }
  };

  if (!activeField) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">
          {t({
            uz: "Maydon tanlanmagan",
            en: "No field selected",
            ru: "Поле не выбрано",
          })}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold">
          {t({ uz: "Vaqtlar", en: "Times", ru: "Время" })}
        </h4>
        <div className="flex items-center text-lg font-semibold gap-2 text-gray-500">
          {t({ uz: "Narxi:", en: "Price:", ru: "Цена:" })}{" "}
          <span className="text-green-600 font-semibold">
            {formatMoney(totalPrice)}
          </span>{" "}
          UZS
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded-2xl">
        {times.map((slot, index) => {
          const disabled =
            ["order", "reserve"].includes(slot.status) || isPastTime(slot.time);

          return (
            <button
              key={index}
              onClick={() => !disabled && handleSelect(index)}
              className={`px-2 py-4 text-[16px] rounded-[10px] font-medium text-center transition-all duration-200 ${getStatusClass(
                slot.status
              )} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={disabled}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default TimeGrid;
