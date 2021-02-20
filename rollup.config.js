import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only'

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'resources/pages/index/index.js',
  output: {
    dir: 'public/build',
    format: 'iife'
  },
  plugins: [
    css({ output: 'bundle.css' }),
    nodeResolve(),
    commonjs(),
    isProduction && terser()
  ]
};
