import type { Config } from '@terai/types'

export function defineConfig(config: Config) {
  return config
}

export {
  createChatGptTranslator,
  createGoogleCloudTranslator
} from '@terai/translator/translators'
