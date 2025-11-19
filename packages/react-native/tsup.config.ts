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
	external: ['react', 'react-native', 'react/jsx-runtime']
})
