import { once } from 'node:events'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { runtime } from '../src/runtime'

describe('glob watching', () => {
	test.each(['relative', 'absolute'])(
		'handles %s patterns and excludes non-matching files',
		async (kind) => {
			const cwd = await mkdtemp(join(tmpdir(), 'terai-watch-'))
			await mkdir(join(cwd, 'src'))
			const pattern = (value: string) =>
				kind === 'absolute' ? join(cwd, value) : `./${value}`
			const watcher = runtime.fs.watch({
				cwd,
				include: [pattern('src/**/*.ts')],
				exclude: [pattern('src/**/*.test.ts')],
				poll: true
			})
			const files: string[] = []
			watcher.on('add', (path) => files.push(path))
			try {
				await once(watcher, 'ready')
				await writeFile(join(cwd, 'src/ignored.test.ts'), 'excluded')
				await writeFile(join(cwd, 'src/ignored.json'), '{}')
				await writeFile(join(cwd, 'src/message.ts'), 'export const message = 1')
				await expect.poll(() => files).toEqual(['src/message.ts'])
				const changed = once(watcher, 'change')
				await writeFile(
					join(cwd, 'src/message.ts'),
					'export const message = 123'
				)
				expect((await changed)[0]).toBe('src/message.ts')
				expect(files).toEqual(['src/message.ts'])
			} finally {
				await watcher.close()
				await rm(cwd, { recursive: true, force: true })
			}
		}
	)
})
