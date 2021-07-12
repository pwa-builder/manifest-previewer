import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import html from "@open-wc/rollup-plugin-html";

const config = {
  input: './index.html',
  output: {
    dir: 'dist',
    format: 'es',
  },
  plugins: [
    copy({
      targets: [
        { src: 'assets/**/*', dest: 'dist/assets' },
        { src: 'global.css', dest: 'dist/' },
        { src: 'fast-components.min.js', dest: 'dist/' }
      ]
    }),
    resolve(),
    terser(),
    html()
  ]
};

export default config;


