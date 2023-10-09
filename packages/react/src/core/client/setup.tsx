'use client'

// Dependencies
import 'client-only'
import { createFormat } from '@koi18n/formatter'
import { createTs } from '@koi18n/ts'
import { tsRender } from '../ts-render'
import { observable } from '@legendapp/state'
import { enableReactUse } from '@legendapp/state/config/enableReactUse'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import { useCallback } from 'react'
import {
  configureObservablePersistence,
  persistObservable
} from '@legendapp/state/persist'

// Types
import type { CreateSetupOptions } from '../types'
import type { SetupReactOptions, TsReactRenderProps } from '../types'
import type { Dictionaries } from '@koi18n/types'

export type SetupClient = ReturnType<typeof createSetupClient>
export type SetupClientOptions = SetupReactOptions & {
  persist?: boolean
}

enableReactUse()

export function createSetupClient({ getLocale }: CreateSetupOptions) {
  return function createSetup({
    loader,
    components = {},
    format = {},
    persist = true
  }: SetupClientOptions) {
    const dictionaries$ = observable<Dictionaries>({})
    const useFormat = createFormat(getLocale)
    const useTs = () => {
      const locale = getLocale()
      const dictionary = dictionaries$[locale].use()

      if (!dictionary) {
        throw loader(locale, locale).then(mod =>
          dictionaries$[locale].set(prev => ({
            ...prev,
            ...mod.default
          }))
        )
      }

      const ts = useCallback(
        createTs<string, TsReactRenderProps>({
          render: props => {
            return tsRender({
              ...props,
              locale,
              dictionary,
              components: {
                ...components,
                ...props.components
              },
              format: {
                ...format,
                ...props.format
              }
            })
          }
        }),
        [locale]
      )

      return ts
    }

    if (persist) {
      configureObservablePersistence({
        persistLocal: ObservablePersistLocalStorage
      })
      persistObservable(dictionaries$, {
        local: 'dictionaries'
      })
    }

    return {
      useTs,
      useFormat,
      useLocale: getLocale
    }
  }
}
