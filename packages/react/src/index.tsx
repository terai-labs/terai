// Dependencies
import { proxy, ref, useSnapshot } from 'valtio'

// Types
import type {
  Dictionary,
  ImportedDictionaries,
  Locale
} from '@rosetta.js/types'

// Utils
import { toHash } from '@rosetta.js/utils'
import { format } from '@rosetta.js/formatter'

export function setupRosetta({
  locale,
  dictionaries
}: {
  locale: Locale
  dictionaries: ImportedDictionaries
}) {
  const state = proxy<{
    locale: Locale
    dictionary: Dictionary
  }>({
    locale,
    dictionary: {}
  })

  dictionaries[locale]().then(loc => (state.dictionary = ref(loc.default)))

  function tx(msg: string) {
    return <Msg str={msg} />
  }

  function Msg({ str }: { str: string }) {
    const snap = useSnapshot(state)
    const id = toHash(str)
    const tag = snap?.dictionary?.[id] || '__MISSING_TRANSLATION__'

    // @ts-ignore
    return <>{format(locale, tag)}</>
  }

  const useLocale = () => {
    return useSnapshot(state)
  }

  const useChangeLocale =
    () => (locale: Locale | ((locale: Locale) => Locale)) => {
      if (typeof locale === 'string') {
        state.locale = locale
      } else {
        state.locale = locale(state.locale)
      }

      dictionaries[state.locale]().then(loc => {
        state.dictionary = ref(loc.default)
      })
    }

  return {
    tx,
    useLocale,
    useChangeLocale
  }
}
