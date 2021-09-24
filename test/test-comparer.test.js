const { slowestTests } = require('../lib/test-comparer')

describe('comparison', () => {
  it('returns no tests for empty test run', () => {
    const json = {
      suites: [],
    }
    expect(slowestTests(json, 1)).toHaveLength(0)
  })

  it('returns one test when single test found', () => {
    const json = {
      suites: [
        {
          specs: [
            {
              title: 'Some test',
              line: 20,
              tests: [
                {
                  projectName: 'something',
                  results: [
                    {
                      /** @type {'passed'} */
                      status: 'passed',
                      duration: 1000,
                    },
                  ],
                },
              ],
            },
          ],
          line: 10,
          title: 'Testing things',
          file: 'some-test.spec.ts',
        },
      ],
    }

    expect(slowestTests(json, 1)).toEqual([
      {
        duration: 1000,
        file: 'some-test.spec.ts',
        lineNumber: 20,
        specTitle: '',
        status: 'passed',
        testTitle: 'Some test',
      },
    ])
  })

  it('returns slow test when found in nested suite', () => {
    const json = {
      suites: [
        {
          specs: [
            {
              title: 'Some test',
              line: 20,
              tests: [
                {
                  projectName: 'something',
                  results: [
                    {
                      /** @type {'passed'} */
                      status: 'passed',
                      duration: 1000,
                    },
                  ],
                },
              ],
            },
          ],
          line: 10,
          title: 'Testing things',
          file: 'some-test.spec.ts',
          suites: [
            {
              specs: [
                {
                  title: 'A slower test',
                  line: 50,
                  tests: [
                    {
                      projectName: 'something',
                      results: [
                        {
                          /** @type {'passed'} */
                          status: 'passed',
                          duration: 2000,
                        },
                      ],
                    },
                  ],
                },
              ],
              line: 40,
              title: 'Testing slower things',
              file: 'some-test.spec.ts',
            },
          ],
        },
      ],
    }

    expect(slowestTests(json, 1)).toEqual([
      {
        duration: 2000,
        file: 'some-test.spec.ts',
        lineNumber: 50,
        specTitle: 'Testing slower things',
        status: 'passed',
        testTitle: 'A slower test',
      },
    ])
  })
})
