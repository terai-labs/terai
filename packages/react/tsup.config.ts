import { defineConfig } from 'tsup'

export default defineConfig({
	clean: true,
	dts: true,
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	shims: true,
	sourcemap: false,
	minify: false,
	splitting: true
})
