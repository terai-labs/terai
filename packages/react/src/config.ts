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
	persistence?: boolean
	persistenceKey?: string
}

export const config$ = observable<Config>()

export function setupTerai({
	defaultLocale,
	persistence = false,
	persistenceKey = `terai-${pkg.version}`,
	...options
}: Config) {
	if (persistence) {
		configureObservablePersistence({
			pluginLocal: ObservablePersistLocalStorage
		})
		persistObservable(state$, {
			local: persistenceKey
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
		persistence,
		persistenceKey,
		...options
	})
}
