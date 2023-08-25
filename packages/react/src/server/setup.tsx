// Dependencies
import { createTx } from './tx'

// Types
import type { SetupOptions } from './types'

export async function setupRosetta({ locale, dictionaries }: SetupOptions) {
  return {
    tx: createTx((await dictionaries[locale]()).default, locale)
  }
}
