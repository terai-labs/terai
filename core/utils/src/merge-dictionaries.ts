import type { Dictionary } from '@rewordlabs/types'

export function mergeDictionaries(
  obj1: Dictionary,
  obj2: Dictionary
): Dictionary {
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (
        typeof obj2[key] === 'object' &&
        obj2[key] !== null &&
        !Array.isArray(obj2[key])
      ) {
        if (!obj1.hasOwnProperty(key)) {
          obj1[key] = {}
        }
        // @ts-ignore
        obj1[key] = mergeDictionaries(obj1[key], obj2[key])
      } else {
        obj1[key] = obj2[key]
      }
    }
  }
  return obj1
}
