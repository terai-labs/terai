'use server'

// Dependencies
import { interpolate } from '@rewordlabs/formatter'

// Types
import type { TxRenderProps } from '@rewordlabs/formatter'

export async function Text({
  id,
  loader,
  rawMessage,
  variables,
  getLocale
}: TxRenderProps) {
  const locale = getLocale()
  const json = await loader(locale, id)
  const message = interpolate({
    message: typeof json === 'string' ? json : rawMessage,
    locale,
    variables
  })

  return message
}
