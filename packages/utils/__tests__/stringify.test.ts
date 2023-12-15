import { describe, expect, test } from 'vitest'
import { stringify } from '../src'

describe('stringify', () => {
  test('should stringify objects', () => {
    const sut = stringify
    const obj1 = { a: 1, b: 2, c: { d: 3, e: 4 } }

    const output = sut(obj1)

    expect(output).toMatchInlineSnapshot(`
      "{
        "a": 1,
        "b": 2,
        "c": {
          "d": 3,
          "e": 4
        }
      }"
    `)
  })
})
