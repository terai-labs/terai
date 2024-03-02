import { stringify } from './stringify'

export const memo = <T extends (...args: any[]) => any>(fn: T): T => {
	const cache = new Map()

	const get = (...args: any[]) => {
		const key = stringify(args)
		if (cache.has(key)) {
			return cache.get(key)
		}
		const result = fn(...args)
		cache.set(key, result)
		return result
	}

	return get as T
}
