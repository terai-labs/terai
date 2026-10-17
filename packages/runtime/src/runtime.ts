import { bundleNRequire } from 'bundle-n-require'
import { logger } from '@terai/logger'
import { lookItUpSync } from 'look-it-up'
import { watch } from 'chokidar'
import glob from 'fast-glob'
import fs from 'fs-extra'
import picomatch from 'picomatch'
import {
	dirname,
	extname,
	isAbsolute,
	join,
	relative,
	sep,
	resolve
} from 'pathe'

export const runtime = {
	cwd: () => process.cwd(),
	env: (name: string) => process.env[name],
	import: async <T>({ filePath, cwd }: { filePath: string; cwd: string }) => {
		const { mod } = await bundleNRequire(filePath, {
			cwd,
			interopDefault: true
		})

		return (mod?.default ?? mod) as T
	},
	path: {
		join,
		relative,
		dirname,
		extname,
		isAbsolute,
		sep,
		resolve,
		abs(cwd: string, str: string) {
			return isAbsolute(str) ? str : join(cwd, str)
		}
	},
	fs: {
		copy: fs.copySync,
		emptyDir: fs.emptyDirSync,
		ensureDir: fs.ensureDirSync,
		ensureFile: fs.ensureFileSync,
		exists: fs.existsSync,
		readDir: fs.readdirSync,
		readFile: (path: string) => fs.readFileSync(path, 'utf8'),
		remove: fs.removeSync,
		findUp: lookItUpSync,
		rename: fs.renameSync,
		write: fs.outputFileSync,
		glob: (opts: { include: string[]; exclude?: string[]; cwd?: string }) => {
			if (!opts.include) return []

			const ignore = opts.exclude ?? []
			if (!ignore.length) {
				ignore.push('**/*.d.ts')
			}

			return glob.sync(opts.include, { cwd: opts.cwd, ignore, absolute: true })
		},
		watch: (options: {
			include: string[]
			exclude?: string[]
			cwd?: string
			poll?: boolean
		}) => {
			const { include, exclude = [], cwd = process.cwd(), poll } = options
			const coalesce = poll || process.platform === 'win32'

			// chokidar >= 4 does not support globs: watch the base directory of
			// each include pattern and filter files with picomatch
			const normalize = (pattern: string) => pattern.replace(/^\.\//, '')
			const isIncluded = picomatch(include.map(normalize), { dot: true })
			const isExcluded = picomatch(exclude.map(normalize), { dot: true })
			const dirs = [
				...new Set(
					include.map((pattern) =>
						resolve(cwd, picomatch.scan(normalize(pattern)).base)
					)
				)
			]

			const watcher = watch(dirs, {
				usePolling: poll,
				cwd,
				ignoreInitial: true,
				ignorePermissionErrors: true,
				ignored: (path, stats) => {
					const rel = relative(cwd, path)
					if (!rel || rel.startsWith('..')) return false
					if (exclude.length && isExcluded(rel)) return true
					return !!stats?.isFile() && !isIncluded(rel)
				},
				awaitWriteFinish: coalesce
					? { stabilityThreshold: 50, pollInterval: 10 }
					: false
			})

			process.once('SIGINT', async () => {
				await watcher.close()
			})

			return watcher
		}
	}
}

process.setMaxListeners(Infinity)

process.on('unhandledRejection', (reason) => {
	logger.error('Unhandled rejection', reason as string)
})

process.on('uncaughtException', (reason) => {
	logger.error('Uncaught exception', reason?.message)
})

export type Runtime = typeof runtime
