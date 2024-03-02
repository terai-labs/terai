import { describe, expect, test } from 'vitest'
import { groupDictionaryByChunks } from '../src/group-dictionary-by-chunk'
import type { Dictionary, BuildManifest } from '@terai/types'

const dictionary: Dictionary = {
	gOngMQ: 'Hello, ${var}!',
	gTcrmz: "You haven't checked you email since ${var}",
	dzFFxU: 'You got ${var} messages in your mail inbox'
}

const manifest: BuildManifest = {
	messages: {
		gOngMQ: {
			id: 'gOngMQ',
			value: 'Hello, ${var}!',
			files: [
				'next-app/src/app/[locale]/client/page.tsx',
				'next-app/src/app/[locale]/server/page.tsx'
			],
			context: '',
			chunksIds: ['default', 'server']
		},
		gTcrmz: {
			id: 'gTcrmz',
			value: "You haven't checked you email since ${var}",
			files: [
				'next-app/src/app/[locale]/client/page.tsx',
				'next-app/src/app/[locale]/server/page.tsx'
			],
			context: '',
			chunksIds: ['default', 'client']
		},
		dzFFxU: {
			id: 'dzFFxU',
			value: 'You got ${var} messages in your mail inbox',
			files: [
				'next-app/src/app/[locale]/client/page.tsx',
				'next-app/src/app/[locale]/server/page.tsx'
			],
			context: '',
			chunksIds: ['default', 'server']
		}
	}
}
describe('groupDictionaryByChunks', () => {
	test('should merge by chunks', () => {
		const sut = groupDictionaryByChunks
		const locale = 'en'

		const output = sut(dictionary, manifest, locale)

		expect(output).toMatchInlineSnapshot(`
      {
        "client": {
          "gTcrmz": "You haven't checked you email since \${var}",
        },
        "en": {
          "dzFFxU": "You got \${var} messages in your mail inbox",
          "gOngMQ": "Hello, \${var}!",
          "gTcrmz": "You haven't checked you email since \${var}",
        },
        "server": {
          "dzFFxU": "You got \${var} messages in your mail inbox",
          "gOngMQ": "Hello, \${var}!",
        },
      }
    `)
	})
})
