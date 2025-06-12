import { useState, useEffect } from "react";

/**
 * Форматирует дату для языков uz, ru, en
 */
type Language = "uz" | "ru" | "en";

function tDate(date: Date, lang: Language = "uz") {
  const options = {
    uz: {
      day: "numeric" as const,
      month: "long" as const,
      weekday: "long" as const,
    },
    ru: {
      day: "numeric" as const,
      month: "long" as const,
      weekday: "long" as const,
    },
    en: {
      day: "numeric" as const,
      month: "short" as const,
      weekday: "short" as const,
    },
  };

  if (lang === "uz") {
    const monthsUz = [
      "yanvar",
      "fevral",
      "mart",
      "aprel",
      "may",
      "iyun",
      "iyul",
      "avgust",
      "sentabr",
      "oktabr",
      "noyabr",
      "dekabr",
    ];
    const weekdaysUz = [
      "yakshanba",
      "dushanba",
      "seshanba",
      "chorshanba",
      "payshanba",
      "juma",
      "shanba",
    ];
    const day = date.getDate();
    const month = monthsUz[date.getMonth()];
    const weekday = weekdaysUz[date.getDay()];
    return `${day}-${month}, ${weekday}`;
  }

  // Теперь TypeScript знает, что `options[lang]` безопасен
  return date.toLocaleDateString(lang, options[lang]);
}

/**
 * Форматирует время (например, "14:48")
 */
function formatTime(date: Date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function DateTimeWidget({ lang = "uz" as Language }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Обновляем время каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-4xl text-[#404446] font-bold">
        {formatTime(currentTime)}
      </h1>
      <p className="text-gray-500 text-[12px]">{tDate(currentTime, lang)}</p>
    </div>
  );
}
