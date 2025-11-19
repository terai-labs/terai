import { defineConfig } from 'tsup'

export default defineConfig({
	clean: true,
	dts: true,
	entry: ['src'],
	format: ['esm', 'cjs'],
	shims: true,
	sourcemap: true,
	minify: false,
	splitting: true,
	treeshake: 'recommended',
	platform: 'browser',
	external: ['react', 'react-dom', 'react/jsx-runtime']
})
