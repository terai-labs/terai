// State
import { store } from './store'

// Types
import type { Loader, Locale } from '@terai/types'
import type { GlobalFormat } from '@terai/formatter'

export type Config = {
	defaultLocale?: Locale
	loader: Loader
	format?: GlobalFormat
}

let globalConfig: Config | null = null

export const getConfig = (): Config => {
	if (!globalConfig) {
		throw new Error('Terai not initialized. Call "setup" first.')
	}
	return globalConfig
}

/**
 * Initialize Terai with configuration
 * After setup, use getTs, getFormat, etc. to access functionality
 */
export function setupTerai({
	loader,
	format = {},
	defaultLocale = 'en'
}: Config) {
	globalConfig = { loader, format, defaultLocale }

	// Initialize with default locale
	store.setState((prev) => ({
		...prev,
		locale: defaultLocale
	}))
}
