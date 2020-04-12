const test = require('ava')
const { movingAverage, movingLeastSquares } = require('./index.js')

const quantize = xs => xs.map(x => Math.round(x * 1000) / 1000)

test('flat line is unchanged by smoothing', t => {
  const raw = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

  const ma = movingAverage(raw)
  const sq = movingLeastSquares(raw)

  t.deepEqual(ma, raw.slice(2, -2))
  t.deepEqual(sq, raw)
})

test('straight line', t => {
  const raw = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  const ma = movingAverage(raw)
  const sq = movingLeastSquares(raw)

  t.deepEqual(ma, raw.slice(2, -2))
  // Least squares smoothing has no effect
  t.deepEqual(sq, raw)
})

test('missing point is filled in', t => {
  const raw = [
    100, 200, 300, 400, 500,
    undefined,
    700, 800, 900, 1000, 1100, 1200]

  const ma = movingAverage(raw)
  const sq = movingLeastSquares(raw)

  t.deepEqual(ma, [
    300, 350, 475,
    600,
    725, 850, 900, 1000])
  t.deepEqual(sq, [
    100, 200, 300, 400, 500,
    600,
    700, 800, 900, 1000, 1100, 1200])
})

test('impulse function is smoothed', t => {
  const raw = [
    0, 0, 0, 0, 0, 0,
    100,
    0, 0, 0, 0, 0, 0]

  const ma = movingAverage(raw)
  const sq = movingLeastSquares(raw)

  const expected = [
    0, 0, 0, 0, 20, 20,
    20,
    20, 20, 0, 0, 0, 0]
  t.deepEqual(ma, expected.slice(2, -2))
  t.deepEqual(sq, expected)
})

test('step function is smoothed', t => {
  const raw = [
    100, 100, 100, 100, 100, 100,
    200, 200, 200, 200, 200, 200]

  const ma = movingAverage(raw)
  const sq = movingLeastSquares(raw)

  const expected = [
    100, 100, 100, 100, 120, 140,
    160, 180, 200, 200, 200, 200]
  t.deepEqual(ma, expected.slice(2, -2))
  t.deepEqual(quantize(sq), expected)
})

test('zeros are handled correctly', t => {
  const raw = [0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100]

  const ma = movingAverage(raw)
  const sq = movingLeastSquares(raw)

  const expected = [0, 0, 0, 0, 20, 40, 60, 80, 100, 100, 100, 100]
  t.deepEqual(ma, expected.slice(2, -2))
  t.deepEqual(quantize(sq), expected)
})

test('an example for documentation', t => {
  const raw = [100, 110, 150, undefined, 200, 300, 400, 1000]

  const ma = movingAverage(raw)
  const sq = movingLeastSquares(raw)

  t.deepEqual(quantize(ma), [140, 190, 262.5, 475])
  t.deepEqual(quantize(sq), [95, 120, 146.571, 190, 247.143, 350, 600, 916.667])
})

test('An empty list is unchanged', t => {
  const raw = []
  const ma = movingAverage(raw)

  const sq = movingLeastSquares(raw)

  t.deepEqual(ma, [])
  t.deepEqual(sq, [])
})
