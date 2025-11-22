// Dependencies
import {
	TranslateClient,
	TranslateTextCommand,
	type TranslateClientConfig
} from '@aws-sdk/client-translate'

// Types
import type { Dictionary, Translator } from '@terai/types'

export type AwsTranslateOptions = TranslateClientConfig

export const createAwsTranslator = (options: AwsTranslateOptions) => {
	const client = new TranslateClient(options)

	const translator: Translator = async ({
		dictionary,
		projectLocale,
		locale
	}) => {
		const translatedOutput: Dictionary = {}

		await Promise.all(
			Object.keys(dictionary).map(async (key) => {
				const value = dictionary[key]

				const command = new TranslateTextCommand({
					Text: value,
					SourceLanguageCode: projectLocale,
					TargetLanguageCode: locale
				})

				const response = await client.send(command)

				translatedOutput[key] = response.TranslatedText || value
			})
		)

		return translatedOutput
	}

	return translator
}
