#!/usr/bin/env node

/** @typedef {"passed" | "failed"} Status */
/** @typedef {{ status: Status, duration: number }} Result */
/** @typedef {{ projectName: string, results: Array<Result> }} Test */
/** @typedef {{ title: string, tests: Array<Test>, line: number }} Spec */
/** @typedef {{ specs: Array<Spec>, line: number, title: string, file: string }} Suite */
/** @typedef {Suite & { suites?: Array<Suite> }} SuiteWithChildSuites */
/** @typedef {{ suites : Array<SuiteWithChildSuites> }} JsonFileContents */

const { existsSync, readFileSync } = require('fs')
const { resolve } = require('path')

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const { slowestTests } = require('../lib/test-comparer')

yargs(hideBin(process.argv)).command(
  'slow [file] [--count=5]',
  'list slow tests found in test run',
  (y) => {
    return y
      .positional('file', {
        describe: 'JSON file from Playwright test run',
        demandOption: true,
        type: 'string',
      })
      .option('count', {
        type: 'number',
        describe: 'Number of tests to output',
        demandOption: false,
        default: 5,
      })
      .option('format', {
        type: 'string',
        describe: 'Whether to output the files',
        demandOption: false,
        default: 'stdout',
      })
  },
  (argv) => {
    const fullPath = resolve(argv.file)

    if (!existsSync(fullPath)) {
      // eslint-disable-next-line no-console
      console.warn(`File '${fullPath}' does not exist on disk`)
      process.exit(1)
    }

    const text = readFileSync(fullPath, { encoding: 'utf8' })
    const json = JSON.parse(text)

    const slowTests = slowestTests(json, argv.count)
    for (const test of slowTests) {
      // eslint-disable-next-line no-console
      console.log(
        `${test.file}:${test.lineNumber} - ${test.specTitle} > ${test.testTitle} (${test.duration}ms)`
      )
    }
  }
).argv
