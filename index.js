const average = (xs) => {
  let sum = 0
  let n = 0
  for (const x of xs) {
    if (x!==null && x!==undefined) {
      sum += x
      ++n
    }
  }
  return sum / n
}

const movingAverage = (xs) => {
  const ys = []
  for (let t = 0; t < xs.length; ++t) {
    ys.push(average(xs.slice(Math.max(0, t - 2), t + 3)))
  }
  return ys
}

// See https://www.mathsisfun.com/data/least-squares-regression.html
const leastSquares = (ys) => {
  const x0 = (ys.length - 1) / 2

  let N = 0
  let sumXY = 0
  let sumX = 0
  let sumY = 0
  let sumXsq = 0
  for (let x = 0; x < ys.length; ++x) {
    const y = ys[x]
    if (y===null || y===undefined) {
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

const movingLeastSquares = (xs) => {
  const ys = []
  for (let t = 0; t < xs.length; ++t) {
    ys.push(leastSquares([xs[t - 2], xs[t - 1], xs[t], xs[t + 1], xs[t + 2]]))
  }
  return ys
}

module.exports = { movingAverage, movingLeastSquares }
