// Types
import type { Dictionaries, Locale } from '@terai/types'

export type State = {
	dictionaries: Dictionaries
	locale: Locale
	started: boolean
}

type Listener = () => void

// External store implementation
class TeraiStore {
	private state: State
	private listeners: Set<Listener>
	private lastSnapshot: State

	constructor() {
		this.state = {
			dictionaries: {},
			locale: 'en',
			started: false
		}
		this.listeners = new Set()
		this.lastSnapshot = this.state
	}

	// Get current state snapshot (immutable)
	getSnapshot = (): State => {
		// Return cached snapshot if state hasn't changed
		// This prevents infinite re-render loops
		if (this.lastSnapshot !== this.state) {
			this.lastSnapshot = this.state
		}
		return this.lastSnapshot
	}

	// Subscribe to store changes
	subscribe = (listener: Listener): (() => void) => {
		this.listeners.add(listener)
		// Return unsubscribe function
		return () => {
			this.listeners.delete(listener)
		}
	}

	// Update state
	setState = (updater: (prev: State) => State): void => {
		const newState = updater(this.state)

		// Only update if state actually changed
		if (newState !== this.state) {
			this.state = newState
			this.lastSnapshot = newState
			// Notify all listeners
			this.emitChange()
		}
	}

	// Set state directly
	setStateDirect = (newState: State): void => {
		if (newState !== this.state) {
			this.state = newState
			this.lastSnapshot = newState
			this.emitChange()
		}
	}

	// Get current state (for imperative access)
	getState = (): State => {
		return this.state
	}

	// Notify all listeners
	private emitChange = (): void => {
		for (const listener of this.listeners) {
			listener()
		}
	}
}

// Global store instance
export const teraiStore = new TeraiStore()

// Helper to get initial state
export const getInitialState = (): State => ({
	dictionaries: {},
	locale: 'en',
	started: false
})
