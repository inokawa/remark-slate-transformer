import pkg from "./package.json" with { type: "json" };
import { basename } from "node:path";
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';

const external = (id: string) => [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.devDependencies),
].some((d) => id.startsWith(d));

export default defineConfig({
  build: {
    outDir: './lib',
    lib: {
      entry: "src/index.ts",
      formats: ["es", "cjs"],
      fileName: (f) => basename(f === 'es' ? pkg.module : pkg.main),
    },
    rolldownOptions: {
      external,
    },
    sourcemap: true,
  },
  plugins: [dts({ exclude: ["**/*.{spec,stories}.*"], })],
});
