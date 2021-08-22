const { readFileSync } = require('fs')
const { slowTestsComparer } = require('./comparer')
const { flatMapTests } = require('./parsing')

/** @typedef {"passed" | "failed"} Status */
/** @typedef {{ status: Status, duration: number }} Result */
/** @typedef {{ projectName: string, results: Array<Result> }} Test */
/** @typedef {{ title: string, tests: Array<Test>, line: number }} Spec */
/** @typedef {{ specs: Array<Spec>, line: number, title: string, file: string }} Suite */
/** @typedef {Suite & { suites?: Array<Suite> }} SuiteWithChildSuites */
/** @typedef {{ suites : Array<SuiteWithChildSuites> }} JsonFileContents */
/** @typedef {{ file: string, specTitle: string, testTitle: string, lineNumber: number, status: Status,  duration: number }} TestWithResult */

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

  const allTests = testOutput.suites.flatMap((s) => flatMapTests(s.file, '', s))

  const testsByDuration = allTests.sort(slowTestsComparer)

  return testsByDuration.slice(0, count)
}

module.exports = {
  slowestTests,
}
