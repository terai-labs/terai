// Dependencies
import { createContext } from 'react'

// Types
import type { Dictionaries, Locale } from '@terai/types'

export type State = {
	dictionaries: Dictionaries
	locale: Locale
	started: boolean
}

export type StateContextValue = {
	state: State
	setState: (updater: (prev: State) => State) => void
}

export const TeraiContext = createContext<StateContextValue | null>(null)

export const getInitialState = (): State => ({
	dictionaries: {},
	locale: 'en',
	started: false
})
