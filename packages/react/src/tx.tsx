import type { MessageValue } from '@rosetta.js/types'
import { createMessageComponent } from './message'

export const createTx =
  (Message: ReturnType<typeof createMessageComponent>) =>
  (strings: TemplateStringsArray, ...vars: MessageValue[]) => {
    const message = strings.raw.join('${VAR}')

    return <Message message={message} vars={vars} />
  }
