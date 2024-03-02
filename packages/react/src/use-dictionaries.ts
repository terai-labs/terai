import { state$ } from './state'
import { useSelector } from '@legendapp/state/react'

export const useDictionaries = () => useSelector(state$.dictionaries)
