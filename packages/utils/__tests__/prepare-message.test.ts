import { describe, expect, test } from 'vitest'
import { prepareMessage } from '../src'

describe('prepareMessage', () => {
  test('should replace dynamic vars', () => {
    const sut = prepareMessage
    const message = "Hello ${'world'}"

    const output = sut(message)

    expect(output).toMatchInlineSnapshot('"Hello ${var}"')
  })
  test('should replace characters added by template string format', () => {
    const sut = prepareMessage
    const message = `Hello
    world!`

    const output = sut(message)

    expect(output).toMatchInlineSnapshot('"Hello world!"')
  })
  test('should keep explicit escaped characters', () => {
    const sut = prepareMessage
    const message = `Hello \\n
    world!`

    const output = sut(message)

    expect(output).toMatchInlineSnapshot(`
      "Hello 
      world!"
    `)
  })
})
