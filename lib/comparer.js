/**
 * Comparer for sorting tests from slowest to fastest
 *
 * @param a {{duration:number}} a test
 * @param b {{duration:number}} another test
 *
 * @returns
 */
function slowTestsComparer(a, b) {
  if (a.duration === b.duration) {
    return 0
  }
  return a.duration > b.duration ? -1 : 1
}

module.exports = {
  slowTestsComparer,
}
