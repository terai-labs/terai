// Types
import type { Locale } from '@terai/types'
import type { StateContextValue } from './state'

// Global reference to the context value for imperative updates
let contextRef: StateContextValue | null = null

export const setContextRef = (context: StateContextValue | null) => {
	contextRef = context
}

export const setLocale = (locale: Locale) => {
	if (!contextRef) {
		throw new Error(
			'Terai context not initialized. Ensure TeraiProvider is mounted.'
		)
	}
	contextRef.setState((prev) => ({ ...prev, locale }))
}
