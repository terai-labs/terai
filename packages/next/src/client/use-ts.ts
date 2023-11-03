'use client'

// Dependencies
import { createTs } from '@koi18n/ts'
import { dictionaries$ } from './dictionaries'
import { setup$ } from './setup'
import { tsRender } from '../ts-render'
import { useEffect, useCallback } from 'react'
import { useLocale } from './use-locale'

// Types
import type { Locale } from '@koi18n/types'

type UseTsProps = {
  chunkId?: string
}

export const useTs = ({ chunkId }: UseTsProps = {}) => {
  const locale = useLocale()
  const dictionaryId = chunkId ? `${locale}-${chunkId}` : locale
  const setup = setup$.get()
  const dictionary = dictionaries$[dictionaryId].get()
  const loaderId = chunkId ?? locale

  if (!dictionary) throw loadDictionary(locale, loaderId, dictionaryId)

  if (setup.persist) {
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
          // ...setup.format,
          ...props.format
        }
      })
    ),
    [locale]
  )

  return { ts }
}

const loadDictionary = async (locale: Locale, chunkId: string, id: string) => {
  const loader = setup$.get().loader
  const dic = await loader(locale, chunkId)

  dictionaries$[id].set(prev => ({
    ...prev,
    ...dic
  }))
}
