// Dependencies
import { prepareMessage, toHash } from '@rosetta.js/utils'
import { format } from './format'

// Types
import type { Dictionary, Locale, MessageVariables } from '@rosetta.js/types'

export function txFormat({
  strings,
  vars,
  dictionary,
  locale
}: {
  strings: TemplateStringsArray
  vars: MessageVariables[]
  dictionary: Dictionary
  locale: Locale
}) {
  const message = strings.raw.join('${VAR}')
  const msg = prepareMessage(message)
  const id = toHash(msg)
  const tag = dictionary?.[id] || 'Missing message 😕'

  return format(locale, tag, vars)
}
