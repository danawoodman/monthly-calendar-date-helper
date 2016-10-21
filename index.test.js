const assert = require('assert')
const calendarDates = require('./index')

describe('monthly-calendar-date-helper', () => {

  it('should always return 42 days', () => {
    assert.equal(calendarDates(3, 2015).length, 42)
    assert.equal(calendarDates(1, 2016).length, 42)
    assert.equal(calendarDates(7, 2016).length, 42)
    assert.equal(calendarDates(12, 2016).length, 42)
  })

  it('should always start on Sunday and end on Saturday', () => {
    const dates = calendarDates(12, 2016)
    const first = dates[0]
    const last = dates[41]
    assert.equal(first.getDay(), 0)
    assert.equal(last.getDay(), 6)
  })

  it('should handle next year roll over', () => {
    const dates = calendarDates(12, 2016)
    const last = dates[41]
    assert.equal(last.getFullYear(), 2017)
  })

  it('should handle previous year roll over', () => {
    const dates = calendarDates(1, 2016)
    const first = dates[0]
    assert.equal(first.getFullYear(), 2015)
  })

  context('split option', () => {
    it('should split array into week chunks if the option is present', () => {
      const dates = calendarDates(4, 2016, { split: true })
      assert.equal(dates.length, 6)
      assert.equal(dates[0].length, 7)
    })
  })
})
