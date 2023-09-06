// Dependencies
import { memo } from 'react'
import { interpolate } from '@rewordlabs/formatter'
import { useQuery } from '@tanstack/react-query'

// Types
import type { Locale } from '@rewordlabs/types'
import { type MessageExpression } from '@rewordlabs/formatter'
import type { SetupOptions } from './types'

type TextProps = {
  id: string
  loader: SetupOptions['loader']
  rawMessage: string
  variables: MessageExpression[]
  locale: Locale
}

export const Text = memo(
  ({ id, loader, rawMessage, variables, locale }: TextProps) => {
    const query = useQuery({
      queryKey: [locale, id],
      queryFn: () => loader(locale, id),
      enabled: process.env.NODE_ENV !== 'development'
    })

    const message = interpolate({
      message: typeof query?.data === 'string' ? query?.data : rawMessage,
      locale,
      variables
    })

    return <>{message}</>
  },
  (prevProps, nexProps) =>
    prevProps.locale === nexProps.locale && prevProps.id === nexProps.id
)
