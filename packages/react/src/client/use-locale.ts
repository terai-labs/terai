// Types
import type { ObservableState } from './types'

export const createUseLocale = (state$: ObservableState) => () =>
  state$.locale.get()
