import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts', 'src/server.ts'],
  format: ['esm', 'cjs'],
  minify: false,
  shims: true,
  sourcemap: true,
  splitting: false
})
