import { MockLanguageModelV4 } from 'ai/test'
import { afterEach, describe, expect, test, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
	awsSend: vi.fn(),
	deeplTranslateText: vi.fn(),
	googleTranslate: vi.fn()
}))

vi.mock('@aws-sdk/client-translate', () => ({
	TranslateClient: class {
		send = mocks.awsSend
	},
	TranslateTextCommand: class {
		constructor(public input: unknown) {}
	}
}))

vi.mock('deepl-node', () => ({
	Translator: class {
		translateText = mocks.deeplTranslateText
	}
}))

vi.mock('@google-cloud/translate', () => ({
	v2: {
		Translate: class {
			translate = mocks.googleTranslate
		}
	}
}))

import {
	createAiTranslator,
	createAwsTranslator,
	createDeepLTranslator,
	createGoogleCloudTranslator
} from '../src/translators'

const dictionary = { a: 'Hello {name}', b: 'Goodbye' }
const translated = { a: 'Hola {name}', b: 'Adiós' }

afterEach(() => {
	vi.clearAllMocks()
})

describe('createAiTranslator', () => {
	test('returns the translated dictionary from the model JSON output', async () => {
		const model = new MockLanguageModelV4({
			doGenerate: {
				content: [{ type: 'text', text: JSON.stringify(translated) }],
				finishReason: { unified: 'stop', raw: undefined },
				usage: {
					inputTokens: {
						total: 1,
						noCache: 1,
						cacheRead: undefined,
						cacheWrite: undefined
					},
					outputTokens: { total: 1, text: 1, reasoning: undefined }
				},
				warnings: []
			}
		})

		const translator = createAiTranslator({ model })
		const result = await translator({
			dictionary,
			projectLocale: 'en',
			locale: 'es'
		})

		expect(result).toEqual(translated)
		expect(model.doGenerateCalls).toHaveLength(1)
		expect(JSON.stringify(model.doGenerateCalls[0].prompt)).toContain(
			'locale:\\"es\\"'
		)
	})
})

describe('createAwsTranslator', () => {
	test('translates each entry with TranslateTextCommand', async () => {
		mocks.awsSend.mockImplementation(async (command: any) => ({
			TranslatedText: `es:${command.input.Text}`
		}))

		const translator = createAwsTranslator({ region: 'us-east-1' })
		const result = await translator({
			dictionary,
			projectLocale: 'en',
			locale: 'es'
		})

		expect(result).toEqual({ a: 'es:Hello {name}', b: 'es:Goodbye' })
		expect(mocks.awsSend.mock.calls[0][0].input).toEqual({
			Text: 'Hello {name}',
			SourceLanguageCode: 'en',
			TargetLanguageCode: 'es'
		})
	})
})

describe('createDeepLTranslator', () => {
	test('translates all texts in one call with default options', async () => {
		mocks.deeplTranslateText.mockResolvedValue([
			{ text: translated.a },
			{ text: translated.b }
		])

		const translator = createDeepLTranslator({ authKey: 'key' })
		const result = await translator({
			dictionary,
			projectLocale: 'en',
			locale: 'es'
		})

		expect(result).toEqual(translated)
		expect(mocks.deeplTranslateText).toHaveBeenCalledWith(
			['Hello {name}', 'Goodbye'],
			'EN',
			'ES',
			{ formality: 'default', preserveFormatting: true, tagHandling: 'xml' }
		)
	})
})

describe('createGoogleCloudTranslator', () => {
	test('translates each entry with the v2 client', async () => {
		mocks.googleTranslate.mockImplementation(async (text: string) => [
			`es:${text}`
		])

		const translator = createGoogleCloudTranslator({ key: 'key' })
		const result = await translator({
			dictionary,
			projectLocale: 'en',
			locale: 'es'
		})

		expect(result).toEqual({ a: 'es:Hello {name}', b: 'es:Goodbye' })
		expect(mocks.googleTranslate).toHaveBeenCalledWith('Goodbye', 'es')
	})
})
