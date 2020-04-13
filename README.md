# smoothish -- Smoothing out time-series data with boundary and missing data handling


The Smoothish JavaScript library provides variations of centered moving average functions that are
robust to missing data and don't drop points at the beginning and end boundary.

See also [API docs](api.md).

## Installation and import

Installation:

```sh
npm install smoothish
```

Import (classic):

```js
const { movingAverage, fullSmooth } = require('smoothish')
```

or (modern):

```js
import { movingAverage, fullSmooth } from 'smoothish'
```

## Avoiding dropped points at boundary

Consider the following time series of twelve values:

```js
//                    Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dex
const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
```

This makes for a rather jagged graph:

```js
print(daysPerMonth)
// --> [ 31.0, 28.0, 31.0, 30.0, 31.0, 30.0, 31.0, 31.0, 30.0, 31.0, 30.0, 31.0 ]
```

![spark](https://quickchart.io/chart?h=32&w=120&c={type:%27sparkline%27,data:{datasets:[{data:[31.0,28.0,31.0,30.0,31.0,30.0,31.0,31.0,30.0,31.0,30.0,31.0]}]}})

We can apply the `movingAverage` function to smooth out the data:

```js
print(movingAverage(daysPerMonth))
// --> [ 30.2, 30.0, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6 ]
```

![spark](https://quickchart.io/chart?h=32&w=80&c={type:%27sparkline%27,data:{datasets:[{data:[30.2,30.0,30.6,30.6,30.6,30.6,30.6,30.6]}]}})

But note that the above output only has eight of the original twelve data points. That is because this is a five-point centered moving average, which for every point averages the five points withing a radius of two points of the current point, which means the first two and last two points are dropped.

But the Smoothish library also has a `fullSmooth` function which does not drop any points:

```js
print(fullSmooth(daysPerMonth))
// --> [ 30.0, 30.0, 30.2, 30.0, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.7 ]
```
![spark](https://quickchart.io/chart?h=32&w=120&c={type:%27sparkline%27,data:{datasets:[{data:[30.0,30.0,30.2,30.0,30.6,30.6,30.6,30.6,30.6,30.6,30.6,30.7]}]}})

## Handling missing points

Consider an array of data that has some missing data:

```js
const incompleteDaysPerMonth = [31, 28, undefined, 30, 31, null, 31, 31, null, 31, 30, 31]
```

![spark](https://quickchart.io/chart?h=32&w=120&c={type:%27sparkline%27,spanGaps:false,data:{datasets:[{data:[31,28,null,30,31,null,31,31,null,31,30,31]}]}})

Both of the smoothing functions fill in the missing points:

```js
print(movingAverage(incompleteDaysPerMonth))
// --> [ 30.0, 29.7, 30.7, 30.8, 31.0, 31.0, 30.8, 30.8 ]
```
![spark](https://quickchart.io/chart?h=32&w=80&c={type:%27sparkline%27,data:{datasets:[{data:[30.0,29.7,30.7,30.8,31.0,31.0,30.8,30.8]}]}})


```js
print(fullSmooth(incompleteDaysPerMonth))
// --> [ 31.0, 29.7, 30.0, 30.0, 30.6, 30.8, 31.0, 31.0, 30.8, 30.8, 30.7, 30.7 ]
```

![spark](https://quickchart.io/chart?h=32&w=120&c={type:%27sparkline%27,data:{datasets:[{data:[31.0,29.7,30.0,30.0,30.6,30.8,31.0,31.0,30.8,30.8,30.7,30.7]}]}})

In the case of a linear graph with missing points...


```js
const linear = [undefined, 200, 300, undefined, 500, undefined, 700, 800, 900]
print(linear)
// --> [ NaN, 200, 300, NaN, 500, NaN, 700, 800, 900 ])
```

![spark](https://quickchart.io/chart?h=32&w=90&c={type:%27sparkline%27,data:{datasets:[{data:[null,200,300,null,500,null,700,800,900]}]}})

... the `movingAverage` functions fills in somewhat crudely:

```js
print(movingAverage(linear))
// --> [ 333, 333, 500, 667, 725 ]
```

![spark](https://quickchart.io/chart?h=32&w=50&c={type:%27sparkline%27,data:{datasets:[{data:[333,333,500,667,725]}]}})

...but the `fullSmooth` functions fills in perfectly:

```js
print(fullSmooth(linear))
// --> [ 100, 200, 300, 400, 500, 600, 700, 800, 900 ]
```

![spark](https://quickchart.io/chart?h=32&w=90&c={type:%27sparkline%27,data:{datasets:[{data:[100,200,300,400,500,600,700,800,900]}]}})

This is because `fullSmooth` does a least-squares linear interpolation for each point using the values of whatever neighboring points are available.

## Changing the radius

All of the above examples use the default *radius* of 2, which means the smoothing is a 5-point moving average (using a window that includes the center point and two points on either side).

We can specify a different value of the radius as an optional second argument to `movingAverage` or `fullSmooth`.

This is best seen with a step function that abruptly changes value:

```js
const stepFunction = [100, 100, 100, 100, 100, 200, 200, 200, 200, 200]
print(stepFunction)
// --> [ 100, 100, 100, 100, 100, 200, 200, 200, 200, 200 ]
```

![spark](https://quickchart.io/chart?h=32&w=100&c={type:%27sparkline%27,data:{datasets:[{data:[100,100,100,100,100,200,200,200,200,200]}]}})

A radius of zero means do no smoothing, so the output is the same as the input:

```js
print(fullSmooth(stepFunction, 0))
// --> [ 100, 100, 100, 100, 100, 200, 200, 200, 200, 200 ]
```

![spark](https://quickchart.io/chart?h=32&w=100&c={type:%27sparkline%27,data:{datasets:[{data:[100,100,100,100,100,200,200,200,200,200]}]}})

A radius of 1 adds some smoothing that extends over three points.

```js
print(fullSmooth(stepFunction, 1))
// --> [ 100, 100, 100, 100, 133, 167, 200, 200, 200, 200 ]
```

![spark](https://quickchart.io/chart?h=32&w=100&c={type:%27sparkline%27,data:{datasets:[{data:[100,100,100,100,133,167,200,200,200,200]}]}})

A radius of 2 is the default, so adding it is equivalent to ommitting the second argument. This extends the smoothing over five points.

```js
print(fullSmooth(stepFunction, 2))
// --> [ 100, 100, 100, 120, 140, 160, 180, 200, 200, 200 ]
```

![spark](https://quickchart.io/chart?h=32&w=100&c={type:%27sparkline%27,data:{datasets:[{data:[100,100,100,120,140,160,180,200,200,200]}]}})
```js

And a radius of 3 extends the smoothing even further, over seven points.

print(fullSmooth(stepFunction, 3))
// --> [ 100, 100, 110, 129, 143, 157, 171, 190, 200, 200 ]
```
![spark](https://quickchart.io/chart?h=32&w=100&c={type:%27sparkline%27,data:{datasets:[{data:[100,100,110,129,143,157,171,190,200,200]}]}})
