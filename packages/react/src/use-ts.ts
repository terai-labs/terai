// Dependencies
import { createTs } from '@terai/ts'
import { useEffect, useCallback } from 'react'
import { tsRender } from './ts-render'
import { useLocale } from './use-locale'
import { setup$ } from './setup'
import { enableReactUse } from '@legendapp/state/config/enableReactUse'

// Types
import type { Locale } from '@terai/types'

enableReactUse()

type UseTsProps = {
  chunkId?: string
}

export const useTs = ({ chunkId }: UseTsProps = {}) => {
  const locale = useLocale()
  const dictionaryId = chunkId ? `${locale}-${chunkId}` : locale
  const setup = setup$.get()
  const dictionary = setup.dictionaries[dictionaryId]
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
          ...setup.format,
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

  if (loader) {
    const dic = await loader(locale, chunkId)

    setup$.dictionaries[id].set(prev => ({
      ...prev,
      ...dic
    }))
  }
}
