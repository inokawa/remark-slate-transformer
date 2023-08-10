import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
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
    terser({
      ecma: 2015,
      module: true,
      compress: { passes: 5, unsafe: true, keep_fargs: false },
      mangle: { properties: { regex: "^_" } },
      format: {
        // https://github.com/terser/terser/pull/550
        // https://github.com/terser/terser/issues/968
        comments: /@preserve|@lic|@cc_on|^\**!|__PURE__/i,
        preserve_annotations: true,
      },
    }),
  ],
};
