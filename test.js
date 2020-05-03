const test = require('ava')
const smoothish = require('./index.js')

const quantize = xs => xs.map(x => Math.round(x * 1000) / 1000)

test('flat line is unchanged by smoothing', t => {
  const raw = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

  const ma = smoothish(raw, { algorithm: 'movingAverage', falloff: 'step' })
  const sq = smoothish(raw, { falloff: 'step' })
  // const ex = expSmooth(raw)

  t.deepEqual(ma.slice(2, -2), raw.slice(2, -2))
  t.deepEqual(sq, raw)
  // t.deepEqual(ex, raw)
})

test('straight line', t => {
  const raw = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  const ma = smoothish(raw, { algorithm: 'movingAverage', falloff: 'step' })
  const sq = smoothish(raw, { falloff: 'step' })
  // const ex = expSmooth(raw)

  t.deepEqual(ma.slice(2, -2), raw.slice(2, -2))
  // Least squares smoothing has no effect
  t.deepEqual(sq, raw)
  // t.deepEqual(ex, raw)
})

test('points beyond edge ignored', t => {
  const raw = [null, 2, 3, 4, 5, 6, 7, 8, 9, 10, null, null, null, null, null]

  const sq = smoothish(raw, { falloff: 'step' })
  // const ex = expSmooth(raw)

  t.deepEqual(sq, raw)
  // t.deepEqual(ex, raw)
})

test('missing point is filled in', t => {
  const raw = [
    100, 200, 300, 400, 500,
    undefined,
    700, 800, 900, 1000, 1100, 1200]

  const ma = smoothish(raw, { algorithm: 'movingAverage', falloff: 'step' })
  const sq = smoothish(raw, { falloff: 'step' })
  // const ex = expSmooth(raw)

  t.deepEqual(ma, [
    200, 250, 300, 350, 475,
    600,
    725, 850, 900, 1000, 1050, 1100])
  t.deepEqual(sq, [
    100, 200, 300, 400, 500,
    600,
    700, 800, 900, 1000, 1100, 1200])
  // t.deepEqual(ex, [
  //  100, 200, 300, 400, 500,
  //  600,
  //  700, 800, 900, 1000, 1100, 1200])
})

test('impulse function is smoothed', t => {
  const raw = [
    0, 0, 0, 0, 0, 0,
    100,
    0, 0, 0, 0, 0, 0]

  const ma = smoothish(raw, { algorithm: 'movingAverage', falloff: 'step' })
  const sq = smoothish(raw, { falloff: 'step' })
  // const ex = expSmooth(raw)

  const pulse = [
    0, 0, 0, 0, 20, 20,
    20,
    20, 20, 0, 0, 0, 0]
  /* const decay = [
    0, 1, 2, 5, 10, 20,
    50,
    20, 10, 5, 2, 1, 0] */
  t.deepEqual(ma.slice(2, -2), pulse.slice(2, -2))
  t.deepEqual(sq, pulse)
  // t.deepEqual(ex, decay)
})

test('step function is smoothed', t => {
  const raw = [
    100, 100, 100, 100, 100, 100,
    200, 200, 200, 200, 200, 200]

  const ma = smoothish(raw, { algorithm: 'movingAverage', falloff: 'step' })
  const sq = smoothish(raw, { falloff: 'step' })

  const expected = [
    100, 100, 100, 100, 120, 140,
    160, 180, 200, 200, 200, 200]
  t.deepEqual(ma.slice(2, -2), expected.slice(2, -2))
  t.deepEqual(quantize(sq), expected)
})

test('zeros are handled correctly', t => {
  const raw = [0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100]

  const ma = smoothish(raw, { algorithm: 'movingAverage', falloff: 'step' })
  const sq = smoothish(raw, { falloff: 'step' })

  const expected = [0, 0, 0, 0, 20, 40, 60, 80, 100, 100, 100, 100]
  t.deepEqual(ma.slice(2, -2), expected.slice(2, -2))
  t.deepEqual(quantize(sq), expected)
})

test('an example for documentation', t => {
  const raw = [100, 110, 150, undefined, 200, 300, 400, 1000]

  const ma = smoothish(raw, { algorithm: 'movingAverage', falloff: 'step' })
  const sq = smoothish(raw, { falloff: 'step' })

  t.deepEqual(quantize(ma), [120, 120, 140, 190, 262.5, 475, 475, 566.667])
  t.deepEqual(quantize(sq), [95, 120, 146.571, 190, 247.143, 350, 600, 916.667])
})

test('An empty list is unchanged', t => {
  const raw = []
  const ma = smoothish(raw, { algorithm: 'movingAverage', falloff: 'step' })

  const sq = smoothish(raw, { falloff: 'step' })

  t.deepEqual(ma, [])
  t.deepEqual(sq, [])
})

