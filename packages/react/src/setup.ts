// Depedencies
import { observable } from '@legendapp/state'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import pkg from '../package.json'

// State
import { state$ } from './state'

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
	storageKey?: string
}

export const config$ = observable<Config>()

export function setupTerai({
	defaultLocale,
	persist = false,
	storageKey = `terai-${pkg.version}`,
	...options
}: Config) {
	if (persist) {
		configureObservablePersistence({
			pluginLocal: ObservablePersistLocalStorage
		})
		persistObservable(state$, {
			local: storageKey
		})
	}

	if (!state$.started.get()) {
		const locale =
			typeof defaultLocale === 'function' ? defaultLocale() : defaultLocale
		state$.locale.set(locale)
		state$.started.set(true)
	}

	config$.set({
		defaultLocale,
		persist,
		storageKey,
		...options
	})
}
