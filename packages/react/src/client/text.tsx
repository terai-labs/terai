'use client'

// Dependencies
import { useQuery } from '@tanstack/react-query'

// Types
import type { TxRenderProps } from '@rewordlabs/formatter'
import type { InterpolateFn } from '../interpolate'

type TextProps = TxRenderProps & {
  interpolate: InterpolateFn
}

export const Text = ({
  getLocale,
  id,
  interpolate,
  loader,
  rawMessage,
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
