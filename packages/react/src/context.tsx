// Dependencies
import { createContext, useState, useCallback, useMemo, useEffect } from 'react'

// Types
import type { BaseLocale, ImportedLocales } from '@rosetta.js/types'
import type { ReactNode } from 'react'

type Context = {
  locale: string
  locales: ImportedLocales
  messages: BaseLocale
}

type ProviderProps = Context & {
  children: ReactNode
}

export const RosettaContext = createContext<Context>({
  locale: 'en',
  locales: {},
  messages: {}
})

export const RosettaProvider = ({
  children,
  locales,
  locale
}: ProviderProps) => {
  const [clientLocale, setClientLocale] = useState<{
    locale: string
    messages: BaseLocale
  }>({
    locale,
    messages: {}
  })

  const loadLocale = useCallback(async (locale: string) => {
    const mod = await locales[locale]()

    return flattenLocale<BaseLocale>(mod)
  }, [])

  const value = useMemo<Context>(
    () => ({
      locales,
      ...clientLocale
    }),
    []
  )

  useEffect(() => {
    async function setStart() {
      const messages = await loadLocale(locale)
      setClientLocale({
        locale,
        messages
      })
    }

    setStart()
  }, [])

  return (
    <RosettaContext.Provider value={value}>{children}</RosettaContext.Provider>
  )
}

export const flattenLocale = <Locale extends BaseLocale>(
  locale: Locale,
  prefix = ''
): Locale =>
  Object.entries(locale).reduce(
    (prev, [name, value]) => ({
      ...prev,
      ...(typeof value === 'string'
        ? { [prefix + name]: value }
        : flattenLocale(value as unknown as Locale, `${prefix}${name}.`))
    }),
    {} as Locale
  )
