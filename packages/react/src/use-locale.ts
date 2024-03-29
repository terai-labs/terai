import { state$ } from './state'
import { useSelector } from '@legendapp/state/react'

export const useLocale = () => useSelector(state$.locale)
