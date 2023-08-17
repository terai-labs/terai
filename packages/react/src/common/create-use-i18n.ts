import { useContext, type Context } from 'react'
import type { BaseLocale } from '@rosetta.js/types'
import type { LocaleContext } from '../types'
import { createT } from './create-t'

export function createUsei18n<Locale extends BaseLocale>(
  I18nClientContext: Context<LocaleContext<Locale> | null>
) {
  return function useI18n() {
    const context = useContext(I18nClientContext)

    if (!context) {
      throw new Error('`useI18n` must be used inside `I18nProvider`')
    }

    return createT(context, undefined)
  }
}