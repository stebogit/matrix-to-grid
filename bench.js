const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const gridToMatrix = require('./');

const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
  return {
    name: path.parse(filename).name,
    geojson: load.sync(directory + filename)
  };
});

/**
 * Benchmark Results
 *
 * 3x4 x 248,559 ops/sec ±1.36% (81 runs sampled)
 * 5X5 x 110,313 ops/sec ±2.40% (78 runs sampled)
 * 8x8 x 45,369 ops/sec ±2.24% (81 runs sampled)
 */
const suite = new Benchmark.Suite('grid-to-matrix');
for (const {name, geojson} of fixtures) {
    let {matrix, origin, cellSize, props} = geojson;
    suite.add(name, () => gridToMatrix(matrix, origin, cellSize, null, props));
}

suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();

