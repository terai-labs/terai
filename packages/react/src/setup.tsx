// Dependencies
import { ref } from 'valtio'

// Utils
import { createState } from './state'
import { createMessageComponent } from './message'
import { createTx } from './tx'
import { createUseLocale } from './use-locale'
import { createUseChangeLocale } from './use-change-locale'

// Types
import type { SetupOptions } from './types'

export function setupRosetta(options: SetupOptions) {
  const state = createState({
    locale: options.locale,
    messages: {}
  })
  const Message = createMessageComponent(state)
  const tx = createTx(Message)
  const useLocale = createUseLocale(state)
  const useChangeLocale = createUseChangeLocale(options, state)

  options.messages[options.locale]().then(
    loc => (state.messages = ref(loc.default))
  )

  return {
    tx,
    useLocale,
    useChangeLocale
  }
}
