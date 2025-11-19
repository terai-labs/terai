export function getBrowserLocale({
	languageCodeOnly
}: {
	languageCodeOnly?: boolean
} = {}) {
	const browserLocale = navigator.language || navigator.languages[0]
	const trimmedLocale = browserLocale.trim()

	return languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale
}
