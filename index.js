var helpers = require('@turf/helpers');
var point = helpers.point;
var featureCollection = helpers.featureCollection;
var pointGrid = require('@turf/point-grid');
var invariant = require('@turf/invariant');
var getCoords = invariant.getCoords;
var meta = require('@turf/meta');
var featureEach = meta.featureEach;
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
        origin = point(origin); // Convert array to point
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

    var x0 = origin.geometry.coordinates[0];
    var y0 = origin.geometry.coordinates[1];

    var gridWidth = cellSize * (matrixCols - 1);
    var gridHight = cellSize * (matrixRows - 1);

    if (options.units === 'miles') {
        gridWidth *= 1.60934; // km
        gridHight *= 1.60934;
    }

    var originCoordsMeters = mercator.lngLatToMeters([x0, y0]);
    var xMax = originCoordsMeters[0] + gridWidth * 1000;
    var yMax = originCoordsMeters[1] + gridHight * 1000;
    var maxCoords = mercator.metersToLngLat([xMax, yMax]);

    var extent = [x0, y0, maxCoords[0], maxCoords[1]]; // [ minX, minY, maxX, maxY ]

    var grid = pointGrid(extent, cellSize, options.units, true);
    var orderedPoints = sortPointsByLatLng(grid);

    // add property value to the points
    for (var r = 0; r < orderedPoints.length; r++) {
        for (var c = 0; c < orderedPoints.length; c++) {
            orderedPoints[r][c].properties[options.zProperty] = matrix[r][c];
        }
    }

    var points = [].concat.apply([], orderedPoints); // flatten arrays
    var output = featureCollection(points);
    return output;
};


/**
 * Sorts points by latitude and longitude, creating a 2-dimensional array of points
 *
 * @private
 * @param {FeatureCollection<Point>} points GeoJSON Point features
 * @returns {Array<Array<Point>>} points by latitude and longitude
 */
function sortPointsByLatLng(points) {
    var pointsByLatitude = {};

    // divide points by rows with the same latitude
    featureEach(points, function (point) {
        var lat = getCoords(point)[1];
        if (!pointsByLatitude[lat]) {
            pointsByLatitude[lat] = [];
        }
        pointsByLatitude[lat].push(point);
    });

    // sort points (with the same latitude) by longitude
    var orderedRowsByLatitude = Object.keys(pointsByLatitude).map(function (lat) {
        var row = pointsByLatitude[lat];
        var rowOrderedByLongitude = row.sort(function (a, b) {
            return getCoords(a)[0] - getCoords(b)[0];
        });
        return rowOrderedByLongitude;
    });

    // sort rows (of points with the same latitude) by latitude
    var pointMatrix = orderedRowsByLatitude.sort(function (a, b) {
        return getCoords(b[0])[1] - getCoords(a[0])[1];
    });
    return pointMatrix;
}
