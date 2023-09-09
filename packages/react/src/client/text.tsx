'use client'

// Dependencies
import { interpolate } from '@rewordlabs/formatter'
import { useQuery } from '@tanstack/react-query'

// Types
import type { MessageExpression } from '@rewordlabs/formatter'
import type { SetupClientOptions } from './setup'
import type { Locale } from '@rewordlabs/types'

type TextProps = {
  id: string
  loader: SetupClientOptions['loader']
  rawMessage: string
  variables: MessageExpression[]
  getLocale: () => Locale
}

export const Text = ({
  id,
  loader,
  rawMessage,
  getLocale,
  variables
}: TextProps) => {
  const locale = getLocale()
  const query = useQuery({
    queryKey: [locale, id],
    queryFn: () => loader(locale, id)
  })

  const message = interpolate({
    message: typeof query?.data === 'string' ? query?.data : rawMessage,
    locale,
    variables
  })

  return <>{message}</>
}
