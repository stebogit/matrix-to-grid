import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default [{
    input: 'index.js',
    output: {
        extend: true,
        file: 'matrix-to-grid.js',
        format: 'cjs'
    },
    plugins: [nodeResolve()]
}, {
    input: 'index.js',
    output: {
        extend: true,
        file: 'matrix-to-grid.min.js',
        format: 'umd',
        name: 'matrixToGrid'
    },
    plugins: [nodeResolve(), uglify()]
}];
