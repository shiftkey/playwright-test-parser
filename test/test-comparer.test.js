const { slowestTests } = require('../lib/test-comparer')

describe('comparison', () => {
  it('returns no tests for empty test run', () => {
    const json = {
      suites: [],
    }
    expect(slowestTests(json, 1)).toHaveLength(0)
  })
})
