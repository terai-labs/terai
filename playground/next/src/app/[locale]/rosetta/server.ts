import { setupServer } from '@rewordlabs/next'

export const { getTx } = setupServer({
  dictionaries: {
    en: () => import('../../../../locale/en.js'),
    es: () => import('../../../../locale/es.js')
  }
})
