import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json" assert { type: "json" };

const externals = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.devDependencies),
];

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
  external: (id) => externals.some((d) => id.startsWith(d)),
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      outDir: ".",
      declaration: true,
      exclude: ["**/*.{spec,stories}.*"],
    }),
  ],
};
