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
 * 3x4-at-0 x 43,890 ops/sec ±3.44% (77 runs sampled)
 * 3x4 x 40,556 ops/sec ±2.42% (78 runs sampled)
 * 5x5 x 19,733 ops/sec ±2.12% (79 runs sampled)
 * 8x8 x 7,431 ops/sec ±3.12% (77 runs sampled)
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

