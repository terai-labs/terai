'use client'

import 'client-only'

// Dependencies
import { createTx } from '@rewordlabs/tx'
import { useCallback, useEffect, type ReactNode } from 'react'
import { createFormat } from '@rewordlabs/formatter'
import { batch, observable } from '@legendapp/state'
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
import { createReactInterpolate } from './interpolate'

export type SetupClientOptions = {
  locale: Locale
  persist?: boolean
} & CommonSetupOptions

enableReactUse()

export function setup({
  loader,
  locale,
  persist = true,
  plugins = [],
  components = {},
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

  const tx = createTx<string | ReactNode, TxReactOptions>({
    render: ({
      id,
      variables,
      rawMessage,
      components: txComponents = {},
      format: txFormat = {},
      plugins: txPlugins = []
    }) => {
      const locale = state$.locale.use()
      const message = state$.dictionaries?.[locale]?.[id]?.get() ?? rawMessage
      const interpolate = useCallback(
        createReactInterpolate({
          locale,
          plugins: [...plugins, ...txPlugins],
          components: {
            ...components,
            ...txComponents
          },
          format: {
            ...format,
            ...txFormat
          }
        }),
        []
      )

      return interpolate({
        message,
        locale,
        variables
      })
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
