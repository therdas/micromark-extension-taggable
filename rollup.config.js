import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import PeerDepsExternal from "rollup-plugin-peer-deps-external";
import copy from "rollup-plugin-copy";

const config = {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "esm",
    },
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [
    PeerDepsExternal(),
    resolve(),
    commonjs(),
    copy({
      targets: [{ src: "src/index.d.ts", dest: "dist/" }],
    }),
  ],
};

export default config;
