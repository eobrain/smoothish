const average = (data, radius, x0) => {
  let sum = 0
  let n = 0
  let beyondLeftEdge = true
  let beyondRightEdge = true
  for (let x = x0 - radius; x <= x0 + radius; ++x) {
    const y = data[x]
    if (y !== null && y !== undefined) {
      if (x <= x0) {
        beyondLeftEdge = false
      }
      if (x >= x0) {
        beyondRightEdge = false
      }
      sum += y
      ++n
    }
  }
  if (beyondLeftEdge || beyondRightEdge) {
    return data[x0]
  }
  return sum / n
}

const movingAverageStep = (data, radius = 2) => {
  if (data === undefined) {
    throw new Error('no data passed to movingAverageStep')
  }
  if (data === null) {
    throw new Error('null data passed to movingAverageStep')
  }
  if (radius < 0) {
    throw new Error(`negative radius ${radius} passed to movingAverageStep`)
  }
  const smoothed = []
  for (let t = 0; t < data.length; ++t) {
    smoothed.push(average(data, radius, t))
  }
  return smoothed
}

const leastSquares = (data, radius, x0) => {
  if (radius === 0) {
    return data[x0]
  }
  // See https://www.mathsisfun.com/data/least-squares-regression.html
  let N = 0
  let sumXY = 0
  let sumX = 0
  let sumY = 0
  let sumXsq = 0
  let beyondLeftEdge = true
  let beyondRightEdge = true
  for (let x = x0 - radius; x <= x0 + radius; ++x) {
    const y = data[x]
    if (y === null || y === undefined) {
      continue
    }
    if (x <= x0) {
      beyondLeftEdge = false
    }
    if (x >= x0) {
      beyondRightEdge = false
    }
    ++N
    sumXY += x * y
    sumX += x
    sumY += y
    sumXsq += x * x
  }
  if (beyondLeftEdge || beyondRightEdge) {
    return data[x0]
  }
  const m = (N * sumXY - sumX * sumY) / (N * sumXsq - sumX * sumX)
  const b = (sumY - m * sumX) / N
  return m * x0 + b
}

const leastSquaresStep = (data, r = 2) => {
  if (data === undefined) {
    throw new Error('no data passed to leastSquaresStep')
  }
  if (data === null) {
    throw new Error('null data passed to leastSquaresStep')
  }
  if (r < 0) {
    throw new Error(`negative radius ${r} passed to leastSquaresStep`)
  }
  const smoothed = []
  for (let t = 0; t < data.length; ++t) {
    smoothed.push(leastSquares(data, r, t))
  }
  return smoothed
}

const expLeastSquares = (data, radius, x0) => {
  if (radius === 0) {
    return data[x0]
  }
  // See https://www.mathsisfun.com/data/least-squares-regression.html
  let N = 0
  let sumXY = 0
  let sumX = 0
  let sumY = 0
  let sumXsq = 0
  let beyondLeftEdge = true
  let beyondRightEdge = true
  for (let x = 0; x <= data.length; ++x) {
    const y = data[x]
    if (y === null || y === undefined) {
      continue
    }
    if (x <= x0) {
      beyondLeftEdge = false
    }
    if (x >= x0) {
      beyondRightEdge = false
    }
    const weight = Math.exp(-Math.abs(x - x0) / radius)
    N += weight
    sumXY += x * y * weight
    sumX += x * weight
    sumY += y * weight
    sumXsq += x * x * weight
  }
  if (beyondLeftEdge || beyondRightEdge) {
    return data[x0]
  }
  const m = (N * sumXY - sumX * sumY) / (N * sumXsq - sumX * sumX)
  const b = (sumY - m * sumX) / N
  return m * x0 + b
}

const leastSquaresExponential = (data, r = 2) => {
  if (data === undefined) {
    throw new Error('no data passed to leastSquaresStep')
  }
  if (data === null) {
    throw new Error('null data passed to leastSquaresStep')
  }
  if (r < 0) {
    throw new Error(`negative radius ${r} passed to leastSquaresStep`)
  }
  const smoothed = []
  for (let t = 0; t < data.length; ++t) {
    smoothed.push(expLeastSquares(data, r, t))
  }
  return smoothed
}

const expAverage = (data, radius, x0) => {
  if (radius === 0) {
    return data[x0]
  }
  // See https://www.mathsisfun.com/data/least-squares-regression.html
  let N = 0
  let sumY = 0
  let beyondLeftEdge = true
  let beyondRightEdge = true
  for (let x = 0; x <= data.length; ++x) {
    const y = data[x]
    if (y === null || y === undefined) {
      continue
    }
    if (x <= x0) {
      beyondLeftEdge = false
    }
    if (x >= x0) {
      beyondRightEdge = false
    }
    const weight = Math.exp(-Math.abs(x - x0) / radius)
    N += weight
    sumY += y * weight
  }
  if (beyondLeftEdge || beyondRightEdge) {
    return data[x0]
  }
  return sumY / N
}

const movingAverageExponential = (data, r = 2) => {
  if (data === undefined) {
    throw new Error('no data passed to movingAverageExponential')
  }
  if (data === null) {
    throw new Error('null data passed to movingAverageExponential')
  }
  if (r < 0) {
    throw new Error(`negative radius ${r} passed to movingAverageExponential`)
  }
  const smoothed = []
  for (let t = 0; t < data.length; ++t) {
    smoothed.push(expAverage(data, r, t))
  }
  return smoothed
}

const LOOKUP = {
  leastSquares: {
    exponential: leastSquaresExponential,
    step: leastSquaresStep
  },
  movingAverage: {
    exponential: movingAverageExponential,
    step: movingAverageStep
  }
}

/**
 * Smooths data by replacing each point with the least-squared linear interpolations of the points in its neighborhood
 * Can handle missing data, when there are `null` or `undefined` instead of numbers in the input data.
 * An optional options argument can contain any of the following fields:
 * * `radius`, defaulting to 2, specifies the neighborhood width extending from `radius` points below to `radius` points above the current point
 * * `algorithm`, which can be one of
 *   * `'leastSquares'` (default) replace each point with the least-squared linear interpolations of the points in its neighborhood
 *   * `'movingAverage'` replace each point with the moving average of the points in its neighborhood
 * * `falloff`, which cab be one of
 *   * `'exponential'` (default) give a weigh of each point that is an exponential decay with a time constant of the radius
 *   * `'step'` give equal weight to all `radius*2+1` points in the neighborhood, and no weight to points outside the radius
 * @param {!Array<number>} data - time series of equally-spaced values.
 * @param {!Object} [options={radius:2,algorithm:'leastSquares',falloff:'exponential'}
 * @returns {!Array<number>} smoothed version of the input, with the same length
 */
const smoothish = (data, { radius = 2, algorithm = 'leastSquares', falloff = 'exponential' } = {}) => {
  const func = (LOOKUP[algorithm] || {})[falloff]
  if (!func) {
    throw new Error(`
      ${{ radius, algorithm, falloff }}:
        algorithm must be either 'leastSquares' or 'movingAverage'
        falloff must be either 'exponential' or 'step'
      `)
  }
  return func(data, radius)
}

module.exports = smoothish
