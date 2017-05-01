var helpers = require('@turf/helpers');
var point = helpers.point;
var featureCollection = helpers.featureCollection;
var mercator = require('global-mercator');

/**
 * Takes a {@link Point} grid and returns a correspondent matrix {Array<Array<number>>}
 * of the 'property' values
 *
 * @name matrixToGrid
 * @param {Array<Array<number>>} matrix of numbers
 * @param {Point|Array<number>} origin position of the first bottom-left (South-West) point of the grid
 * @param {number} cellSize the distance across each cell
 * @param {Object} options optional parameters
 * @param {string} [options.zProperty='elevation'] the grid points property name associated with the matrix value
 * @param {Object} [options.properties={}] GeoJSON properties passed to all the points
 * @param {string} [options.units=kilometers] used in calculating cellSize, can be miles, or kilometers
 * @returns {FeatureCollection<Point>} grid of points
 *
 * @example
 *    var matrixToGrid = require('matrix-to-grid');
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
 *    matrixToGrid(matrix, origin, 10);
 *    //= pointGrid
 */
module.exports = function (matrix, origin, cellSize, options) {
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

    // default values
    options = options || {};
    options.zProperty = options.zProperty || 'elevation';

    if (options.units === 'miles') {
        cellSize *= 1.60934; // km
    }
    cellSize *= 1000; // meters

    var originCoordsMeters = mercator.lngLatToMeters(origin.geometry.coordinates);
    var x0 = originCoordsMeters[0];
    var y0 = originCoordsMeters[1];

    var points = [];
    for (var r = 0; r < matrixRows; r++) {
        // create first point in the row
        var firstCoordsMeters = [x0, y0 + cellSize * r];
        var first = point(mercator.metersToLngLat(firstCoordsMeters));
        first.properties[options.zProperty] = matrix[matrixRows - 1 - r][0];
        for (var prop in options.properties) {
            first.properties[prop] = options.properties[prop];
        }
        points.push(first);
        for (var c = 1; c < matrixCols; c++) {
            // create the other points in the same row
            var pointCoordsMeters = [x0 + cellSize * c, firstCoordsMeters[1]];
            var pt = point(mercator.metersToLngLat(pointCoordsMeters));
            for (var prop2 in options.properties) {
                pt.properties[prop2] = options.properties[prop2];
            }
            // add matrix property
            var val = matrix[matrixRows - 1 - r][c];
            pt.properties[options.zProperty] = val;
            points.push(pt);
        }
    }

    var grid = featureCollection(points);
    return grid;
};
