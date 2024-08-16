import { isHoliday } from "./isHoliday";

export function myFunction() {
  const today = new Date();
  const nextDay = new Date();
  nextDay.setMonth(nextDay.getMonth() + 2);

  console.log("today", today);
  console.log("nextDay", nextDay);
  const ish = isHoliday(today.getFullYear(), today.getMonth(), today.getDate());
  console.log("isHoliday", ish);
}
