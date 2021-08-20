const { slowTestsComparer } = require('../lib/comparer')

describe('comparison', () => {
  it('returns 0 when tests take same time', () => {
    const a = { duration: 100 }
    const b = { duration: 100 }

    expect(slowTestsComparer(a, b)).toEqual(0)
  })

  it('returns -1 when first test is slower than other test', () => {
    const a = { duration: 200 }
    const b = { duration: 100 }

    expect(slowTestsComparer(a, b)).toEqual(-1)
  })
  it('returns 1 when first test is faster than other test', () => {
    const a = { duration: 200 }
    const b = { duration: 300 }

    expect(slowTestsComparer(a, b)).toEqual(1)
  })
})
