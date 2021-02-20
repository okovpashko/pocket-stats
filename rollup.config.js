import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'resources/pages/index/index.js',
  output: {
    dir: 'public/build',
    format: 'iife'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
  ]
};
