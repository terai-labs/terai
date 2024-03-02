import { bundleNRequire } from 'bundle-n-require'
import { logger } from '@terai/logger'
import { lookItUpSync } from 'look-it-up'
import chokidar from 'chokidar'
import glob from 'fast-glob'
import {
	copySync,
	emptyDirSync,
	ensureDirSync,
	ensureFileSync,
	existsSync,
	outputFileSync,
	readdirSync,
	readFileSync,
	removeSync,
	renameSync
} from 'fs-extra'
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
		copy: copySync,
		emptyDir: emptyDirSync,
		ensureDir: ensureDirSync,
		ensureFile: ensureFileSync,
		exists: existsSync,
		readDir: readdirSync,
		readFile: (path: string) => readFileSync(path, 'utf8'),
		remove: removeSync,
		findUp: lookItUpSync,
		rename: renameSync,
		write: outputFileSync,
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
			const { include, exclude, cwd, poll } = options
			const coalesce = poll || process.platform === 'win32'
			const watcher = chokidar.watch(include, {
				usePolling: poll,
				cwd,
				ignoreInitial: true,
				ignorePermissionErrors: true,
				ignored: exclude,
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
