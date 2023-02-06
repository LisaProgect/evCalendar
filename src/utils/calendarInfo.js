import {
  addDays,
  format,
  startOfWeek,
  getWeek,
  getDay,
  subDays,
  getDaysInMonth,
  getWeeksInMonth,
  isToday,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  lastDayOfMonth,
  isSameDay,
} from "date-fns";

export default class CalendarInfo {
  static #daysInWeek = 7;
  static #monthOfYear = 12;
  #monthData = {};

  constructor() {
    this.dayNames = this.getDayNames();
  }

  getDayNames() {
    const firstDOW = startOfWeek(new Date());

    const weekdays = [...Array(CalendarInfo.#daysInWeek).keys()].map((_, day) =>
      format(addDays(firstDOW, day), "EEE")
    );

    return weekdays;
  }

  getMonthDates(year = 2000) {
    const dates = [];
    for (let i = 0; i < 12; i++) {
      dates.push(new Date(year, i, 15));
    }
    return dates;
  }

  getMonthComps(month, year) {
    const key = `${month}-${year}`;
    let comps = this.#monthData[key];
    if (!comps) {
      const firstDayOfMonth = new Date(year, month - 1, 1);
      const firstWeekday = getDay(firstDayOfMonth) + 1;
      const days = getDaysInMonth(firstDayOfMonth);
      const weeks = getWeeksInMonth(firstDayOfMonth);
      const weekNumbers = [...Array(weeks).keys()].map((week) =>
        getWeek(addDays(firstDayOfMonth, week * CalendarInfo.#daysInWeek))
      );
      comps = {
        firstWeekday,
        days,
        weeks,
        month,
        year,
        weekNumbers,
      };
      this.#monthData[key] = comps;
    }
    return comps;
  }

  getThisMonthComps() {
    const date = new Date();
    return this.getMonthComps(date.getMonth() + 1, date.getFullYear());
  }

  getPrevMonthComps(month, year) {
    if (month === 1) return this.getMonthComps(12, year - 1);
    return this.getMonthComps(month - 1, year);
  }

  getNextMonthComps(month, year) {
    if (month === 12) return this.getMonthComps(1, year + 1);
    return this.getMonthComps(month + 1, year);
  }

  getCalendarDays(weeks, monthComps) {
    const { firstWeekday, year, month } = monthComps;

    const currentDOM = new Date(year, month - 1, 1);

    let day = subDays(currentDOM, firstWeekday);
    let prevMonth = true;
    let thisMonth = false;
    let nextMonth = false;
    const firstDayNextMonth = addDays(lastDayOfMonth(currentDOM), 1);

    const days = [...Array(weeks)].reduce((acc) => {
      const weekDays = [...Array(CalendarInfo.#daysInWeek).keys()].map(() => {
        day = addDays(day, 1);
        let isLastDay = prevMonth ? false : isLastDayOfMonth(day);
        let isFirstDay = nextMonth ? false : isFirstDayOfMonth(day);

        if (isSameDay(currentDOM, day)) {
          prevMonth = false;
          thisMonth = true;
        }
        if (isSameDay(firstDayNextMonth, day)) {
          thisMonth = false;
          nextMonth = true;
        }
        return {
          id: format(day, "MM-dd-yyyy"),
          day: day.getDate(),
          label: format(day, "dd"),
          ariaLabel: format(day, "PPPP"),
          month: day.getMonth() + 1,
          year: day.getFullYear(),
          isToday: isToday(day),
          isFirstDay,
          isLastDay,
          weekDayPosition: day.getDay(),
          inMonth: thisMonth,
          inPrevMonth: prevMonth,
          inNextMonth: nextMonth,
        };
      });

      return [...acc, ...weekDays];
    }, []);
    return days;
  }

}
