import { useMemo } from "react";

const weekdaysUz = [
  "yakshanba",
  "dushanba",
  "seshanba",
  "chorshanba",
  "payshanba",
  "juma",
  "shanba",
];

const monthsUz = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avgust",
  "sentyabr",
  "oktyabr",
  "noyabr",
  "dekabr",
];

export function useUzbekDate(utcDateString: string | undefined) {
  const formatted = useMemo(() => {
    if (!utcDateString) return null;

    const date = new Date(utcDateString);

    // UTC+5 (Toshkent) vaqt zonasi
    const uzDate = new Date(date.getTime() + 5 * 60 * 60 * 1000);

    const day = uzDate.getDate();
    const month = monthsUz[uzDate.getMonth()];
    const weekday = weekdaysUz[uzDate.getDay()];

    return `${day}- ${month}, ${weekday}`;
  }, [utcDateString]);

  return formatted;
}
