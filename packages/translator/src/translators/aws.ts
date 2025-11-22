// Dependencies
import {
	TranslateClient,
	TranslateTextCommand,
	type TranslateClientConfig
} from '@aws-sdk/client-translate'

// Types
import type { Dictionary, Translator } from '@terai/types'

export type CreateAwsTranslatorOptions = TranslateClientConfig & {
	/**
	 * The source language code (e.g., 'en', 'es', 'fr').
	 * If not provided, AWS Translate will auto-detect the source language.
	 * @default 'auto'
	 */
	sourceLanguageCode?: string
}

/**
 * Creates a translator using AWS Translate.
 *
 * AWS Translate is a neural machine translation service that delivers
 * fast, high-quality, and affordable language translation.
 *
 * @example
 * ```ts
 * import { createAwsTranslator } from '@terai/translator/translators'
 *
 * const translator = createAwsTranslator({
 *   region: 'us-east-1',
 *   credentials: {
 *     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 *     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
 *   }
 * })
 * ```
 *
 * @example With AWS profile
 * ```ts
 * import { createAwsTranslator } from '@terai/translator/translators'
 * import { fromIni } from '@aws-sdk/credential-providers'
 *
 * const translator = createAwsTranslator({
 *   region: 'us-east-1',
 *   credentials: fromIni({ profile: 'my-profile' })
 * })
 * ```
 */
export const createAwsTranslator = ({
	sourceLanguageCode = 'auto',
	...clientConfig
}: CreateAwsTranslatorOptions): Translator => {
	const client = new TranslateClient(clientConfig)

	const translator: Translator = async ({
		dictionary,
		locale,
		projectLocale
	}) => {
		const translatedOutput: Dictionary = {}

		// Use projectLocale as source if not set to auto
		const source =
			sourceLanguageCode === 'auto' ? projectLocale : sourceLanguageCode

		await Promise.all(
			Object.keys(dictionary).map(async (key) => {
				const value = dictionary[key]

				const command = new TranslateTextCommand({
					Text: value,
					SourceLanguageCode: source,
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
