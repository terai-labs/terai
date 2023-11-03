import { createTs } from '@koi18n/ts'
import { tsRender } from '../ts-render'
import { getLocale } from './get-locale'
import { setup$ } from './setup'

type GetTsProps = {
  chunkId?: string
}

export const getTs = async ({ chunkId }: GetTsProps = {}) => {
  const locale = getLocale()
  const setup = setup$.get()
  console.log('getTs: setup', setup)
  const dictionary = await setup?.loader(locale, chunkId ?? locale)
  const ts = createTs<string, {}>(props =>
    tsRender({
      ...props,
      locale,
      dictionary,
      format: {
        // ...format,
        ...props.format
      }
    })
  )

  return {
    ts
  }
}
