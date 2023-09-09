import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/client/index.ts', 'src/server/index.ts'],
  format: ['esm', 'cjs'],
  minify: false,
  shims: true,
  sourcemap: true,
  splitting: false
})
