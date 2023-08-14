import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  dts: false,
  entry: ['src'],
  format: ['esm', 'cjs'],
  minify: true,
  shims: true,
  sourcemap: false,
  splitting: false,
})