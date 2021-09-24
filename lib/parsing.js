/** @typedef {"passed" | "failed"} Status */
/** @typedef {{ status: Status, duration: number }} Result */
/** @typedef {{ projectName: string, results: Array<Result> }} Test */
/** @typedef {{ file: string, specTitle: string, testTitle: string, lineNumber: number, status: Status,  duration: number }} TestWithResult */
/** @typedef {{ title: string, tests: Array<Test>, line: number }} Spec */
/** @typedef {{ specs: Array<Spec>, line: number, title: string, file: string }} Suite */
/** @typedef {Suite & { suites?: Array<Suite> }} SuiteWithChildSuites */

/**
 * Map the test metadata into a test object
 *
 * @param {Test} test raw test object
 * @param {string} file file name associated with test
 * @param {string} specTitle The suite containing the test
 * @param {string} testTitle The title of the test
 * @param {number} lineNumber The line number associated with the test
 *
 * @returns {Array<TestWithResult>}
 */
function toTestResult(test, file, specTitle, testTitle, lineNumber) {
  return test.results.map((r) => ({
    file,
    specTitle,
    testTitle,
    lineNumber,
    duration: r.duration,
    status: r.status,
  }))
}

/**
 * flatten and map the tests within a suite
 *
 * @param {string} filename
 * @param {string} specsTitle
 * @param {SuiteWithChildSuites} suite
 *
 * @returns {Array<TestWithResult>} Array of test results
 */
function flatMapTests(filename, specsTitle, suite) {
  const tests = []
  for (const spec of suite.specs) {
    const testTitle = spec.title
    const lineNumber = spec.line
    tests.push(
      ...spec.tests.flatMap((t) =>
        toTestResult(t, filename, specsTitle, testTitle, lineNumber)
      )
    )
  }

  if (suite.suites)
    for (const s of suite.suites) {
      const innerSpecTitle = specsTitle.length
        ? `${specsTitle} > ${s.title}`
        : s.title
      const additionalTests = flatMapTests(filename, innerSpecTitle, s)
      tests.push(...additionalTests)
    }

  return tests
}

module.exports = {
  flatMapTests,
  toTestResult,
}
