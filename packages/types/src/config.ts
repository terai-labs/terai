import type { Locale } from './locale'
import type { Translator } from './translator'

export type Config = {
  include: string[]
  exclude?: string[]
  projectLocale: Locale
  outDir: string
  locales: Locale[]
  context?: string
  translator: Translator
}

// export type ConfigOptionsChatGpt = {
//   translationService: 'OpenAI ChatGPT'
//   openaiApiKey: string
// }

// export type ConfigOptionsGoogleCloud = {
//   translationService: 'Google Cloud'
//   googleCloudCrendentials: {
//     projectId: string
//     credentials: {
//       type: string
//       private_key: string
//       client_email: string
//       client_id: string
//     }
//   }
// }
