import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'resources/pages/index/index.js',
  output: {
    dir: 'public/build',
    format: 'iife'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    isProduction && terser()
  ]
};
