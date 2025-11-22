// Types
import type { Dictionary, Translator } from '@terai/types'

export type CreateAzureTranslatorOptions = {
	/**
	 * Azure Translator subscription key.
	 */
	subscriptionKey: string

	/**
	 * Azure region where the Translator resource is located.
	 * @example 'eastus', 'westeurope', 'southeastasia'
	 */
	region: string

	/**
	 * Custom endpoint URL. If not provided, uses the global endpoint.
	 * @default 'https://api.cognitive.microsofttranslator.com'
	 */
	endpoint?: string
}

type AzureTranslationResponse = Array<{
	translations: Array<{
		text: string
		to: string
	}>
}>

/**
 * Creates a translator using Microsoft Azure Translator.
 *
 * Azure Translator is a cloud-based machine translation service
 * that supports 100+ languages.
 *
 * @example
 * ```ts
 * import { createAzureTranslator } from '@terai/translator/translators'
 *
 * const translator = createAzureTranslator({
 *   subscriptionKey: process.env.AZURE_TRANSLATOR_KEY,
 *   region: 'eastus'
 * })
 * ```
 *
 * @example With custom endpoint
 * ```ts
 * import { createAzureTranslator } from '@terai/translator/translators'
 *
 * const translator = createAzureTranslator({
 *   subscriptionKey: process.env.AZURE_TRANSLATOR_KEY,
 *   region: 'eastus',
 *   endpoint: 'https://my-custom-endpoint.cognitiveservices.azure.com'
 * })
 * ```
 */
export const createAzureTranslator = ({
	subscriptionKey,
	region,
	endpoint = 'https://api.cognitive.microsofttranslator.com'
}: CreateAzureTranslatorOptions): Translator => {
	const translator: Translator = async ({
		dictionary,
		locale,
		projectLocale
	}) => {
		const translatedOutput: Dictionary = {}
		const keys = Object.keys(dictionary)
		const texts = keys.map((key) => ({ text: dictionary[key] }))

		// Azure Translator API accepts up to 100 texts per request
		const batchSize = 100
		const batches: Array<Array<{ text: string }>> = []

		for (let i = 0; i < texts.length; i += batchSize) {
			batches.push(texts.slice(i, i + batchSize))
		}

		let keyIndex = 0

		for (const batch of batches) {
			const url = new URL('/translate', endpoint)
			url.searchParams.set('api-version', '3.0')
			url.searchParams.set('from', projectLocale)
			url.searchParams.set('to', locale)

			const response = await fetch(url.toString(), {
				method: 'POST',
				headers: {
					'Ocp-Apim-Subscription-Key': subscriptionKey,
					'Ocp-Apim-Subscription-Region': region,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(batch)
			})

			if (!response.ok) {
				const errorText = await response.text()
				throw new Error(
					`Azure Translator API error: ${response.status} - ${errorText}`
				)
			}

			const results: AzureTranslationResponse = await response.json()

			for (const result of results) {
				const key = keys[keyIndex]
				translatedOutput[key] = result.translations[0]?.text || dictionary[key]
				keyIndex++
			}
		}

		return translatedOutput
	}

	return translator
}
