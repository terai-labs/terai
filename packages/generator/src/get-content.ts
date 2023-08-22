// Dependencies
import type { Messages } from '@rosetta.js/types'
import { outdent } from 'outdent'

export function getContent({
  messages,
  isTs
}: {
  messages: Messages
  isTs: boolean
}) {
  const output = []
  for (const msg in messages) {
    output.push({
      id: msg,
      value: messages[msg]
    })
  }

  return outdent`
    export default {
      ${output
        .map(msg => {
          return `${msg.id}: "${msg.value.substring(
            1,
            msg.value.length - 1
          )}"`
        })
        .join(',\n  ')}
    }${isTs ? ' as const' : ''}
  `
}
