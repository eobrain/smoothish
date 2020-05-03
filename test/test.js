const test = require('ava')
const smoothish = require('../index.js')

const missing = x => x === null || x === undefined

const quantize = xs => xs.map(x => missing(x) ? x : Math.round(x * 1000) / 1000)

const OPTIONS = [
  { falloff: 'step' },
  { algorithm: 'movingAverage', falloff: 'step' },
  { },
  { algorithm: 'movingAverage' }
  // { radius: 4, falloff: 'step' },
  // { radius: 4, algorithm: 'movingAverage', falloff: 'step' },
  // { radius: 4 },
  // { radius: 4, algorithm: 'movingAverage' }
]

// const tee = x => {
//  console.log(x)
//  return x
// }
const max = xs => xs.reduce((acc, x) => missing(x) ? acc : Math.max(acc, x))
const bar = n => [...Array(Math.max(0, Math.round(n)))].map(() => '#').join('')

const bars = xs => quantize(xs).map(x => (missing(x) ? '' : bar(x * 50 / max(xs))) + ' ' + x)

test('flat line is unchanged by smoothing', t => {
  const raw = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

  const expected = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]

  for (const i in expected) {
    const actual = smoothish(raw, OPTIONS[i])

    t.deepEqual(actual, expected[i])
  }
  t.snapshot(bars(raw), 'input')
  for (const options of OPTIONS) {
    const actual = smoothish(raw, options)
    t.snapshot(bars(actual), JSON.stringify(options))
  }
})

test('straight line', t => {
  const raw = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  const expected = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    [2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 10.5, 11]
  ]

  for (const i in expected) {
    const actual = smoothish(raw, OPTIONS[i])

    t.deepEqual(actual, expected[i])
  }

  t.snapshot(bars(raw), 'input')
  for (const options of OPTIONS) {
    const actual = smoothish(raw, options)
    t.snapshot(bars(actual), JSON.stringify(options))
  }
})

test('points beyond edge ignored', t => {
  const raw = [null, 2, 3, 4, 5, 6, 7, 8, 9, 10, null, null, null, null, null]

  const expected = [
    [null, 2, 3, 4, 5, 6, 7, 8, 9, 10, null, null, null, null, null],
    [null, 3, 3.5, 4, 5, 6, 7, 8, 8.5, 9, null, null, null, null, null]
  ]

  for (const i in expected) {
    const actual = smoothish(raw, OPTIONS[i])

    t.deepEqual(actual, expected[i])
  }

  t.snapshot(bars(raw), 'input')
  for (const options of OPTIONS) {
    const actual = smoothish(raw, options)
    t.snapshot(bars(actual), JSON.stringify(options))
  }
})

test('missing point is filled in', t => {
  const raw = [
    100, 200, 300, 400, 500,
    undefined,
    700, 800, 900, 1000, 1100, 1200]

  const expected = [
    [
      100, 200, 300, 400, 500,
      600,
      700, 800, 900, 1000, 1100, 1200],
    [
      200, 250, 300, 350, 475,
      600,
      725, 850, 900, 1000, 1050, 1100]
  ]

  for (const i in expected) {
    const actual = smoothish(raw, OPTIONS[i])

    t.deepEqual(actual, expected[i])
  }

  t.snapshot(bars(raw), 'input')
  for (const options of OPTIONS) {
    const actual = smoothish(raw, options)
    t.snapshot(bars(actual), JSON.stringify(options))
  }
})

test('impulse function is smoothed', t => {
  const raw = [
    0, 0, 0, 0, 0, 0,
    100,
    0, 0, 0, 0, 0, 0]

  const expected = [
    [
      0, 0, 0, 0, 20, 20,
      20,
      20, 20, 0, 0, 0, 0],
    [
      0, 0, 0, 0, 20, 20,
      20,
      20, 20, 0, 0, 0, 0]
  ]

  for (const i in expected) {
    const actual = smoothish(raw, OPTIONS[i])

    t.deepEqual(actual, expected[i])
  }

  t.snapshot(bars(raw), 'input')
  for (const options of OPTIONS) {
    const actual = smoothish(raw, options)
    t.snapshot(bars(actual), JSON.stringify(options))
  }
})

