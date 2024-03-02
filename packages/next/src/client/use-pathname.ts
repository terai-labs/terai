'use client'

// Dependencies
import { hasPathnamePrefixed, unlocalizePathname } from './utils'
import { useLocale } from './use-locale'
import { useMemo } from 'react'
import { usePathname as useNextPathname } from 'next/navigation'

/**
 * Returns the pathname without a potential locale prefix.
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import {usePathname} from 'next-intl/client';
 *
 * // When the user is on `/en`, this will be `/`
 * const pathname = usePathname();
 * ```
 */
export function usePathname(): string {
	const pathname = useNextPathname()
	const locale = useLocale()

	return useMemo(() => {
		if (!pathname) return pathname

		const isPathnamePrefixed = hasPathnamePrefixed(locale, pathname)
		const unlocalizedPathname = isPathnamePrefixed
			? unlocalizePathname(pathname, locale)
			: pathname

		return unlocalizedPathname
	}, [locale, pathname])
}
