// Types
import type { Config, Locale, Dictionary } from '@terai/types'

export type TranslateDictionaryOptions = Pick<
	Config,
	'translator' | 'projectLocale' | 'batchSize'
> & {
	dictionary: Dictionary
	locale: Locale
}

export type TranslateDictionaryResult = {
	/** Valid translations, keyed by the requested message ids only */
	dictionary: Dictionary
	/** Ids the translator returned no usable translation for */
	missing: string[]
	/** Ids whose batch rejected */
	failed: string[]
	/** Rejection reasons of the failed batches */
	errors: unknown[]
}

export async function translateDictionary({
	dictionary,
	projectLocale,
	locale,
	translator,
	batchSize
}: TranslateDictionaryOptions): Promise<TranslateDictionaryResult> {
	const ids = Object.keys(dictionary)
	const size = batchSize && batchSize > 0 ? batchSize : ids.length
	const batches: string[][] = []

	for (let i = 0; i < ids.length; i += size) {
		batches.push(ids.slice(i, i + size))
	}

	const results = await Promise.allSettled(
		batches.map((batch) =>
			translator({
				dictionary: Object.fromEntries(batch.map((id) => [id, dictionary[id]])),
				projectLocale,
				locale
			})
		)
	)

	const result: TranslateDictionaryResult = {
		dictionary: {},
		missing: [],
		failed: [],
		errors: []
	}

	results.forEach((settled, index) => {
		const batch = batches[index]

		if (settled.status === 'rejected') {
			result.failed.push(...batch)
			result.errors.push(settled.reason)
			return
		}

		// Keep only the ids that were asked for: translators (LLMs in particular)
		// may rename, drop or invent keys.
		for (const id of batch) {
			const value = settled.value?.[id]

			if (typeof value === 'string' && value.trim()) {
				result.dictionary[id] = value
			} else {
				result.missing.push(id)
			}
		}
	})

	return result
}
