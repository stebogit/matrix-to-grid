const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('@turf/truncate');
const point = require('@turf/helpers').point;
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
        let {matrix, origin, cellSize, props} = json;
        const pointGrid = truncate(matrixToGrid(matrix, origin, cellSize, null, props));

        // Add origin to result
        if (Array.isArray(origin)) {
            origin = point(origin);
        }
        origin.properties['marker-color'] = '#F00';
        pointGrid.features.push(origin);

        if (process.env.REGEN) write.sync(directories.out + name + '.geojson', pointGrid);
        t.deepEquals(pointGrid, load.sync(directories.out + name + '.geojson'), name);
    }
    t.end();
});

