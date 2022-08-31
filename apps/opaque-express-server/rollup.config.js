// rollup.config.js
import ts from "rollup-plugin-ts";
import del from "rollup-plugin-delete";

const config = [
  {
    input: "src/server.ts",
    output: {
      dir: "dist",
      format: "es",
    },
    plugins: [del({ targets: ["dist"] }), ts()],
  },
];

export default config;
