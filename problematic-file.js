"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPeriodRange =
  exports.getFullWeekDates =
  exports.fromWeekId =
  exports.weekNumber =
    void 0;
function weekNumber(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  // @ts-expect-error TS doesn't like math on date's
  const num = d - new Date(d.getFullYear(), 0, 1);
  return Math.ceil((num / 8.64e7 + 1) / 7);
}
exports.weekNumber = weekNumber;
function yearNumber(date = new Date(), weekNum) {
  // if the first week of the new year started in the previous year, return the new year
  if (weekNum === 1 && date > new Date(date.getFullYear(), 11, 25)) {
    return date.getFullYear() + 1;
  }
  // if the last week of the previous year continues into the new year, return the previous year
  if (weekNum === 53 && date < new Date(date.getFullYear(), 1, 6)) {
    return date.getFullYear() - 1;
  }
  return date.getFullYear();
}
function getWeekId(date = new Date()) {
  const weekNum = weekNumber(date);
  return `${yearNumber(date, weekNum)}${weekNum}`;
}
exports.default = getWeekId;
function getFirstDayOfYear(year) {
  return new Date(year, 0, 0).getDay();
}
function fromWeekId(weekId) {
  const year = parseInt(weekId.slice(0, 4), 10);
  const weekNum = parseInt(weekId.substr(4), 10);
  const dateFromFirstMonday = getFirstMondayOfYear(year);
  dateFromFirstMonday.setDate(
    dateFromFirstMonday.getDate() + (weekNum - 1) * 7
  );
  const date = checkFirstDayOfWeekInThisYear(year)
    ? dateFromFirstMonday
    : new Date(year, 0, 1 - getFirstDayOfYear(year) + (weekNum - 1) * 7);
  const dow = date.getDay();
  // Start the day on the correct Monday
  if (dow <= 4) {
    date.setDate(date.getDate() - date.getDay() + 1);
  } else {
    date.setDate(date.getDate() + 8 - date.getDay());
  }
  return date;
}
exports.fromWeekId = fromWeekId;
const checkFirstDayOfWeekInThisYear = (year) => {
  const janFirst = new Date(year, 0, 1);
  const janFirstWeekNum = weekNumber(janFirst);
  return !(janFirst.getDay() !== 1 && janFirstWeekNum === 1);
};
const getFirstMondayOfYear = (year) => {
  const date = new Date(year, 0, 1);
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1);
  }
  return date;
};
function getFullWeekDates(weekId) {
  const year = parseInt(weekId.slice(0, 4), 10);
  const weekNum = parseInt(weekId.substr(4), 10);
  const dateFromFirstMonday = getFirstMondayOfYear(year);
  dateFromFirstMonday.setDate(
    dateFromFirstMonday.getDate() + (weekNum - 1) * 7
  );
  const date = checkFirstDayOfWeekInThisYear(year)
    ? dateFromFirstMonday
    : new Date(year, 0, 1 - getFirstDayOfYear(year) + (weekNum - 1) * 7);
  const endDate = new Date(date.getTime());
  endDate.setDate(endDate.getDate() + 6);
  const weekStartDate = date.toISOString().split("T")[0];
  const weekEndDate = endDate.toISOString().split("T")[0];
  return { weekStartDate, weekEndDate };
}
exports.getFullWeekDates = getFullWeekDates;
function getPeriodRange(weekId) {
  const dateWeek = getFullWeekDates(weekId);
  const [periodStart, periodEnd] = [
    dateWeek.weekStartDate,
    dateWeek.weekEndDate,
  ].map((d) =>
    new Date(Date.parse(d)).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    })
  );
  return {
    periodStart,
    periodEnd,
  };
}
exports.getPeriodRange = getPeriodRange;
//# sourceMappingURL=index.js.map
