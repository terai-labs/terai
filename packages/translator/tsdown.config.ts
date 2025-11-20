import { defineConfig } from 'tsdown'

export default defineConfig({
	clean: true,
	dts: true,
	entry: ['src/index.ts', 'src/translators/index.ts'],
	format: ['esm', 'cjs'],
	minify: true,
	shims: true,
	sourcemap: true
})
