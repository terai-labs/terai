import { proxy, ref, subscribe, useSnapshot } from 'valtio'
import type { BaseLocale, ImportedLocales } from '@rosetta.js/types'
import { toHash } from '@rosetta.js/utils'

export function getRosseta({
  locale,
  locales
}: {
  locale: string
  locales: ImportedLocales
}) {
  const state = proxy<{
    locale?: string
    messages: BaseLocale
  }>({
    locale: locale,
    messages: {}
  })

  locales[locale]().then(loc => (state.messages = ref(loc.default)))

  subscribe(state, () => console.log('state has changed to', state))

  function tx({ defaultMessage }: { defaultMessage: string }) {
    return <Label str={defaultMessage} />
  }

  function Label({ str }: { str: string }) {
    const snap = useSnapshot(state)
    const id = toHash(str)
    const tag = snap?.messages?.[id] || '__MISSING_TRANSLATION__'

    return <>{tag}</>
  }

  function changeLocale(locale: string) {
    locales[locale]().then(loc => {
      state.messages = ref(loc.default)
      state.locale = locale
    })
  }

  return { tx, changeLocale }
}
