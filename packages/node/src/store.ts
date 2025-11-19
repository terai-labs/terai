// Types
import type { Dictionaries, Locale } from '@terai/types'

export type State = {
	dictionaries: Dictionaries
	locale: Locale
}

type Listener = (state: State) => void

class Store {
	private state: State
	private listeners: Set<Listener>

	constructor() {
		this.state = {
			dictionaries: {},
			locale: 'en'
		}
		this.listeners = new Set()
	}

	getState = (): State => {
		return this.state
	}

	subscribe = (listener: Listener): (() => void) => {
		this.listeners.add(listener)
		return () => {
			this.listeners.delete(listener)
		}
	}

	setState = (updater: (prev: State) => State): void => {
		const newState = updater(this.state)

		if (newState !== this.state) {
			this.state = newState
			this.emitChange()
		}
	}

	setStateDirect = (newState: State): void => {
		if (newState !== this.state) {
			this.state = newState
			this.emitChange()
		}
	}

	private emitChange = (): void => {
		for (const listener of this.listeners) {
			listener(this.state)
		}
	}
}

export const store = new Store()

export const getInitialState = (): State => ({
	dictionaries: {},
	locale: 'en'
})

// Selector helpers
export const selectLocale = (state: State) => state.locale
export const selectDictionaries = (state: State) => state.dictionaries
export const selectDictionary = (state: State, locale: Locale) =>
	state.dictionaries[locale]
