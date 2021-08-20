// const fs = require('fs')

// TODO: config so we can pass this file in somehow
// const text = fs.readFileSync('results.json', { encoding: 'utf8' })

// type Status = "passed" | "failed";

// type Result = {
//   status: Status;
//   duration: number;
// };

// type Test = {
//   projectName: string;
//   results: Array<Result>;
// };

// type Spec = {
//   title: string;
//   tests: Array<Test>;
//   line: number;
// };

// type Suite = {
//   specs: Array<Spec>;
//   line: number;
//   title: string;
//   file: string;
// };

// type SuiteWithChildSuites = Suite & { suites?: Array<Suite> };

// type JsonFileContents = {
//   // suites can be recursively defined, lol
//   suites: Array<SuiteWithChildSuites>;
// };

// type TestWithResult = {
//   file: string;
//   specTitle: string;
//   testTitle: string;
//   lineNumber: number;
//   status: Status;
//   duration: number;
// };

// /** @type {suites: Array<SuiteWithChildSuites>} */
// const obj = JSON.parse(text);

// function slowestTestsFirst(a: TestWithResult, b: TestWithResult) {
//   if (a.duration === b.duration) {
//     return 0;
//   }
//   return a.duration > b.duration ? -1 : 1;
// }

// const sortedTests = getAllTests(obj.suites).sort(slowestTestsFirst);

// const topTen = sortedTests.slice(0, 10);

// console.log(`tests:`, topTen);

// function getAllTests(suites: Array<SuiteWithChildSuites>) {
//   return suites.flatMap((s) => getTests(s.file, s.title, s));
// }

// function toTestResult(
//   t: Test,
//   file: string,
//   specTitle: string,
//   testTitle: string,
//   lineNumber: number
// ): Array<TestWithResult> {
//   return t.results.map((r) => ({
//     file,
//     specTitle,
//     testTitle,
//     lineNumber,
//     duration: r.duration,
//     status: r.status,
//   }));
// }

// function getTests(
//   filename: string,
//   specsTitle: string,
//   suite: SuiteWithChildSuites
// ): Array<TestWithResult> {
//   const tests = new Array<TestWithResult>();
//   for (const spec of suite.specs) {
//     const testTitle = spec.title;
//     const lineNumber = spec.line;
//     tests.push(
//       ...spec.tests.flatMap((t) =>
//         toTestResult(t, filename, specsTitle, testTitle, lineNumber)
//       )
//     );
//   }

//   if (suite.suites)
//     for (const s of suite.suites) {
//       const innerSpecTitle = `${specsTitle} > ${s.title}`;
//       const additionalTests = getTests(filename, innerSpecTitle, s);
//       tests.push(...additionalTests);
//     }

//   return tests;
// }
