// Dependencies
import { interpolate } from '@rewordlabs/formatter'
import { getLocaleCache } from './get-locale-cache'

// Types
import type { MessageExpression } from '@rewordlabs/formatter'
import type { SetupOptions } from './setup'

type TextProps = {
  id: string
  loader: SetupOptions['loader']
  rawMessage: string
  variables: MessageExpression[]
}

export async function Text({ id, loader, rawMessage, variables }: TextProps) {
  const locale = (await getLocaleCache()) ?? 'en'
  const json = await loader(locale, id)
  const message = interpolate({
    message: typeof json === 'string' ? json : rawMessage,
    locale,
    variables
  })

  return message
}
