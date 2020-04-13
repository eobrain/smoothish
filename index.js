const average = (data) => {
  let sum = 0
  let n = 0
  for (const x of data) {
    if (x !== null && x !== undefined) {
      sum += x
      ++n
    }
  }
  return sum / n
}

/**
 * Smooths data using entered moving point average.
 * Can handle missing data, when there are `null` or `undefined` instead of numbers in the input data.
 * @param {!Array<number>} data - timeseries of equally-spaced values.
 * @param {number} [radius=2] - specifies the moving-point window to be 2*`radius`+1 wide
 * @returns {!Array<number>} centered moving average of the data, with length  `2*radius` shorter than the original data
 */
const movingAverage = (data, radius = 2) => {
  if (data === undefined) {
    throw new Error('no data passed to movingAverage')
  }
  if (data === null) {
    throw new Error('null data passed to movingAverage')
  }
  if (radius < 0) {
    throw new Error(`negative radius ${radius} passed to movingAverage`)
  }
  const smoothed = []
  for (let t = radius; t < data.length - radius; ++t) {
    smoothed.push(average(data.slice(Math.max(0, t - radius), t + radius + 1)))
  }
  return smoothed
}

const leastSquares = (smoothed, radius, x0) => {
  if (radius === 0) {
    return smoothed[x0]
  }
  // See https://www.mathsisfun.com/data/least-squares-regression.html
  let N = 0
  let sumXY = 0
  let sumX = 0
  let sumY = 0
  let sumXsq = 0
  for (let x = x0 - radius; x <= x0 + radius; ++x) {
    const y = smoothed[x]
    if (y === null || y === undefined) {
      continue
    }
    ++N
    sumXY += x * y
    sumX += x
    sumY += y
    sumXsq += x * x
  }
  const m = (N * sumXY - sumX * sumY) / (N * sumXsq - sumX * sumX)
  const b = (sumY - m * sumX) / N
  return m * x0 + b
}

/**
 * Smooths data by replacing each point with the least-squared linear interpolations of the points in its neighborhood
 * Can handle missing data, when there are `null` or `undefined` instead of numbers in the input data.
 * @param {!Array<number>} data - timeseries of equally-spaced values.
 * @param {number} [radius=2] - specifies the neighborhood width extending from `radius` points below to `radius` points above the current point
 * @returns {!Array<number>} smoothed version of the input, with the same length
 */
const fullSmooth = (data, r = 2) => {
  if (data === undefined) {
    throw new Error('no data passed to fullSmooth')
  }
  if (data === null) {
    throw new Error('null data passed to fullSmooth')
  }
  if (r < 0) {
    throw new Error(`negative radius ${r} passed to fullSmooth`)
  }
  const smoothed = []
  for (let t = 0; t < data.length; ++t) {
    smoothed.push(leastSquares(data, r, t))
  }
  return smoothed
}

module.exports = { movingAverage, fullSmooth }