test('impulse at r=2 (the default)', t => {
  const raw = [
    0, 0, 0, 0, 0, 0,
    100,
    0, 0, 0, 0, 0, 0]

  const ma = smoothish(raw, { algorithm: 'movingAverage', falloff: 'step', radius: 2 })
  const sq = smoothish(raw, { falloff: 'step', radius: 2 })

  const expected = [
    0, 0, 0, 0, 20, 20,
    20,
    20, 20, 0, 0, 0, 0]
  t.deepEqual(ma.slice(2, -2), expected.slice(2, -2))
  t.deepEqual(sq, expected)
})

test('impulse at r=1', t => {
  const raw = [
    0, 0, 0, 0, 0, 0,
    100,
    0, 0, 0, 0, 0, 0]

  const ma = smoothish(raw, { algorithm: 'movingAverage', falloff: 'step', radius: 1 })
  const sq = smoothish(raw, { falloff: 'step', radius: 1 })

  const expected = [
    0, 0, 0, 0, 0, 33.333,
    33.333,
    33.333, 0, 0, 0, 0, 0]
  t.deepEqual(quantize(ma.slice(1, -1)), expected.slice(1, -1))
  t.deepEqual(quantize(sq), expected)
})

test('impulse at r=0 (no change)', t => {
  const raw = [
    0, 0, 0, 0, 0, 0,
    100,
    0, 0, 0, 0, 0, 0]

  const ma = smoothish(raw, { algorithm: 'movingAverage', falloff: 'step', radius: 0 })
  const sq = smoothish(raw, { falloff: 'step', radius: 0 })

  t.deepEqual(ma, raw)
  t.deepEqual(sq, raw)
})

test('negative r throws exception', t => {
  const raw = [
    0, 0, 0, 0, 0, 0,
    100,
    0, 0, 0, 0, 0, 0]

  t.throws(() => smoothish(raw, { algorithm: 'movingAverage', falloff: 'step', radius: -1 }), { message: /negative radius/ })
  t.throws(() => smoothish(raw, { falloff: 'step', radius: -1 }), { message: /negative radius/ })
})

test('movingAverage handling increasing radius', t => {
  const raw = [1, 2, 3, 4, 5, 6]

  const ma = [
    smoothish(raw, { algorithm: 'movingAverage', falloff: 'step', radius: 0 }),
    smoothish(raw, { algorithm: 'movingAverage', falloff: 'step', radius: 1 }),
    smoothish(raw, { algorithm: 'movingAverage', falloff: 'step', radius: 2 }),
    smoothish(raw, { algorithm: 'movingAverage', falloff: 'step', radius: 3 }),
    smoothish(raw, { algorithm: 'movingAverage', falloff: 'step', radius: 4 }),
    smoothish(raw, { algorithm: 'movingAverage', falloff: 'step', radius: 5 })
  ]

  t.deepEqual(ma[0], [1, 2, 3, 4, 5, 6])
  t.deepEqual(ma[1], [1.5, 2, 3, 4, 5, 5.5])
  t.deepEqual(ma[2], [2, 2.5, 3, 4, 4.5, 5])
  t.deepEqual(ma[3], [2.5, 3, 3.5, 3.5, 4, 4.5])
  t.deepEqual(ma[4], [3, 3.5, 3.5, 3.5, 3.5, 4])
})

test('fullSmooth handling increasing radius', t => {
  const raw = [1, 2, 3, 4, 5, 6]

  const sq = [
    smoothish(raw, { falloff: 'step', radius: 0 }),
    smoothish(raw, { falloff: 'step', radius: 1 }),
    smoothish(raw, { falloff: 'step', radius: 2 }),
    smoothish(raw, { falloff: 'step', radius: 3 }),
    smoothish(raw, { falloff: 'step', radius: 4 }),
    smoothish(raw, { falloff: 'step', radius: 5 })
  ]

  t.deepEqual(sq[0], [1, 2, 3, 4, 5, 6])
  t.deepEqual(sq[1], [1, 2, 3, 4, 5, 6])
  t.deepEqual(sq[2], [1, 2, 3, 4, 5, 6])
  t.deepEqual(sq[3], [1, 2, 3, 4, 5, 6])
  t.deepEqual(sq[4], [1, 2, 3, 4, 5, 6])
})

test('null data throws an exception', t => {
  t.throws(() => smoothish(null, { algorithm: 'movingAverage', falloff: 'step' }), { message: /null data/ })
  t.throws(() => smoothish(null), { message: /null data/ })
})

test('undefined data throws an exception', t => {
  t.throws(() => smoothish(undefined, { algorithm: 'movingAverage', falloff: 'step' }), { message: /no data/ })
  t.throws(() => smoothish(), { message: /no data/ })
  t.throws(() => smoothish(undefined), { message: /no data/ })
})
