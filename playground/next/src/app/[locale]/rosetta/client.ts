import { setupReword } from '@rewordlabs/react'

export const { tx } = setupReword({
  locale: 'es',
  dictionaries: {
    en: () => import('../../../../locale/en.js'),
    es: () => import('../../../../locale/es.js')
  }
})
