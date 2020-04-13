const { movingAverage, fullSmooth } = require('./index.js')

const formatter = Intl.NumberFormat(undefined, {
  minimumSignificantDigits: 3,
  maximumSignificantDigits: 3
})

// print an array of numbers
const print = xs => console.log('[', xs.map(x => formatter.format(x)).join(', '), ']')

//                    Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dex
const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

print(daysPerMonth)
// --> [ 31.0, 28.0, 31.0, 30.0, 31.0, 30.0, 31.0, 31.0, 30.0, 31.0, 30.0, 31.0 ]

print(movingAverage(daysPerMonth))
// --> [ 30.2, 30.0, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6 ]

print(fullSmooth(daysPerMonth))
// --> [ 30.0, 30.0, 30.2, 30.0, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.7 ]

const incompleteDaysPerMonth = [31, 28, undefined, 30, 31, null, 31, 31, null, 31, 30, 31]

print(movingAverage(incompleteDaysPerMonth))
// --> [ 30.0, 29.7, 30.7, 30.8, 31.0, 31.0, 30.8, 30.8 ]

print(fullSmooth(incompleteDaysPerMonth))
// --> [ 31.0, 29.7, 30.0, 30.0, 30.6, 30.8, 31.0, 31.0, 30.8, 30.8, 30.7, 30.7 ]

const linear = [undefined, 200, 300, undefined, 500, undefined, 700, 800, 900]
print(linear)
// --> [ NaN, 200, 300, NaN, 500, NaN, 700, 800, 900 ])

print(movingAverage(linear))
// --> [ 333, 333, 500, 667, 725 ]

print(fullSmooth(linear))
// --> [ 100, 200, 300, 400, 500, 600, 700, 800, 900 ]

const stepFunction = [100, 100, 100, 100, 100, 200, 200, 200, 200, 200]
print(stepFunction)
// --> [ 100, 100, 100, 100, 100, 200, 200, 200, 200, 200 ]

print(fullSmooth(stepFunction, 0))
// --> [ 100, 100, 100, 100, 100, 200, 200, 200, 200, 200 ]
print(fullSmooth(stepFunction, 1))
// --> [ 100, 100, 100, 100, 133, 167, 200, 200, 200, 200 ]
print(fullSmooth(stepFunction, 2))
// --> [ 100, 100, 100, 120, 140, 160, 180, 200, 200, 200 ]
print(fullSmooth(stepFunction, 3))
// --> [ 100, 100, 110, 129, 143, 157, 171, 190, 200, 200 ]
