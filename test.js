const test = require('ava')
const { movingAverage, movingLeastSquares } = require('./index.js')

const quantize = xs => xs.map(x => Math.round(x * 1000) / 1000)

test('flat line is unchanged by smoothing', t => {
  const raw = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

  const ma = movingAverage(raw)
  const sq = movingLeastSquares(raw)

  t.deepEqual(ma, raw)
  t.deepEqual(sq, raw)
})

test('straight line', t => {
  const raw = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  const ma = movingAverage(raw)
  const sq = movingLeastSquares(raw)

  t.deepEqual(ma, [2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 10.5, 11])
  // Least squares smoothing has no effect
  t.deepEqual(sq, raw)
})

test('missing point is filled in', t => {
  const raw = [1, 2, 3, 4, 5, undefined, 7, 8, 9, 10, 11, 12]

  const ma = movingAverage(raw)
  const sq = movingLeastSquares(raw)

  t.deepEqual(ma, [2, 2.5, 3, 3.5, 4.75, 6, 7.25, 8.5, 9, 10, 10.5, 11])
  t.deepEqual(sq, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
})

test('step function is smoothed', t => {
  const raw = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2]
  const ma = movingAverage(raw)
  const sq = movingLeastSquares(raw)
  t.deepEqual(ma, [1, 1, 1, 1, 1.2, 1.4, 1.6, 1.8, 2, 2, 2, 2])
  t.deepEqual(quantize(sq), [1, 1, 1, 1, 1.2, 1.4, 1.6, 1.8, 2, 2, 2, 2])
})

test('zeros are handled correctly', t => {
  const raw = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1]

  const ma = movingAverage(raw)
  const sq = movingLeastSquares(raw)

  t.deepEqual(ma, [0, 0, 0, 0, 0.2, 0.4, 0.6, 0.8, 1, 1, 1, 1])
  t.deepEqual(quantize(sq), [0, 0, 0, 0, 0.2, 0.4, 0.6, 0.8, 1, 1, 1, 1])
})

test('an example for documentation', t => {
  const raw = [100, 110, 150, undefined, 200, 300, 400, 1000]

  const ma = movingAverage(raw)
  const sq = movingLeastSquares(raw)

  t.deepEqual(quantize(ma), [120, 120, 140, 190, 262.5, 475, 475, 566.667])
  t.deepEqual(quantize(sq), [95, 120, 146.571, 190, 247.143, 350, 600, 916.667])
})

test('An empty list is unchanged', t => {
  const raw = []
  const ma = movingAverage(raw)

  const sq = movingLeastSquares(raw)

  t.deepEqual(ma, [])
  t.deepEqual(sq, [])
})
