import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import html from "@open-wc/rollup-plugin-html";

const config = {
  input: './index.html',
  output: {
    dir: 'build',
    format: 'es',
  },
  plugins: [
    copy({
      targets: [
        { src: 'assets/', dest: 'build/' },
        { src: 'global.css', dest: 'build/' },
        { src: 'fast-components.min.js', dest: 'build/' }
      ]
    }),
    resolve(),
    terser(),
    html()
  ]
};

export default config;


