import { describe, expect, test } from 'vitest'
import { merge } from '../src'

describe('merge', () => {
	test('should merge objects', () => {
		const sut = merge
		const obj1: Record<any, any> = { a: 1, b: 2 }
		const obj2: Record<any, any> = {
			c: 3,
			d: 4,
			e: {
				f: 5,
				g: 6
			}
		}

		const output = sut(obj1, obj2)

		expect(output).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": 2,
        "c": 3,
        "d": 4,
        "e": {
          "f": 5,
          "g": 6,
        },
      }
    `)
	})
})
