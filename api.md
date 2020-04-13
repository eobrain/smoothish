## Functions

<dl>
<dt><a href="#movingAverage">movingAverage(data, [radius])</a> ⇒ <code>Array.&lt;number&gt;</code></dt>
<dd><p>Smooths data using entered moving point average.
Can handle missing data, when there are <code>null</code> or <code>undefined</code> instead of numbers in the input data.</p>
</dd>
<dt><a href="#fullSmooth">fullSmooth(data, [radius])</a> ⇒ <code>Array.&lt;number&gt;</code></dt>
<dd><p>Smooths data by replacing each point with the least-squared linear interpolations of the points in its neighborhood
Can handle missing data, when there are <code>null</code> or <code>undefined</code> instead of numbers in the input data.</p>
</dd>
</dl>

<a name="movingAverage"></a>

## movingAverage(data, [radius]) ⇒ <code>Array.&lt;number&gt;</code>
Smooths data using entered moving point average.
Can handle missing data, when there are `null` or `undefined` instead of numbers in the input data.

**Kind**: global function  
**Returns**: <code>Array.&lt;number&gt;</code> - centered moving average of the data, with length  `2*radius` shorter than the original data  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>Array.&lt;number&gt;</code> |  | timeseries of equally-spaced values. |
| [radius] | <code>number</code> | <code>2</code> | specifies the moving-point window to be 2*`radius`+1 wide |

<a name="fullSmooth"></a>

## fullSmooth(data, [radius]) ⇒ <code>Array.&lt;number&gt;</code>
Smooths data by replacing each point with the least-squared linear interpolations of the points in its neighborhood
Can handle missing data, when there are `null` or `undefined` instead of numbers in the input data.

**Kind**: global function  
**Returns**: <code>Array.&lt;number&gt;</code> - smoothed version of the input, with the same length  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>Array.&lt;number&gt;</code> |  | timeseries of equally-spaced values. |
| [radius] | <code>number</code> | <code>2</code> | specifies the neighborhood width extending from `radius` points below to `radius` points above the current point |

