import type { ImportedLocales } from '@rosetta.js/types'

export function createGetStaticParams<Locales extends ImportedLocales>(
  locales: Locales
) {
  return function getStaticParams() {
    return Object.keys(locales).map(locale => ({
      locale
    }))
  }
}
