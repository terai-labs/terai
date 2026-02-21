const CACHE_MAX_SIZE = 500

export const memo = <T extends (...args: any[]) => any>(fn: T): T => {
	const cache = new Map<string, ReturnType<T>>()

	const get = (...args: any[]) => {
		let key: string
		if (args.length === 1 && typeof args[0] === 'string') {
			key = args[0]
		} else if (args.length === 1 && Array.isArray(args[0])) {
			key = args[0].join('\0')
		} else {
			key = args.join('\0')
		}

		const cached = cache.get(key)
		if (cached !== undefined) return cached

		const result = fn(...args)

		if (cache.size >= CACHE_MAX_SIZE) {
			const firstKey = cache.keys().next().value
			if (firstKey !== undefined) cache.delete(firstKey)
		}

		cache.set(key, result)
		return result
	}

	return get as T
}
