'use server'

import 'server-only'

// Dependencies
import { getLocaleCache } from './get-locale-cache'
import { createReactInterpolate } from '@rewordlabs/react/core'

// Types
import type { TextProps } from '../types'

export async function SSRText({
  id,
  loader,
  rawMessage,
  variables,
  components,
  format
}: TextProps<Promise<string>>) {
  const locale = getLocaleCache()
  const json = (await loader(locale, locale)).default[id]

  const interpolate = createReactInterpolate({
    locale,
    components,
    format
  })

  const message = interpolate({
    message: typeof json === 'string' ? json : rawMessage,
    locale,
    variables
  })

  return <>{message}</>
}
