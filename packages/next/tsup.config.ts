import { defineConfig, type Format } from 'tsup'

const commonOptions = {
  clean: true,
  dts: true,
  format: ['esm', 'cjs'] as Format[],
  minify: false,
  shims: true,
  sourcemap: true,
  splitting: false
}

export default defineConfig([
  {
    ...commonOptions,
    entry: ['src/client'],
    outDir: 'dist/client',
    esbuildOptions: options => {
      options.banner = {
        js: '"use client"'
      }
    }
  },
  {
    ...commonOptions,
    entry: ['src/server'],
    outDir: 'dist/server'
  },
  {
    ...commonOptions,
    entry: ['src/index.ts'],
    outDir: 'dist'
  },
  {
    ...commonOptions,
    entry: ['src/middleware'],
    outDir: 'dist/middleware'
  }
])
