'use client'

// Dependencies
import { observable } from '@legendapp/state'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import { enableReactUse } from '@legendapp/state/config/enableReactUse'
import { useEffect } from 'react'
import {
  configureObservablePersistence,
  persistObservable
} from '@legendapp/state/persist'

// Types
import type { Dictionary } from '@koi18n/types'

configureObservablePersistence({
  persistLocal: ObservablePersistLocalStorage
})

enableReactUse()

type useQueryProps = {
  id: string
  locale: string
  loader: () => Promise<{
    default: Dictionary
  }>
}

export function useQuery({ id, locale, loader }: useQueryProps) {
  const state$ = observable<Dictionary>({})
  persistObservable(state$, {
    local: locale
  })
  const value = state$.use()[id]

  useEffect(() => {
    loader().then(mod => state$.set(mod.default))
  }, [locale])

  if (!value && typeof document !== 'undefined') {
    console.log('Start promise')
    throw new Promise<void>(resolve => {
      loader().then(res => {
        state$.set(res.default)
        console.log('Post promise')
        resolve()
      })
    })
  }

  return value
}
