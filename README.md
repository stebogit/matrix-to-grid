# matrix-to-grid
<!-- [![Build Status](https://travis-ci.org/stebogit/matrix-to-grid.svg?branch=master)](https://travis-ci.org/stebogit/matrix-to-grid) -->
[![Build Status](https://travis-ci.org/stebogit/matrix-to-grid.svg?branch=master)](https://travis-ci.org/stebogit/matrix-to-grid)
[![npm version](https://badge.fury.io/js/matrix-to-grid.svg)](https://badge.fury.io/js/matrix-to-grid)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/stebogit/matrix-to-grid/blob/master/LICENSE)

Takes a matrix of the values and returns a [Point](http://geojson.org/geojson-spec.html#point) grid mapping the values of the matrix as `property`

**Parameters**

- `matrix` \[**[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<Array<<[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>**] of numbers

- `origin` \[**[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)> | [Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[Point](http://geojson.org/geojson-spec.html#point)>**] position of the first bottom-left (South-West) point of the grid

-   `cellSize` \[**[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**] the distance across each cell

- `options` \[**[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**] optional parameters:

    - `zProperty` \[**[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**] the name of the property of the points which will represent the correspondent matrix value (optional, default `elevation`)
    
    - `properties` \[**[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**] GeoJSON properties passed to all the points (optional, default `{}`)
    
    - `units` \[**[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**] miles or kilometers (optional, default `kilometers`)

**Returns**

Returns a \[**[FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)&lt;[Point](http://geojson.org/geojson-spec.html#point)>**] grid of points having each the correspondend p`property` value of the matrix


### Installation

**npm**

```sh
$ npm install matrix-to-grid
```

**browser (ES5)**

```html
<script src="https://unpkg.com/matrix-to-grid/matrix-to-grid.min.js"></script>
```

### Quickstart

```javascript
  var matrixToGrid = require('matrix-to-grid');
  var matrix = [
    [ 1, 13, 20,  9, 10, 13, 18],
    [34,  8,  0,  4,  5,  8, 13],
    [10,  5,  2,  1,  2,  5, 24],
    [ 0,  4, 56, 19,  0,  4,  9],
    [10,  5,  2, 12,  2,  5, 10],
    [57,  8,  5,  4,  5,  0, 57],
    [ 3, 13,  0,  9,  5, 13, 35],
    [18, 13, 10,  9, 78, 13, 18]
  ];
  var origin = [-70.823364, -33.553984];
  matrixToGrid(matrix, origin, 10);
  // = pointGrid
```

