'use server'

// Dependencies
import { interpolate } from '@rewordlabs/formatter'

// Types
import type { MessageExpression } from '@rewordlabs/formatter'
import type { CreateSetupServerOptions, SetupServerOptions } from './setup'

type TextProps = {
  id: string
  rawMessage: string
  variables: MessageExpression[]
  loader: SetupServerOptions['loader']
  getLocale: CreateSetupServerOptions['getLocale']
}

export async function Text({
  id,
  loader,
  rawMessage,
  variables,
  getLocale
}: TextProps) {
  const locale = await getLocale()
  const json = await loader(locale, id)
  const message = interpolate({
    message: typeof json === 'string' ? json : rawMessage,
    locale,
    variables
  })

  return message
}
