// Types
import type { Dictionaries, Locale } from '@terai/types'

export type State = {
	dictionaries: Dictionaries
	locale: Locale
}

type Listener = () => void

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

	getSnapshot = (): State => {
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

	getState = (): State => {
		return this.state
	}

	private emitChange = (): void => {
		for (const listener of this.listeners) {
			listener()
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
