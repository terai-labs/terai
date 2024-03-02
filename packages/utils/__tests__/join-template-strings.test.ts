import { describe, expect, test } from 'vitest'
import { joinTemplateStrings } from '../src'

function testTag(strings: TemplateStringsArray, ..._: any[]) {
	return joinTemplateStrings(strings.raw)
}

describe('joinTemplateStrings', () => {
	test('should join strings raw', () => {
		const output = testTag`Hello ${'world'}!`

		expect(output).toMatchInlineSnapshot('"Hello ${var}!"')
	})
})
