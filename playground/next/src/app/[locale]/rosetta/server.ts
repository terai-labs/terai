import { setupServer } from '@rosetta.js/next'

export const { getTx } = setupServer({
  dictionaries: {
    en: () => import('../../../../locale/en.js'),
    es: () => import('../../../../locale/es.js')
  }
})
