import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json" with { type: "json" };
import { dirname } from "node:path";

const publishDir = dirname(pkg.module)

const external = (id) => [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.devDependencies),
].some((d) => id.startsWith(d));

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true,
    },
  ],
  external,
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      rootDir: "./src",
      outDir: publishDir,
      declaration: true,
      declarationDir: publishDir,
      exclude: ["src/**/*.spec.*"],
    }),
  ],
};
