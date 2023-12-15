import type { Dictionaries } from '@terai/types'
import { generate } from '../src'
import { afterAll, describe, expect, test } from 'vitest'
import { runtime } from '@terai/runtime'

const locale = 'en'
const basePath = __dirname
const outDir = __dirname

describe('generate', () => {
  afterAll(() => {
    runtime.fs.remove(runtime.path.join(outDir, locale))
  })
  test('should generate dictionaries', async () => {
    const sut = generate
    const dictionaries: Dictionaries = {
      dictionary1: {
        test1: 'value1'
      },
      dictionary2: {
        test2: 'value2'
      }
    }

    const output = await sut({
      dictionaries,
      locale,
      cwd: basePath,
      outDir: outDir
    })
    const existsLocaleFolder = runtime.fs.exists(
      runtime.path.join(outDir, locale)
    )
    const existsDictionary1File = runtime.fs.exists(
      runtime.path.join(outDir, locale, 'dictionary1.json')
    )
    const existsDictionary2File = runtime.fs.exists(
      runtime.path.join(outDir, locale, 'dictionary2.json')
    )

    expect(existsLocaleFolder).toBe(true)
    expect(existsDictionary1File).toBe(true)
    expect(existsDictionary2File).toBe(true)
    expect(output).toMatchInlineSnapshot(`
      [
        "{
        \\"test1\\": \\"value1\\"
      }",
        "{
        \\"test2\\": \\"value2\\"
      }",
      ]
    `)
  })
})
