'use server'

// Dependencies
import { createReactInterpolate } from '@rewordlabs/react'

// Types
import type { TextProps } from '@rewordlabs/react'

export async function Text({
  getLocale,
  id,
  loader,
  rawMessage,
  variables,
  components,
  format,
  global
}: TextProps) {
  const locale = getLocale()
  const json = await loader(locale, id)
  const interpolate = createReactInterpolate({
    locale,
    plugins: global.plugins,
    components: {
      ...global?.components,
      ...components
    },
    format: {
      ...global?.format,
      ...format
    }
  })
  const message = interpolate({
    message: typeof json === 'string' ? json : rawMessage,
    locale,
    variables
  })

  return <>{message}</>
}
