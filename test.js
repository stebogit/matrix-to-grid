const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('@turf/truncate');
const point = require('@turf/helpers').point;
const circle = require('@turf/circle');
const matrixToGrid = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        json: load.sync(directories.in + filename)
    };
});

test('matrix-to-grid', t => {
    for (const {filename, name, json} of fixtures) {
        let {matrix, origin, cellSize, options} = json;
        const result = truncate(matrixToGrid(matrix, origin, cellSize, options));

        // Add origin to result
        if (Array.isArray(origin)) {
            origin = point(origin);
        }
        var units = options ? options.units : null;
        var c = circle(origin, cellSize / 15, 20, units);
        c.properties['stroke'] = '#F00';
        c.properties['stroke-width'] = 4;
        result.features.push(c);

        if (process.env.REGEN) write.sync(directories.out + name + '.geojson', result);
        t.deepEquals(result, load.sync(directories.out + name + '.geojson'), name);
    }
    t.end();
});

