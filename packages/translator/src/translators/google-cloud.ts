// Dependencies
import { v2 } from '@google-cloud/translate'

// Types
import type { Dictionary, Translator } from '@terai/types'

export type CreateGoogleCloudTranslatorOptions = v2.TranslateConfig

/**
 * Creates a translator using Google Cloud Translation API.
 *
 * This translator uses Google Cloud's Neural Machine Translation (NMT)
 * for high-quality translations.
 *
 * @example
 * ```ts
 * import { createGoogleCloudTranslator } from '@terai/translator/translators'
 *
 * const translator = createGoogleCloudTranslator({
 *   projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
 *   keyFilename: './google-credentials.json'
 * })
 * ```
 *
 * @example With API key
 * ```ts
 * import { createGoogleCloudTranslator } from '@terai/translator/translators'
 *
 * const translator = createGoogleCloudTranslator({
 *   key: process.env.GOOGLE_CLOUD_API_KEY
 * })
 * ```
 */
export const createGoogleCloudTranslator = (
	options: CreateGoogleCloudTranslatorOptions
): Translator => {
	const translate = new v2.Translate(options)

	const translator: Translator = async ({ dictionary, locale }) => {
		const translatedOutput: Dictionary = {}

		await Promise.all(
			Object.keys(dictionary).map(async (key) => {
				const value = dictionary[key]

				const [translation] = await translate.translate(value, locale)

				translatedOutput[key] = translation
			})
		)

		return translatedOutput
	}

	return translator
}
