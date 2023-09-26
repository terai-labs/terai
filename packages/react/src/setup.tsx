'use client'

import 'client-only'

// Dependencies
import { createTx } from '@rewordlabs/tx'
import { useEffect } from 'react'
import { createFormat } from '@rewordlabs/formatter'
import { observable } from '@legendapp/state'
import { enableReactUse } from '@legendapp/state/config/enableReactUse'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import {
  configureObservablePersistence,
  persistObservable
} from '@legendapp/state/persist'

// Types
import type { CommonSetupOptions, TxReactOptions } from './types'
import type { Dictionaries, Locale } from '@rewordlabs/types'

// Components
import { text } from './text'

enableReactUse()
configureObservablePersistence({
  persistLocal: ObservablePersistLocalStorage
})

export type SetupClientOptions = {
  locale: Locale
  persist?: boolean
} & CommonSetupOptions

export function setup({
  loader,
  locale,
  persist = true,
  ...global
}: SetupClientOptions) {
  const state$ = observable<{
    locale: Locale
    dictionaries: Dictionaries
  }>({
    locale,
    dictionaries: {}
  })

  if (persist) {
    persistObservable(state$, {
      local: 'locale'
    })
  }

  const getLocale = () => state$.locale.get()

  const useLocale = () => state$.locale.use()

  const getDictionaries = () => state$.dictionaries.get()

  const useDictionaries = () => state$.dictionaries.use()

  const useFormat = createFormat(useLocale)

  const useSyncLocale = (locale: string) => {
    useEffect(() => {
      state$.locale.set(locale as Locale)
    }, [locale])
  }

  const setLocale = async (locale: string) => {
    try {
      const chunk = (await loader(locale, locale)).default

      state$.locale.set(locale)
      state$.dictionaries.set(prev => ({
        ...prev,
        [locale]: { ...(prev[locale] ?? {}), ...chunk }
      }))
    } catch (err) {
      console.warn(err)
    }
  }

  const setChunk = async (chunkId: string) => {
    const locale = getLocale()
    const chunk = (await loader(locale, chunkId)).default

    state$.dictionaries.set(prev => ({
      ...prev,
      [locale]: { ...(prev[locale] ?? {}), ...chunk }
    }))
  }

  const useChunk = (chunkId: string) => {
    const locale = useLocale()

    useEffect(() => {
      setChunk(chunkId)
    }, [chunkId, locale])
  }

  const tx = createTx<string, TxReactOptions>({
    getLocale: useLocale,
    render: ({ id, ...props }) => {
      const dictionaries = getDictionaries()
      const locale = useLocale()
      const rawMessage = dictionaries[locale][id]

      return text({
        ...props,
        ...(rawMessage && { rawMessage }),
        global,
        id
      })
    }
  })

  function onStart() {
    setLocale(locale)
  }

  onStart()

  return {
    tx,
    useLocale,
    useDictionaries,
    useSyncLocale,
    setLocale,
    getLocale,
    useFormat,
    useChunk
  }
}
