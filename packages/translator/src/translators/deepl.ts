// Dependencies
import * as deepl from 'deepl-node'

// Types
import type { Dictionary, Translator } from '@terai/types'

export type CreateDeepLTranslatorOptions = {
	/**
	 * DeepL API authentication key.
	 * Get your key from https://www.deepl.com/pro-api
	 */
	authKey: string

	/**
	 * Additional options for the DeepL Translator.
	 */
	options?: deepl.TranslatorOptions

	/**
	 * Formality preference for translations.
	 * - 'default': Default formality
	 * - 'more': More formal language
	 * - 'less': Less formal language
	 * - 'prefer_more': Prefer more formal if available
	 * - 'prefer_less': Prefer less formal if available
	 * @default 'default'
	 */
	formality?: deepl.Formality

	/**
	 * Whether to preserve formatting in translations.
	 * @default true
	 */
	preserveFormatting?: boolean

	/**
	 * Specify how to handle XML tags in text.
	 * @default 'xml'
	 */
	tagHandling?: 'xml' | 'html'
}

/**
 * Creates a translator using DeepL API.
 *
 * DeepL is known for producing high-quality, natural-sounding translations
 * and is often considered one of the best machine translation services available.
 *
 * @example
 * ```ts
 * import { createDeepLTranslator } from '@terai/translator/translators'
 *
 * const translator = createDeepLTranslator({
 *   authKey: process.env.DEEPL_API_KEY
 * })
 * ```
 *
 * @example With formality preference
 * ```ts
 * import { createDeepLTranslator } from '@terai/translator/translators'
 *
 * const translator = createDeepLTranslator({
 *   authKey: process.env.DEEPL_API_KEY,
 *   formality: 'less'  // Use informal language
 * })
 * ```
 *
 * @example With HTML tag handling
 * ```ts
 * import { createDeepLTranslator } from '@terai/translator/translators'
 *
 * const translator = createDeepLTranslator({
 *   authKey: process.env.DEEPL_API_KEY,
 *   tagHandling: 'html',
 *   preserveFormatting: true
 * })
 * ```
 */
export const createDeepLTranslator = ({
	authKey,
	options,
	formality = 'default',
	preserveFormatting = true,
	tagHandling = 'xml'
}: CreateDeepLTranslatorOptions): Translator => {
	const deeplTranslator = new deepl.Translator(authKey, options)

	const translator: Translator = async ({
		dictionary,
		locale,
		projectLocale
	}) => {
		const translatedOutput: Dictionary = {}
		const keys = Object.keys(dictionary)
		const texts = keys.map((key) => dictionary[key])

		// DeepL uses specific language codes (e.g., 'EN-US' instead of 'en-US')
		const targetLang = locale.toUpperCase() as deepl.TargetLanguageCode
		const sourceLang = projectLocale.toUpperCase() as deepl.SourceLanguageCode

		const results = await deeplTranslator.translateText(
			texts,
			sourceLang,
			targetLang,
			{
				formality,
				preserveFormatting,
				tagHandling
			}
		)

		// Handle both single result and array of results
		const translationResults = Array.isArray(results) ? results : [results]

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i]
			translatedOutput[key] = translationResults[i]?.text || dictionary[key]
		}

		return translatedOutput
	}

	return translator
}
