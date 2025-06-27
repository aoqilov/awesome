import { useEffect, useState } from "react";
import dayjs from "dayjs";

export const useCalendarData = (startDate: string) => {
  const [events, setEvents] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulated API call
    setTimeout(() => {
      setEvents({
        [startDate]: ["Mashg'ulot", "Uchrashuv"],
        [dayjs(startDate).add(2, "day").format("YYYY-MM-DD")]: ["Turnir"],
      });
      setLoading(false);
    }, 500);
  }, [startDate]);

  return { events, loading };
};