test('step function is smoothed', t => {
  const raw = [
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200]

  const expected = [
    [
      100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 120, 140,
      160, 180, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    [
      100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 120, 140,
      160, 180, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200]
  ]

  for (const i in expected) {
    const actual = smoothish(raw, OPTIONS[i])

    t.deepEqual(actual, expected[i])
  }

  t.snapshot(bars(raw), 'input')
  for (const options of OPTIONS) {
    const actual = smoothish(raw, options)
    t.snapshot(bars(actual), JSON.stringify(options))
  }
})

test('zeros are handled correctly', t => {
  const raw = [0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100]

  const expected = [
    [0, 0, 0, 0, 20, 40, 60, 80, 100, 100, 100, 100],
    [0, 0, 0, 0, 20, 40, 60, 80, 100, 100, 100, 100]
  ]

  for (const i in expected) {
    const actual = smoothish(raw, OPTIONS[i])

    t.deepEqual(actual, expected[i])
  }

  t.snapshot(bars(raw), 'input')
  for (const options of OPTIONS) {
    const actual = smoothish(raw, options)
    t.snapshot(bars(actual), JSON.stringify(options))
  }
})

test('an example for documentation', t => {
  const raw = [100, 110, 150, undefined, 200, 300, 400, 1000]

  const expected = [
    [95, 120, 146.571, 190, 247.143, 350, 600, 916.667],
    [120, 120, 140, 190, 262.5, 475, 475, 566.667]
  ]

  for (const i in expected) {
    const actual = smoothish(raw, OPTIONS[i])
    t.deepEqual(quantize(actual), expected[i])
  }

  t.snapshot(bars(raw), 'input')
  for (const options of OPTIONS) {
    const actual = smoothish(raw, options)
    t.snapshot(bars(actual), JSON.stringify(options))
  }
})

test('An empty list is unchanged', t => {
  const raw = []

  const expected = [
    [],
    [],
    [],
    []
  ]

  for (const i in expected) {
    const actual = smoothish(raw, OPTIONS[i])
    t.deepEqual(quantize(actual), expected[i])
  }
})

test('impulse at r=2 (the default)', t => {
  const inject = { radius: 2 }
  const raw = [
    0, 0, 0, 0, 0, 0,
    100,
    0, 0, 0, 0, 0, 0]

  const expected = [
    [
      0, 0, 0, 0, 20, 20,
      20,
      20, 20, 0, 0, 0, 0],
    [
      0, 0, 0, 0, 20, 20,
      20,
      20, 20, 0, 0, 0, 0]
  ]

  for (const i in expected) {
    const opts = { ...inject, ...OPTIONS[i] }
    const actual = smoothish(raw, opts)
    t.deepEqual(quantize(actual), expected[i])
  }

  t.snapshot(bars(raw), 'input')
  for (const options of OPTIONS) {
    const opts = { ...inject, ...options }
    const actual = smoothish(raw, opts)
    t.snapshot(bars(actual), JSON.stringify(opts))
  }
})

test('impulse at r=1', t => {
  const inject = { radius: 1 }
  const raw = [
    0, 0, 0, 0, 0, 0,
    100,
    0, 0, 0, 0, 0, 0]

  const expected = [
    [
      0, 0, 0, 0, 0, 33.333,
      33.333,
      33.333, 0, 0, 0, 0, 0],
    [
      0, 0, 0, 0, 0, 33.333,
      33.333,
      33.333, 0, 0, 0, 0, 0]
  ]

  for (const i in expected) {
    const opts = { ...inject, ...OPTIONS[i] }
    const actual = smoothish(raw, opts)
    t.deepEqual(quantize(actual), expected[i])
  }

  t.snapshot(bars(raw), 'input')
  for (const options of OPTIONS) {
    const opts = { ...inject, ...options }
    const actual = smoothish(raw, opts)
    t.snapshot(bars(actual), JSON.stringify(opts))
  }
})

test('impulse at r=0 (no change)', t => {
  const inject = { radius: 0 }
  const raw = [
    0, 0, 0, 0, 0, 0,
    100,
    0, 0, 0, 0, 0, 0]

  const expected = [
    [
      0, 0, 0, 0, 0, 0,
      100,
      0, 0, 0, 0, 0, 0],
    [
      0, 0, 0, 0, 0, 0,
      100,
      0, 0, 0, 0, 0, 0]
  ]

  for (const i in expected) {
    const opts = { ...inject, ...OPTIONS[i] }
    const actual = smoothish(raw, opts)
    t.deepEqual(quantize(actual), expected[i])
  }

  t.snapshot(bars(raw), 'input')
  for (const options of OPTIONS) {
    const opts = { ...inject, ...options }
    const actual = smoothish(raw, opts)
    t.snapshot(bars(actual), JSON.stringify(opts))
  }
})

test('negative r throws exception', t => {
  const raw = [
    0, 0, 0, 0, 0, 0,
    100,
    0, 0, 0, 0, 0, 0]

  const inject = { radius: -1 }
  for (const options of OPTIONS) {
    const opts = { ...inject, ...options }

    t.throws(() => smoothish(raw, opts), { message: /negative radius/ })
  }
})

test('handling increasing radius', t => {
  const raw = [1, 2, 3, 4, 5, 6]

  for (let radius = 0; radius < 10; ++radius) {
    t.snapshot(bars(raw), 'input')
    const inject = { radius }
    for (const options of OPTIONS) {
      const opts = { ...inject, ...options }
      const actual = smoothish(raw, opts)
      t.snapshot(bars(actual), JSON.stringify(opts))
    }
  }
})

test('null data throws an exception', t => {
  for (const options of OPTIONS) {
    t.throws(() => smoothish(null, options), { message: /null data/ })
  }
})

test('undefined data throws an exception', t => {
  for (const options of OPTIONS) {
    t.throws(() => smoothish(undefined, options), { message: /no data/ })
  }
  t.throws(() => smoothish(), { message: /no data/ })
})
