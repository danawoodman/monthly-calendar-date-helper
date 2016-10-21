const range = require('array-range')
const getLastDay = require('get-last-date-of-month')
const splitArray = require('split-array')

module.exports = function calendarDates(month, year, options = { split: false }) {

  // Make creating dates a little simpler
  function date() {
    return new Date(year, ...arguments)
  }

  // This month
  const monthIndex = month - 1
  const firstDay = date(monthIndex, 1)
  const firstDayIndex = firstDay.getDay()
  const lastDay = getLastDay(firstDay)
  const lastDayIndex = lastDay.getDay()
  let days = range(lastDay.getDate()).map((day) => date(monthIndex, day + 1))

  // Next month
  const nextMonthIndex = monthIndex === 11 ? 0 : monthIndex + 1

  // Previous month
  const prevMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1
  const prevMonthLast = getLastDay(new Date((prevMonthIndex === 12 ? year - 1 : year), monthIndex - 1))

  // Add previous month days to pad calendar.
  if (firstDayIndex !== 0) {
    const prevMonthYear = month === 1 ? year - 1 : year
    const prevMonthDays = range(firstDayIndex)
      .reverse()
      .map((day) => new Date(prevMonthYear, prevMonthIndex, prevMonthLast.getDate() - day))
    days.unshift(...prevMonthDays)
  }

  // Add next month days to pad calendar.
  if (lastDayIndex !== 6) {
    const nextMonthDays = range(6 - lastDayIndex)
      .map((day) => new Date((nextMonthIndex === 0 ? year - 1 : year), nextMonthIndex, day + 1))
    days.push(...nextMonthDays)
  }

  // Fill in the final week if the month ends early.
  const fillLastWeek = days.length <= (5 * 7) // 5 weeks x 7 days a week
  if (fillLastWeek) {

    // Calculate the date to show in the new row, whether it be the first of the month
    // or some day into the month.
    const lastDateInArray = days[days.length - 1].getDate()
    const startingDateInRow = lastDateInArray === lastDay.getDate() ? 1 : lastDateInArray + 1

    // If the next month is in the new year, increment the year
    // number.
    const nextMonthYear = nextMonthIndex === 0 ? year + 1 : year

    const lastWeekFill = range(startingDateInRow, startingDateInRow + 7)
      .map((day, i) => new Date(nextMonthYear, nextMonthIndex, day))
    days.push(...lastWeekFill)
  }

  // Optionally split the list of dates up by week for conveinence.
  if (options && options.split) {
    days = splitArray(days, 7)
  }

  return days
}

