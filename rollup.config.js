import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import json from 'rollup-plugin-json'

export default {
  entry: path.join(__dirname, 'index.js'),
  dest: path.join(__dirname, 'dist', 'matrix-to-grid.js'),
  format: 'umd',
  plugins: [
    json(),
    resolve(),
    commonjs(),
    globals(),
    builtins()
  ],
  useStrict: false,
  moduleName: 'matrixToGrid'
}
