import { setupRosetta } from '@rosetta.js/react'

export const { tx } = setupRosetta({
  locale: 'es',
  dictionaries: {
    en: () => import('../../../../locale/en.js'),
    es: () => import('../../../../locale/es.js')
  }
})
