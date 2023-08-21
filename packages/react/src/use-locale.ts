// Dependencies
import { useSnapshot } from 'valtio'

// Types
import type { State } from './types'

export const createUseLocale = (state: State) => () => useSnapshot(state)
