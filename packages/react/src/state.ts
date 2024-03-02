// Depedencies
import { observable } from '@legendapp/state'

// Types
import type { Dictionaries, Locale } from '@terai/types'

type State = {
	dictionaries: Dictionaries
	locale: Locale
	started: boolean
}

export const state$ = observable<State>({
	dictionaries: {},
	locale: 'en',
	started: false
})
