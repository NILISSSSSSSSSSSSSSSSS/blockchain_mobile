import { timeFormat } from '../../assets/js/time'

describe('test timeFormat', () => {
  function testTime({ms, date, detail=true}) {
    if (detail) {
      expect(timeFormat(ms)).toBe(date)
    } else {
      expect(timeFormat(ms, false)).toBe(date)
    }
  }

  it('should return 2017-03-01 01:01 when args is 1488301260000', () => {
    testTime({ ms: 1488301260000, date: '2017-03-01 01:01'})
  })

  it('shold return 2017-10-11 10:10 when args is 1507687800000', () => {
    testTime({ ms: 1507687800000, date: '2017-10-11 10:10' })
  })

  it('should return 2017-03-01 when args is 1488301260000', () => {
    testTime({ ms: 1488301260000, date: '2017-03-01', detail: false })
  })

  it('should return 2017-10-11 when args is 1507687800000', () => {
    testTime({ ms: 1507687800000, date: '2017-10-11', detail: false })
  })

  it('should return "" if argv is not to Date', () => {
    testTime({ms: 'xxx', date: ''})
  })

})
