// Dependencies
import * as deepl from 'deepl-node'

// Types
import type { Dictionary, Translator } from '@terai/types'

export type DeepLTranslatorOptions = {
	authKey: string
	options?: deepl.TranslatorOptions
}

export const createDeepLTranslator = ({
	authKey,
	options
}: DeepLTranslatorOptions) => {
	const deeplTranslator = new deepl.Translator(authKey, options)

	const translator: Translator = async ({ dictionary, locale }) => {
		const translatedOutput: Dictionary = {}

		await Promise.all(
			Object.keys(dictionary).map(async (key) => {
				const value = dictionary[key]

				const result = await deeplTranslator.translateText(
					value,
					null,
					locale as deepl.TargetLanguageCode
				)

				translatedOutput[key] = result.text
			})
		)

		return translatedOutput
	}

	return translator
}
