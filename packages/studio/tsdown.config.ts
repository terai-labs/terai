import { defineConfig } from 'tsdown'

export default defineConfig({
	clean: false,
	dts: true,
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	minify: true,
	shims: true,
	sourcemap: true
})
