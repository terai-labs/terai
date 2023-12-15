import { describe, expect, test } from 'vitest'
import { createTs } from '../src'

describe('createTs', () => {
  test('should create a ts function', () => {
    const sut = createTs
    const ts = sut<string, {}>(props => props.id)

    expect(ts).toBeInstanceOf(Function)
  })
  test('should create a ts function that correctly format the message', () => {
    const sut = createTs
    const ts = sut<string, {}>(props => JSON.stringify(props))

    const output1 = ts`Hello world!`
    const output2 = ts`Hello ${'world'}!`
    const output3 = ts`Hello
     world!`

    expect(output1).toMatchInlineSnapshot(
      `"{"id":"dQxGBP","rawMessage":"Hello world!","variables":[]}"`
    )
    expect(output2).toMatchInlineSnapshot(
      `"{"id":"gOngMQ","rawMessage":"Hello \${var}!","variables":["world"]}"`
    )
    expect(output3).toMatchInlineSnapshot(
      `"{"id":"dQxGBP","rawMessage":"Hello world!","variables":[]}"`
    )
  })
  test('should create a ts function that admits arguments', () => {
    const sut = createTs
    const ts = sut<string, {}>(props => JSON.stringify(props))

    const output = ts({ context: 'test' })`Hello world!`

    expect(output).toMatchInlineSnapshot(
      `"{"context":"test","id":"dQxGBP","rawMessage":"Hello world!","variables":[]}"`
    )
  })
})
