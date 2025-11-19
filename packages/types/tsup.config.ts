import { defineConfig } from 'tsup'

export default defineConfig({
	clean: true,
	dts: true,
	entry: ['src'],
	sourcemap: true,
	splitting: true,
	treeshake: 'recommended'
})
