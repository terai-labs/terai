// Dependencies
import { createFormat } from '@terai/formatter'

// State
import { store, selectLocale } from './store'

/**
 * Get formatting utilities for the current locale
 */
export const getFormat = () => {
	const locale = selectLocale(store.getState())
	return createFormat(() => locale)()
}
