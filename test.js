const fs = require('fs');
const test = require('tape');
const path = require('path');
const glob = require('glob');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('@turf/truncate');
const {point} = require('@turf/helpers');
const circle = require('@turf/circle');
const matrixToGrid = require('./');

test('matrix-to-grid', t => {
    glob.sync(path.join(__dirname, 'test', 'in', '*.json')).forEach(filepath => {
        // Fixtures
        const {name, dir} = path.parse(filepath);
        const out = dir.replace(path.join('test', 'in'), path.join('test', 'out'))
        const {matrix, origin, cellSize, options} = load.sync(filepath);

        // Calculate results
        let results = matrixToGrid(matrix, origin, cellSize, options);

        // Add circle to results
        results.features.push(circle(origin, cellSize / 15, {
            steps: 20,
            units: options.units,
            properties: {
                stroke: '#F00',
                'stroke-width': 4
            }
        }));
        results = truncate(results)

        // Save results
        if (process.env.REGEN) write.sync(path.join(out, name + '.geojson'), results);
        t.deepEquals(results, load.sync(path.join(out, name + '.geojson')), name);
    });
    t.end();
});

