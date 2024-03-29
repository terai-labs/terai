// Dependencies
import { createTs, type TsRenderProps } from '@terai/ts'
import { observable } from '@legendapp/state'
import { createFormat, interpolate } from '@terai/formatter'

// Types
import type { Dictionaries, Loader, Locale } from '@terai/types'
import type { GlobalFormat } from '@terai/formatter'

type SetupOptions = {
	loader: Loader
	format?: GlobalFormat
}

export function setup({ loader, format = {} }: SetupOptions) {
	const dictionaries$ = observable<Dictionaries>({})
	const getFormat = (locale: Locale) => createFormat(() => locale)
	const getTs = async ({ locale }: { locale: string }) => {
		const dictionary = dictionaries$[locale].get()

		if (!dictionary) {
			await loader(locale, locale).then((mod) =>
				dictionaries$[locale].set((prev) => ({
					...prev,
					...mod
				}))
			)
		}

		return createTs<string, TsRenderProps>(
			({ id, variables, rawMessage, ...props }) => {
				const message = dictionary?.[id] ?? rawMessage

				return interpolate({
					message,
					variables
				})
			}
		)
	}

	return {
		getTs,
		getFormat
	}
}
