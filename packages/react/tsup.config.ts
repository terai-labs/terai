import { defineConfig } from 'tsup'

export default defineConfig({
	clean: true,
	dts: true,
	entry: ['src'],
	format: ['esm', 'cjs'],
	shims: true,
	sourcemap: false,
	minify: true,
	splitting: true,
	treeshake: true
})
