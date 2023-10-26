import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  dts: true,
  entry: [
    'src/index.ts',
    'src/client/index.ts',
    'src/server/index.ts',
    'src/middleware/index.ts'
  ],
  format: ['esm', 'cjs'],
  minify: true,
  shims: true,
  sourcemap: true,
  splitting: false
})
