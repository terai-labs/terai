import { Configuration, OpenAIApi } from 'openai'
import { DomManager } from './dom-manager'
import { Dictionary } from './dictionary'

export class Rosseta {
  private dictionary: Dictionary
  private domManager: DomManager
  private locale: string
  private readonly baseLanguage: string
  private readonly library: Map<string, Record<string, string>>
  private readonly openai: OpenAIApi

  constructor({
    apiKey,
    locale = 'spanish',
    baseLanguage = 'english'
  }: {
    apiKey: string
    locale?: string
    baseLanguage?: string
  }) {
    this.domManager = new DomManager()
    this.dictionary = new Dictionary({ apiKey })
    this.baseLanguage = baseLanguage
    this.locale = locale
    this.openai = new OpenAIApi(
      new Configuration({
        apiKey
      })
    )
  }

  public init() {
    this.domManager.start()
    const nodes = this.domManager.getNodes()
    this.dictionary.translateNodes({ nodes, locale: this.locale })
  }

  public changeLanguage(locale: string) {
    this.locale = locale
    const nodes = this.domManager.getNodes()
    this.dictionary.translateNodes({ nodes, locale: this.locale })
  }
}
