export const convertTo12HourFormat = (time24: string): string => {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // convert "00" to "12"
  return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
};
