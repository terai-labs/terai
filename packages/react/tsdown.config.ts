import { defineConfig } from 'tsdown'

export default defineConfig({
	clean: true,
	dts: true,
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	shims: true,
	sourcemap: true,
	minify: true,
	external: ['react', 'react-dom', 'react/jsx-runtime']
})
