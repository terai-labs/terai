import { describe, expect, test } from 'vitest'
import { toHash } from '../src'

describe('toHash', () => {
  test('should generate a hash from a string', () => {
    const sut = toHash
    const obj1 = 'Hello world!'

    const output = sut(obj1)

    expect(output).toMatchInlineSnapshot('"dQxGBP"')
  })
})
