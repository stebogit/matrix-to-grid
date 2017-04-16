var destination = require('@turf/destination');
var helpers = require('@turf/helpers');
var point = helpers.point;
var featureCollection = helpers.featureCollection;

/**
 * Takes a {@link Point} grid and returns a correspondent matrix {Array<Array<number>>}
 * of the 'property' values
 *
 * @name matrixToGrid
 * @param {Array<Array<number>>} matrix of numbers
 * @param {Point|Array<number>} origin position of the first bottom-left point of the grid
 * @param {number} [cellSize] the distance across each cell
 * @param {string} [property='elevation'] the grid points property name associated with the matrix value
 * @param {Object=} [props=] properties passed to all the points
 * @param {string} [units=kilometers] used in calculating cellSize, can be degrees, radians, miles, or kilometers
 * @returns {FeatureCollection<Point>} grid of points
 *
 * @example
 *    var matrixToGrid = require('matrix-to-grid');
 *
 *    var matrix = [
 *      [ 1, 13, 20,  9, 10, 13, 18],
 *      [34,  8,  0,  4,  5,  8, 13],
 *      [10,  5,  2,  1,  2,  5, 24],
 *      [ 0,  4, 56, 19,  0,  4,  9],
 *      [10,  5,  2, 12,  2,  5, 10],
 *      [57,  8,  5,  4,  5,  0, 57],
 *      [ 3, 13,  0,  9,  5, 13, 35],
 *      [18, 13, 10,  9, 78, 13, 18]
 *    ];
 *    var origin = [-70.823364, -33.553984]
 *
 *    matrixToGrid(matrix, origin, 10);
 *    //= pointGrid
 */
module.exports = function (matrix, origin, cellSize, property, props, units) {
    // validation
    if (!matrix || !Array.isArray(matrix)) throw new Error('matrix is required');
    if (!origin) throw new Error('origin is required');
    if (Array.isArray(origin)) {
        origin = point(origin); // Convert GeoJSON to bbox
    }
    // all array same size
    var matrixCols = matrix[0].length;
    var matrixRows = matrix.length;
    for (var row = 1; row < matrixRows; row++) {
        if (matrix[row].length !== matrixCols) throw new Error('matrix requires all rows of equal size');
    }

    // default value
    property = property || 'elevation';

    var points = [];
    for (var r = 0; r < matrixRows; r++) {
        var first = destination(origin, cellSize * r, 0, units);
        if (props) first.properties = props;
        first.properties[property] = matrix[matrixRows - 1 - r][0];
        points.push(first);
        for (var c = 1; c < matrixCols; c++) {
            var pt = destination(first, cellSize * c, 90, units);
            // add matrix property
            if (props) pt.properties = props;
            pt.properties[property] = matrix[matrixRows - 1 - r][c];
            points.push(pt);
        }
    }

    return featureCollection(points);
};
