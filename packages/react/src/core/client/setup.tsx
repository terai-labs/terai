'use client'

// Dependencies
import { createFormat } from '@koi18n/formatter'
import { createTs } from '@koi18n/ts'
import { tsRender } from '../ts-render'
import { tsrRender } from '../tsr-render'
import { observable } from '@legendapp/state'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import { useCallback, useEffect } from 'react'
import {
  configureObservablePersistence,
  persistObservable
} from '@legendapp/state/persist'

// Types
import type { Dictionaries, Locale } from '@koi18n/types'
import type { ReactNode } from 'react'
import type { CreateSetupOptions, GetTsProps } from '../types'
import type { SetupReactOptions, TsReactRenderProps } from '../types'

export type SetupClient = ReturnType<typeof createSetupClient>
export type SetupClientOptions = SetupReactOptions & {
  persist?: boolean
}

export const createSetupClient =
  ({ getLocale }: CreateSetupOptions) =>
  ({ loader, components = {}, format = {}, persist }: SetupClientOptions) => {
    const dictionaries$ = observable<Dictionaries>({})
    const loadDictionary = (locale: Locale, chunkId: string, id: string) =>
      loader(locale, chunkId).then(dic =>
        dictionaries$[id].set(prev => ({
          ...prev,
          ...dic
        }))
      )
    const useFormat = createFormat(getLocale)
    const useTs = ({ chunkId }: GetTsProps = {}) => {
      const locale = getLocale()
      const dictionaryId = chunkId ? `${locale}-${chunkId}` : locale
      const dictionary = dictionaries$[dictionaryId].get()
      const loaderId = chunkId ?? locale

      if (!dictionary) throw loadDictionary(locale, loaderId, dictionaryId)

      if (persist) {
        useEffect(() => {
          loadDictionary(locale, loaderId, dictionaryId)
        }, [locale])
      }

      const ts = useCallback(
        createTs<string, {}>(props =>
          tsRender({
            ...props,
            locale,
            dictionary,
            format: {
              ...format,
              ...props.format
            }
          })
        ),
        [locale]
      )

      const tsr = useCallback(
        createTs<ReactNode, TsReactRenderProps>(props =>
          tsrRender({
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
        ),
        [locale]
      )

      return { ts, tsr }
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
