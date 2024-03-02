import { createRequire } from 'node:module'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import preserveDirectives from 'rollup-plugin-preserve-directives'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')
const makeExternalPredicate = (externalArr) => {
	if (externalArr.length === 0) {
		return () => false
	}
	const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`)
	return (id) => pattern.test(id)
}

const config = {
	input: 'src/index.ts',
	output:
		// {
		//   file: pkg.require,
		//   format: 'cjs',
		//   exports: 'named',
		//   sourcemap: true
		// },
		{
			dir: 'dist',
			format: 'esm',
			exports: 'named',
			preserveModules: true,
			preserveModulesRoot: 'src',
			sourcemap: true,
			interop: 'auto'
		},
	external: makeExternalPredicate([
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.peerDependencies || {})
	]),
	plugins: [
		typescript({
			declarationDir: 'dist',
			outputToFilesystem: true
		}),
		nodeResolve({
			extensions: ['.js', '.ts', '.tsx']
		}),
		commonjs({ include: ['node_modules/**'] }),
		babel({
			babelHelpers: 'runtime',
			exclude: /node_modules/,
			plugins: [['@babel/plugin-transform-runtime']],
			presets: [
				['@babel/preset-env', { targets: 'defaults' }],
				['@babel/preset-react', { runtime: 'automatic' }]
			]
		}),
		preserveDirectives(),
		terser()
	],
	onwarn(warning, warn) {
		if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') {
			warn(warning)
		}
	}
}

export default config
