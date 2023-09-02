// Dependencies
import type { Dictionary } from '@rosetta.js/types'
import { outdent } from 'outdent'

export function getContent({
  dictionary,
  isTs
}: {
  dictionary: Dictionary
  isTs: boolean
}) {
  const output = []
  for (const msg in dictionary) {
    output.push({
      id: msg,
      value: dictionary[msg]
    })
  }

  return outdent`
    export default {
      ${output
        .map(msg => {
          return `${msg.id}: "${msg.value}"`
            .replaceAll(`"'`, '"')
            .replaceAll(`'"`, '"')
        })
        .join(',\n  ')}
    }${isTs ? ' as const' : ''}
  `
}
