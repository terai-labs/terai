'use client'

// Depedencies
import { observable } from '@legendapp/state'

// Types
import type { Dictionaries } from '@koi18n/types'

export const dictionaries$ = observable<Dictionaries>()
