import type { Locale } from './locale'
import type { Dictionary } from './dictionary'

export type Translator = ({
	dictionary,
	locale,
	projectLocale
}: {
	dictionary: Dictionary
	locale: Locale
	projectLocale: Locale
}) => Promise<Dictionary>
