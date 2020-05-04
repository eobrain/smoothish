const smoothish = require('./index.js')

const formatter = Intl.NumberFormat(undefined, {
  minimumSignificantDigits: 3,
  maximumSignificantDigits: 3
})

const format = x => x === undefined || x === null ? `${x}` : formatter.format(x)

// print an array of numbers
const print = (name, xs) => {
  console.log('\n', name)
  console.log('```js')
  console.log('// --> [', xs.map(format).join(', '), ']')
  console.log('```')
  const strings = xs.map(x => x === undefined ? 'null' : `${x}`)
  const data = `{datasets:[{data:[${strings.join()}]}]}`
  const url = `https://quickchart.io/chart?h=32&w=120&c={type:%27sparkline%27,data:${data}}`
  console.log(`![spark](${url})`)
}

//                    Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dex
const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
print('daysPerMonth', daysPerMonth)

const smoothed = smoothish(daysPerMonth)
print('smoothed', smoothed)

const incompleteDaysPerMonth = [31, 28, undefined, 30, 31, null, 31, 31, null, 31, 30, 31]
print('incompleteDaysPerMonth', incompleteDaysPerMonth)

const smoothedIncomplete = smoothish(incompleteDaysPerMonth)
print('smoothedIncomplete', smoothedIncomplete)

const linear = [undefined, 200, 300, undefined, 500, undefined, 700, 800, 900]
print('linear', linear)

const smoothedLinear = smoothish(linear)
print('smoothedLinear', smoothedLinear)

const stepFunction = [100, 100, 100, 100, 100, 200, 200, 200, 200, 200]
print('stepFunction', stepFunction)

const unchanged = smoothish(stepFunction, { radius: 0 })
print('unchanged', unchanged)
const radius1 = smoothish(stepFunction, { radius: 1 })
print('radius1', radius1)
const radius2 = smoothish(stepFunction, { radius: 2 })
print('radius2', radius2)
const radius3 = smoothish(stepFunction, { radius: 3 })
print('radius3', radius3)

const movingAverage = smoothish(daysPerMonth,
  { algorithm: 'movingAverage', falloff: 'step', radius: 2 })
print('movingAverage', movingAverage)

const strictMovingAverage = movingAverage.slice(2, -2)
print('strictMovingAverage', strictMovingAverage)

const movingAverageLinear = smoothish(linear,
  { algorithm: 'movingAverage', falloff: 'step' })
print('movingAverageLinear', movingAverageLinear)
