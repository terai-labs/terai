// Dependencies
import { format } from '@rosetta.js/formatter'
import { prepareMessage } from '@rosetta.js/utils'
import { toHash } from '@rosetta.js/utils'

// Types
import type { MessageVars } from '@rosetta.js/types'
import type { ObservableState } from './types'

export const createMessageComponent =
  (state$: ObservableState) =>
  ({ message, vars }: { message: string; vars: MessageVars[] }) => {
    const locale = state$.locale.use()
    const messages = state$.messages.use()
    const msg = prepareMessage(message)
    const id = toHash(msg)
    const tag = messages?.[locale]?.[id] || 'Missing message 😕'

    return <>{format(locale, tag, vars)}</>
  }
