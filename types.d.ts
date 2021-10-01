type Status = 'passed' | 'failed'
type Result = { status: Status; duration: number }
type Test = { projectName: string; results: Array<Result> }
type TestWithResult = {
  file: string
  specTitle: string
  testTitle: string
  lineNumber: number
  status: Status
  duration: number
}
type Spec = { title: string; tests: Array<Test>; line: number }
type Suite = { specs: Array<Spec>; line: number; title: string; file: string }
type SuiteWithChildSuites = Suite & { suites?: Array<Suite> }

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
