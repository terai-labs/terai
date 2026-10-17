import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'

const source = readFileSync(
	new URL('../src/locale.ts', import.meta.url),
	'utf8'
)
const locales = [...source.matchAll(/^\t\| '([^']+)'$/gm)].map(([, tag]) => tag)

describe('Locale', () => {
	test('every entry is a canonical BCP 47 tag', () => {
		const nonCanonical = locales.filter(
			(tag) => Intl.getCanonicalLocales(tag)[0] !== tag
		)

		expect(locales.length).toBeGreaterThan(1000)
		expect(nonCanonical).toEqual([])
	})

	test('has no duplicates', () => {
		expect(new Set(locales).size).toBe(locales.length)
	})

	test('includes the language-region tags devices send', () => {
		expect(locales).toEqual(
			expect.arrayContaining(['zh-CN', 'zh-TW', 'zh-HK', 'sr-RS', 'pa-IN'])
		)
		expect(locales).not.toContain('root')
	})
})
