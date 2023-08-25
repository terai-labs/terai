// Dependencies
import { observable } from '@legendapp/state'

// Types
import type { ObservableState, State } from './types'

export const createState = (initialState: State): ObservableState => {
  return observable<State>(initialState)
}
