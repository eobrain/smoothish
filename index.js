const average = (xs) => {
  let sum = 0
  let n = 0
  for (const x of xs) {
    if (x !== null && x !== undefined) {
      sum += x
      ++n
    }
  }
  return sum / n
}

const movingAverage = (xs, r = 2) => {
  const ys = []
  for (let t = r; t < xs.length - r; ++t) {
    ys.push(average(xs.slice(Math.max(0, t - r), t + r + 1)))
  }
  return ys
}

// See https://www.mathsisfun.com/data/least-squares-regression.html
const leastSquares = (ys, r, x0) => {
  let N = 0
  let sumXY = 0
  let sumX = 0
  let sumY = 0
  let sumXsq = 0
  for (let x = x0 - r; x <= x0 + r; ++x) {
    const y = ys[x]
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

const movingLeastSquares = (xs, r = 2) => {
  const ys = []
  for (let t = 0; t < xs.length; ++t) {
    ys.push(leastSquares(xs, r, t))
  }
  return ys
}

module.exports = { movingAverage, movingLeastSquares }
