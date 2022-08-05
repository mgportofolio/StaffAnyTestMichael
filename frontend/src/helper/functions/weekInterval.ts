import format from "date-fns/format";

export const getWeeklyRange = (dateParam?: Date) => {
    if(dateParam === undefined){
        dateParam = new Date();
    }
    const firstDay = dateParam.getDate() - dateParam.getDay() + 1;
    return {firstRange: new Date(dateParam.setDate(firstDay)), lastRange: new Date(dateParam.setDate(firstDay + 6))};
};

export const getWeeklyIntervalByDate = (dateParam: Date) => {
    const weeklyRange = getWeeklyRange(dateParam);
    const weeklyInterval = format(weeklyRange.firstRange!, "yyyy-MM-dd") + "|" + format(weeklyRange.lastRange!, "yyyy-MM-dd")
    return weeklyInterval;
};

export const getWeeklyIntervalByWeekRange = (firstRange: Date, lastRange: Date) => {
    const weeklyInterval = format(firstRange!, "yyyy-MM-dd") + "|" + format(lastRange!, "yyyy-MM-dd")
    return weeklyInterval;
};

export const FormatDatesToWeekRange = (start: Date, end: Date) => {
  const dayStart = start.getDate();
  const monStart = start.toLocaleString('default', { month: 'short' });
  const dayEnd = end.getDate();
  const monEnd = end.toLocaleString('default', { month: 'short' });
  return (monStart + " " + dayStart + " - " + monEnd + " " + dayEnd);
}