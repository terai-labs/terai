// Dependencies
import { createFormat } from '@terai/formatter'

// Hooks
import { useLocale } from './use-locale'

/**
 * Hook to access the current format
 */
export const useFormat = createFormat(useLocale)
