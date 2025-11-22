// Types
import type { Dictionary, Translator } from '@terai/types'

export type AzureTranslatorOptions = {
	subscriptionKey: string
	region: string
	endpoint?: string
}

type AzureTranslationResponse = {
	translations: Array<{
		text: string
		to: string
	}>
}

export const createAzureTranslator = ({
	subscriptionKey,
	region,
	endpoint = 'https://api.cognitive.microsofttranslator.com'
}: AzureTranslatorOptions) => {
	const translator: Translator = async ({
		dictionary,
		projectLocale,
		locale
	}) => {
		const translatedOutput: Dictionary = {}

		await Promise.all(
			Object.keys(dictionary).map(async (key) => {
				const value = dictionary[key]

				const response = await fetch(
					`${endpoint}/translate?api-version=3.0&from=${projectLocale}&to=${locale}`,
					{
						method: 'POST',
						headers: {
							'Ocp-Apim-Subscription-Key': subscriptionKey,
							'Ocp-Apim-Subscription-Region': region,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify([{ Text: value }])
					}
				)

				if (!response.ok) {
					throw new Error(
						`Azure Translator API error: ${response.status} ${response.statusText}`
					)
				}

				const data = (await response.json()) as AzureTranslationResponse[]

				translatedOutput[key] = data[0]?.translations[0]?.text || value
			})
		)

		return translatedOutput
	}

	return translator
}
