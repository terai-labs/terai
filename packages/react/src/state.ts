// Dependencies
import { proxy } from 'valtio'

// Types
import type { State } from './types'

export const createState = (initialState: State) => {
  return proxy<State>(initialState)
}
