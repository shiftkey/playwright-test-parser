/** @typedef {"passed" | "failed"} Status */
/** @typedef {{ status: Status, duration: number }} Result */
/** @typedef {{ projectName: string, results: Array<Result> }} Test */
/** @typedef {{ file: string, specTitle: string, testTitle: string, lineNumber: number, status: Status,  duration: number }} TestWithResult */
/** @typedef {{ title: string, tests: Array<Test>, line: number }} Spec */
/** @typedef {{ specs: Array<Spec>, line: number, title: string, file: string }} Suite */
/** @typedef {Suite & { suites?: Array<Suite> }} SuiteWithChildSuites */

/**
 * Flatten and map the tests within a suite
 *
 * @param filename
 * @param specsTitle
 * @param suite
 *
 * @returns Array of test results
 */
export function flatMapTests(
  filename: string,
  specsTitle: string,
  suite: Suite
): Array<TestWithResult>
