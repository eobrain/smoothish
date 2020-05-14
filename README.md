# smoothish -- Smoothing out time-series data with boundary and missing data handling

The Smoothish JavaScript library provides variations of centered moving average functions that are
robust to missing data and don't drop points at the beginning and end boundary.

## import

```js
import smoothish from 'smoothish'
```

## Basic Usage

Consider the following time series of twelve values:

```js
//                    Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dex
const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
```

This makes for a rather jagged graph:

![spark](https://quickchart.io/chart?h=32&w=120&c={type:%27sparkline%27,data:{datasets:[{data:[31,28,31,30,31,30,31,31,30,31,30,31]}]}})

We can apply the `smoothish` function to smooth out the data:

```js
const smoothed = smoothish(daysPerMonth)
// --> [ 30.1, 29.7, 30.1, 30.3, 30.4, 30.5, 30.6, 30.6, 30.5, 30.6, 30.5, 30.7 ]
```

![spark](https://quickchart.io/chart?h=32&w=120&c={type:%27sparkline%27,data:{datasets:[{data:[30.129111123466714,29.696645864438633,30.12965488974025,30.250804579831744,30.437108922647404,30.45807544800684,30.597621480630146,30.620160847394303,30.530456775905243,30.59874362878437,30.52830208522387,30.72764548273118]}]}})

## Handling missing data

Consider an array of data that has some missing data:

```js
const incompleteDaysPerMonth = [31, 28, undefined, 30, 31, null, 31, 31, null, 31, 30, 31]
```

![spark](https://quickchart.io/chart?h=32&w=120&c={type:%27sparkline%27,data:{datasets:[{data:[31,28,null,30,31,null,31,31,null,31,30,31]}]}})

The smoothing function bridges over missing points

```js
const smoothedIncomplete = smoothish(incompleteDaysPerMonth)
// --> [ 30.0, 29.4, 29.8, 30.1, 30.5, 30.6, 30.8, 30.8, 30.8, 30.7, 30.6, 30.7 ]
```

![spark](https://quickchart.io/chart?h=32&w=120&c={type:%27sparkline%27,data:{datasets:[{data:[30.015137501774436,29.424929353083524,29.75171363723357,30.102422700866438,30.476707576846575,30.630669325793804,30.777682797566356,30.82379051138026,30.78167400756181,30.73464088270357,30.582421226877806,30.743252597796296]}]}})

Or here's another example of a linear increasing set of numbers with some missing.

```js
const linear = [undefined, 200, 300, undefined, 500, undefined, 700, 800, 900]
```

The smoothish function fills in the interior missing data points, though note that it does *not* extrapolate missing values at the beginning and end.

```js
const smoothedLinear = smoothish(linear)
// --> [ undefined, 200, 300, 400, 500, 600, 700, 800, 900 ]
```

![spark](https://quickchart.io/chart?h=32&w=120&c={type:%27sparkline%27,data:{datasets:[{data:[null,200.00000000000006,300.00000000000006,400,500,600,700.0000000000001,800.0000000000002,899.9999999999999]}]}})

## Changing the radius

All of the above examples use the default *radius* of 2, which means the smoothing is similar to a 5-point moving average (using a neighborhood that includes the center point and two points on either side).

We can specify a different value of the radius in an in an optional second argument to `smoothish`.

This is best seen with a step function that abruptly changes value:

```js
const stepFunction = [100, 100, 100, 100, 100, 200, 200, 200, 200, 200]
```

![spark](https://quickchart.io/chart?h=32&w=120&c={type:%27sparkline%27,data:{datasets:[{data:[100,100,100,100,100,200,200,200,200,200]}]}})

Setting the radius to `1` produces a some smoothing:

```js
const radius1 = smoothish(stepFunction, { radius: 1 })
// --> [ 98.6, 99.9, 102, 109, 126, 174, 191, 198, 200, 201 ]
```

![spark](https://quickchart.io/chart?h=32&w=120&c={type:%27sparkline%27,data:{datasets:[{data:[98.55933218122021,99.88957109564447,102.49355414148502,109.03897130928914,126.49386106433514,173.50613893566484,190.96102869071086,197.50644585851495,200.1104289043555,201.44066781877981]}]}})

 Increasing the radius to `2` (the default) increases the smoothing.

```js
const radius2 = smoothish(stepFunction, { radius: 2 })
// --> [ 91.6, 98.1, 106, 118, 136, 164, 182, 194, 202, 208 ]
```

![spark](https://quickchart.io/chart?h=32&w=120&c={type:%27sparkline%27,data:{datasets:[{data:[91.61712132126962,98.06424644444105,105.98911777969002,117.56917503032409,135.63449142691422,164.36550857308572,182.4308249696759,194.01088222030998,201.93575355555885,208.38287867873044]}]}})

 And increasing the radius to `3` increases the smoothing more.

```js
const radius3 = smoothish(stepFunction, { radius: 3 })
// --> [ 87.5, 97.0, 108, 121, 138, 162, 179, 192, 203, 212 ]
```

![spark](https://quickchart.io/chart?h=32&w=120&c={type:%27sparkline%27,data:{datasets:[{data:[87.5115656656214,96.99101275214392,107.56289913236607,120.86002568093073,138.3381199767217,161.66188002327831,179.13997431906924,192.4371008676339,203.00898724785625,212.4884343343786]}]}})

## The Least-Squares algorithm

Bu default `smoothish` uses a a least-squares linear interpolation for each point using the values of neighboring points, and replaces each point with the interpolated point.

## Exponential falloff

By default "neighboring points" are all points, but with the ones closer having more weight with an exponential decay in both directions with a time constant of `radius`.

## Using different algorithms and falloffs

As an alternative to the least-squares based smoothing, you can have `smoothish` do moving-average smoothing by adding a `algorithm: 'movingAverage'` property to the optional second parameter.

And as an alternative to the exponential falloff you can set `falloff: 'step'` to include only the points within `radius` and to have them equally weighted.

So for example to get a standard five-point moving average, you can use the following. (A `radius` of `2` means that 2 previous, 2 following, and the current point are included, giving a total of five points being averaged for each point.) )

```js
const movingAverage = smoothish(daysPerMonth,
  { algorithm: 'movingAverage', falloff: 'step', radius: 2 })
// --> [ 30.0, 30.0, 30.2, 30.0, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.5, 30.7 ]
```

![spark](https://quickchart.io/chart?h=32&w=120&c={type:%27sparkline%27,data:{datasets:[{data:[30,30,30.2,30,30.6,30.6,30.6,30.6,30.6,30.6,30.5,30.666666666666668]}]}})

Note that this is a *centered* (not lagging) moving average.

Also note that it produces as many output points as there are input points.  That means that there is special handling of the boundaries. So in the above example 5 points are averaged for each interior point, but only 3 points are averaged at the end points.

If you really want to match a standard moving average exactly you would need to lop off `radius` points from each end of the result:

```js
const strictMovingAverage = movingAverage.slice(2, -2)
// --> [ 30.2, 30.0, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6 ]
```

![spark](https://quickchart.io/chart?h=32&w=120&c={type:%27sparkline%27,data:{datasets:[{data:[30.2,30,30.6,30.6,30.6,30.6,30.6,30.6]}]}})

Note for many cases the default `algorithm: 'leastSquares'` gives better results than `algorithm: 'movingAverage'`. For example see how the smoothing of the incomplete linear data below is worse than than the straight line produces by the default algorithm above.

```js
const movingAverageLinear = smoothish(linear,
  { algorithm: 'movingAverage', falloff: 'step' })
// --> [ undefined, 250, 333, 333, 500, 667, 725, 800, 800 ]
```

![spark](https://quickchart.io/chart?h=32&w=120&c={type:%27sparkline%27,data:{datasets:[{data:[null,250,333.3333333333333,333.3333333333333,500,666.6666666666666,725,800,800]}]}})

## More Details

See also [API docs](api.md).

The [tests](test/test.js) and its [snapshots](test/snapshots/test.js.md) also have examples.

## Legal

Copyright (c) 2020 Eamonn O'Brien-Strain All rights reserved. This
program and the accompanying materials are made available under the
terms of the Eclipse Public License v1.0 which accompanies this
distribution, and is available at
http://www.eclipse.org/legal/epl-v10.html

> This is a purely personal project, not a project of my employer.
