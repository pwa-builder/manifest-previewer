import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import strip from "@rollup/plugin-strip";
import copy from "rollup-plugin-copy";
import litcss from "rollup-plugin-lit-css";

export default {
  input: ["build/manifest-previewer.js"],
  output: {
    file: "dist/manifest-previewer.js",
    format: "es",
    sourcemap: false,
  },
  plugins: [
    resolve(),
    replace({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "production"
      ),
    }),
    litcss(),
    terser(),
    strip({
      functions: ["console.log"],
    }),
    copy({
      targets: [
        { src: "assets/**/*", dest: "dist/assets/" },
        { src: "global.css", dest: "dist/styles/" },
        { src: "fast-components.min.js", dest: "dist/" },
      ],
    }),
  ],
};
