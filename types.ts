import matrixToGrid from './'

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
var origin = [-70.823364, -33.553984]
matrixToGrid(matrix, origin, 10);
matrixToGrid(matrix, origin, 10, {units: 'miles'});
