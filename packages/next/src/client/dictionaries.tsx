'use client'

// Depedencies
import { observable } from '@legendapp/state'

// Types
import type { Dictionaries } from '@terai/types'

export const dictionaries$ = observable<Dictionaries>()
