const { readFileSync } = require('fs')
const { slowTestsComparer } = require('./comparer')

/** @typedef {"passed" | "failed"} Status */
/** @typedef {{ status: Status, duration: number }} Result */
/** @typedef {{ projectName: string, results: Array<Result> }} Test */
/** @typedef {{ title: string, tests: Array<Test>, line: number }} Spec */
/** @typedef {{ specs: Array<Spec>, line: number, title: string, file: string }} Suite */
/** @typedef {Suite & { suites?: Array<Suite> }} SuiteWithChildSuites */
/** @typedef {{ suites : Array<SuiteWithChildSuites> }} JsonFileContents */
/** @typedef {{ file: string, specTitle: string, testTitle: string, lineNumber: number, status: Status,  duration: number }} TestWithResult */

/**
 * Enumerate the tests within a suite
 *
 * @param {string} filename
 * @param {string} specsTitle
 * @param {SuiteWithChildSuites} suite
 *
 * @returns {Array<TestWithResult>} Array of test results
 */
function getTests(filename, specsTitle, suite) {
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
      const additionalTests = getTests(filename, innerSpecTitle, s)
      tests.push(...additionalTests)
    }

  return tests
}

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
 * Parse the test files and return the slowest tests found
 *
 * @param {string} fullPath path to test file on disk
 * @param {number} count
 *
 * @returns array of files matching
 */
function slowestTests(fullPath, count) {
  const text = readFileSync(fullPath, { encoding: 'utf8' })

  /** @type {JsonFileContents} */
  const testOutput = JSON.parse(text)

  const allTests = testOutput.suites.flatMap((s) => getTests(s.file, '', s))

  const testsByDuration = allTests.sort(slowTestsComparer)

  return testsByDuration.slice(0, count)
}

module.exports = {
  slowestTests,
}
