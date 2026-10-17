import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'

const packagesDir = fileURLToPath(new URL('../../', import.meta.url))
const packages = readdirSync(packagesDir).filter((name) =>
	existsSync(join(packagesDir, name, 'package.json'))
)

const paths = (value: unknown): string[] => {
	if (typeof value === 'string') return [value]
	if (value && typeof value === 'object') {
		return Object.values(value).flatMap(paths)
	}
	return []
}

describe('built package entry points', () => {
	test.each(packages)(
		'%s publishes the files its manifest advertises',
		(name) => {
			const dir = join(packagesDir, name)
			const manifest = JSON.parse(
				readFileSync(join(dir, 'package.json'), 'utf8')
			)
			const entries = paths({
				main: manifest.main,
				module: manifest.module,
				types: manifest.types,
				exports: manifest.exports,
				bin: manifest.bin
			})
			for (const entry of entries) {
				expect(existsSync(join(dir, entry)), `${name}: ${entry}`).toBe(true)
			}
		}
	)
})
