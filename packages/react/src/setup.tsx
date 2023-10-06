// Dependencies
import { observable } from '@legendapp/state'
import { createSetupClient } from './core/client'

// Types
import type { Locale } from '@tsmu/types'
import type { SetupClientOptions } from './core/client'

export const setup = (options: SetupClientOptions) => {
  const locale$ = observable<Locale>('es')

  function setLocale(locale: Locale) {
    locale$.set(locale)
  }

  const setup = createSetupClient({
    getLocale: () => locale$.get()
  })

  const a = setup(options)
  console.log(a)

  return {
    ...setup(options),
    setLocale,
    useChunk: () => 'hola'
  }
}
