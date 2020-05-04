<a name="smoothish"></a>

## smoothish(data, options) ⇒ <code>Array.&lt;number&gt;</code>
Smooths data by replacing each point with the least-squared linear interpolations of the points in its neighborhood
Can handle missing data, when there are `null` or `undefined` instead of numbers in the input data.
An optional options argument can contain any of the following fields:
* `radius`, defaulting to 2, specifies the neighborhood width extending from `radius` points below to `radius` points above the current point
* `algorithm`, which can be one of
  * `'leastSquares'` (default) replace each point with the least-squared linear interpolations of the points in its neighborhood
  * `'movingAverage'` replace each point with the moving average of the points in its neighborhood
* `falloff`, which cab be one of
  * `'exponential'` (default) give a weigh of each point that is an exponential decay with a time constant of the radius
  * `'step'` give equal weight to all `radius*2+1` points in the neighborhood, and no weight to points outside the radius

**Kind**: global function  
**Returns**: <code>Array.&lt;number&gt;</code> - smoothed version of the input, with the same length  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>Array.&lt;number&gt;</code> |  | time series of equally-spaced values. |
| options | <code>Object</code> | <code>{radius:2,algorithm:&#x27;leastSquares&#x27;,falloff:&#x27;exponential&#x27;}</code> |  |

