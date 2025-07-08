export const formatTime = (time?: string | number) => {
  if (!time) return "";
  const hour = String(time).padStart(2, "0"); // 6 => "06"
  return `${hour}:00`;
};
