export function merge<A extends Record<any, any>>(obj1: A, obj2: A): A {
	for (const key in obj2) {
		// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
		if (obj2.hasOwnProperty(key)) {
			if (
				typeof obj2[key] === 'object' &&
				obj2[key] !== null &&
				!Array.isArray(obj2[key])
			) {
				// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
				if (!obj1.hasOwnProperty(key)) {
					// @ts-ignore
					obj1[key] = {}
				}
				obj1[key] = merge(obj1[key], obj2[key])
			} else {
				obj1[key] = obj2[key]
			}
		}
	}
	return obj1
}
