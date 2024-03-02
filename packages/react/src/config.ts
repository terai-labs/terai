// Depedencies
import { observable } from '@legendapp/state'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import { state$ } from './state'
import pkg from '../package.json'

// Global configuration
import {
	configureObservablePersistence,
	persistObservable
} from '@legendapp/state/persist'

// Types
import type { Loader, Locale } from '@terai/types'
import type { GlobalFormat } from '@terai/formatter'

type Config = {
	defaultLocale: Locale | (() => Locale)
	loader: Loader
	format?: GlobalFormat
	persist?: boolean
}

configureObservablePersistence({
	pluginLocal: ObservablePersistLocalStorage
})

export const config$ = observable<Config>()

export function setupClient({ defaultLocale, ...options }: Config) {
	if (options.persist) {
		persistObservable(state$, {
			local: `terai-${pkg.version}`
		})
	}

	if (!state$.started.get()) {
		const locale =
			typeof defaultLocale === 'function' ? defaultLocale() : defaultLocale
		state$.locale.set(locale)
		state$.started.set(true)
	}

	config$.set({ defaultLocale, ...options })
}
