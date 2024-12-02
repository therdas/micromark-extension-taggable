import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import pkg from "./package.json" with { type: "json" };
import typescript from "rollup-plugin-typescript2";
import nodeResolve from "@rollup/plugin-node-resolve";

const config = [
  {
    input: "src/index.js",
    output: {
      file: pkg.browser,
      format: "esm",
    },
    plugins: [
      commonjs(),
      babel({
        babelHelpers: "runtime",
        exclude: ["node_modules/**"],
      }),
      nodeResolve(),
    ],
    external(id) {
      return /@babel\/runtime/.test(id);
    },
  },
  {
    input: "src/index.js",
    output: [
      {
        file: pkg.main,
        format: "cjs",
      },
      {
        file: pkg.module,
        format: "es",
      },
    ],
    plugins: [
      babel({
        babelHelpers: "runtime",
        exclude: ["node_modules/**"],
      }),
      nodeResolve(),
    ],
    external(id) {
      return /@babel\/runtime/.test(id);
    },
  },
];

export default config;
