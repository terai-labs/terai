const MAX_CACHE_SIZE = 50
const cache = new Map<string, any>()

export function getCachedIntl<T>(
	Ctor: new (locale: string, options?: any) => T,
	locale: string,
	options?: object
): T {
	const key = locale + (options ? JSON.stringify(options) : '')
	const cached = cache.get(key)
	if (cached) return cached as T

	if (cache.size >= MAX_CACHE_SIZE) {
		const firstKey = cache.keys().next().value
		if (firstKey !== undefined) cache.delete(firstKey)
	}

	const instance = new Ctor(locale, options)
	cache.set(key, instance)
	return instance
}
