// Dependencies
import { format } from '@rosetta.js/formatter'
import { prepareMessage } from '@rosetta.js/utils'
import { toHash } from '@rosetta.js/utils'
import { useSnapshot } from 'valtio'

// Types
import type { MessageValue } from '@rosetta.js/types'
import type { State } from './types'

export const createMessageComponent =
  (state: State) =>
  ({ message, vars }: { message: string; vars: MessageValue[] }) => {
    const msg = prepareMessage(message)
    const snap = useSnapshot(state)
    const id = toHash(msg)
    const tag = snap?.messages?.[id] || '__MISSING_TRANSLATION__'

    return <>{format(snap.locale, tag, vars)}</>
  }
