'use client'

// Dependencies
import { interpolate } from '@rewordlabs/formatter'
import { useQuery } from '@tanstack/react-query'

// Types
import type { TxRenderProps } from '@rewordlabs/formatter'

export const Text = ({
  id,
  loader,
  rawMessage,
  getLocale,
  variables
}: TxRenderProps) => {
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
