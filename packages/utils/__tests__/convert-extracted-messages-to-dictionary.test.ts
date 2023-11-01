import { describe, expect, test } from 'vitest'
import { convertExtractedMessagesToDictionary } from '../src'
import type { ExtractedMessages } from '@koi18n/types'

describe('convertExtractedMessagesToDictionary', () => {
  test('should convert extracted messages to dictionary', () => {
    const sut = convertExtractedMessagesToDictionary
    const extractedMessages: ExtractedMessages = {
      a: {
        id: 'a',
        value: 'test',
        context: '',
        files: [],
        chunksIds: []
      }
    }

    const output = sut(extractedMessages)

    expect(output).toMatchInlineSnapshot(`
      {
        "a": "test",
      }
    `)
  })
})
