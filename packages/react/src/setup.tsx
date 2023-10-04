'use client'

import 'client-only'

// Dependencies
import { batch, observable } from '@legendapp/state'
import { configureObservablePersistence } from '@legendapp/state/persist'
import { createFormat, interpolate } from '@rewordlabs/formatter'
import { createTx } from '@rewordlabs/tx'
import { enableReactUse } from '@legendapp/state/config/enableReactUse'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import { persistObservable } from '@legendapp/state/persist'
import { useEffect } from 'react'

// Types
import type { Dictionaries, Locale } from '@rewordlabs/types'
import type { CommonSetupOptions, TxReactRenderProps } from './core'

export type SetupClientOptions = CommonSetupOptions & {
  locale: Locale
  persist?: boolean
}

enableReactUse()

export function setup({
  loader,
  locale,
  persist = true,
  format = {}
}: SetupClientOptions) {
  const state$ = observable<{
    locale: Locale
    dictionaries: Dictionaries
  }>({
    locale,
    dictionaries: {}
  })

  if (persist) {
    configureObservablePersistence({
      persistLocal: ObservablePersistLocalStorage
    })
    persistObservable(state$, {
      local: 'locale'
    })
  }

  const useLocale = (): [Locale, (locale: Locale) => Promise<void>] => [
    state$.locale.use(),
    setLocale
  ]

  const useFormat = createFormat(state$.locale.use)

  const setLocale = async (locale: string) => {
    try {
      const chunk = (await loader(locale, locale)).default

      batch(() => {
        state$.locale.set(locale)
        state$.dictionaries[locale].set((prev = {}) => ({
          ...prev,
          ...chunk
        }))
      })
    } catch (err) {
      console.warn(err)
    }
  }

  const setChunk = async (chunkId: string) => {
    const locale = state$.locale.get()
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

  const tx = createTx<string, TxReactRenderProps>({
    render: ({ id, variables, rawMessage, ...props }) => {
      const locale = state$.locale.use()
      const message = state$.dictionaries?.[locale]?.[id]?.get() ?? rawMessage

      return interpolate(
        {
          message,
          locale,
          variables
        },
        {
          format: {
            ...format,
            ...props.format
          }
        }
      )
    }
  })

  function onStart() {
    setLocale(locale)
  }

  onStart()

  return {
    tx,
    setLocale,
    useLocale,
    useFormat,
    useChunk
  }
}
