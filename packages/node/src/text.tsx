// Dependencies
import { interpolate, type TxRenderProps } from '@rewordlabs/formatter'

// Types
import type { SetupOptions } from './setup'

export type TextProps = TxRenderProps & {
  global: Pick<SetupOptions, 'format' | 'plugins'>
}

export async function text({
  getLocale,
  id,
  loader,
  rawMessage,
  variables,
  format,
  global,
  chunkId = id
}: TextProps) {
  const locale = getLocale()
  const json = await loader(locale, chunkId, id)
  const message = interpolate(
    {
      message: typeof json === 'string' ? json : rawMessage,
      locale,
      variables
    },
    {
      plugins: global.plugins,
      format: {
        ...global?.format,
        ...format
      }
    }
  )

  return message as string
}
