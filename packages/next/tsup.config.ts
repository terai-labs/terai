import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts', 'src/client', 'src/server'],
  format: ['esm', 'cjs'],
  minify: false,
  shims: true,
  sourcemap: true,
  splitting: true
})
