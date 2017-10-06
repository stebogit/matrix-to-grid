const glob = require('glob');
const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const gridToMatrix = require('./');

/**
 * Benchmark Results
 *
 * 3x4-at-0 x 91,863 ops/sec ±3.31% (77 runs sampled)
 * 3x4 x 92,985 ops/sec ±2.28% (80 runs sampled)
 * 5x5 x 45,757 ops/sec ±3.73% (78 runs sampled)
 * 8x8-at-10 x 18,778 ops/sec ±1.44% (79 runs sampled)
 */
const suite = new Benchmark.Suite('grid-to-matrix');
glob.sync(path.join(__dirname, 'test', 'in', '*.json')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const {matrix, origin, cellSize, options} = load.sync(filepath);
    suite.add(name, () => gridToMatrix(matrix, origin, cellSize, options));
})
suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();

