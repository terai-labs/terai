import { setupSSRRosetta } from '@rosetta.js/react'

export const { tx } = setupSSRRosetta({
  locale: 'en',
  messages: {
    en: () => import('../../locale/en.js'),
    es: () => import('../../locale/es.js')
  }
})
