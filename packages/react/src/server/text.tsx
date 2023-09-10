'use server'

// Types
import type { TxRenderProps } from '@rewordlabs/formatter'
import type { InterpolateFn } from '../interpolate'

type TextProps = TxRenderProps & {
  interpolate: InterpolateFn
}

export async function Text({
  getLocale,
  id,
  interpolate,
  loader,
  rawMessage,
  variables
}: TextProps) {
  const locale = getLocale()
  const json = await loader(locale, id)
  const message = interpolate({
    message: typeof json === 'string' ? json : rawMessage,
    locale,
    variables
  })

  return <>{message}</>
}
