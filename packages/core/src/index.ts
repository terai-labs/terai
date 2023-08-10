import { Configuration, OpenAIApi } from 'openai'

export class Rosseta {
  private readonly nodes: Map<string, Node>
  private readonly library: Map<string, Record<string, string>>
  private readonly openai: OpenAIApi
  private readonly baseLanguage: string
  private language: string

  constructor({
    apiKey,
    language = 'spanish',
    baseLanguage = 'english'
  }: {
    apiKey: string
    language?: string
    baseLanguage?: string
  }) {
    this.baseLanguage = baseLanguage
    this.language = language
    this.library = this.getFromStorage()
    this.nodes = new Map()
    this.openai = new OpenAIApi(
      new Configuration({
        apiKey
      })
    )
  }

  public init() {
    this.getNodes()
    this.translateNodes()
  }

  public changeLanguage(language: string) {
    this.language = language

    this.translateNodes()
  }

  // private setListeners() {
  //   window.addEventListener('popstate', () => {
  //     this.getNodes()
  //     this.translateNodes()
  //   })
  // }

  private saveToStorage(): void {
    const serializedMap = JSON.stringify([...this.library])
    localStorage.setItem('ROSETTA_LIB', serializedMap)
  }

  private getFromStorage(): Map<string, Record<string, string>> {
    const serializedMap = localStorage.getItem('ROSETTA_LIB')

    if (serializedMap) {
      const mapArray = JSON.parse(serializedMap)
      return new Map<string, Record<string, string>>(mapArray)
    }

    return new Map()
  }

  private sanitizeText(text: string) {
    return text.replaceAll('\n', '').replaceAll(' ', '')
  }

  private getNodes(node: Node = document.body): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent
      const sanitizedText = this.sanitizeText(text)

      if (Boolean(sanitizedText)) {
        if (this.nodes.has(sanitizedText)) return

        this.nodes.set(sanitizedText, node)

        if (!this.library.has(sanitizedText)) {
          this.library.set(sanitizedText, {
            [this.baseLanguage]: text
          })
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (const childNode of Array.from(node.childNodes)) {
        this.getNodes(childNode)
      }
    }
  }

  private translateNodes() {
    this.nodes.forEach(async (node, key) => {
      node.textContent =
        this.library.get(key)[this.language] ||
        (await this.getNodeTranslation(
          key,
          this.library.get(key)[this.baseLanguage]
        ))
    })
  }

  private async getNodeTranslation(key: string, text: string) {
    const translation = await this.getAiTranslation(
      JSON.stringify({ [key]: text })
    )

    const parsedTranslation = JSON.parse(translation)
    const value = parsedTranslation[key]

    const lang = this.library.get(key)
    lang[this.language] = value
    this.library.set(key, lang)

    this.saveToStorage()
    return value
  }

  private async getAiTranslation(text: string) {
    const response = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      // model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `
          You will translate JSONs that I will pass to you in ${this.baseLanguage} into ${this.language}.
          Do not translate the keys of the json.
          Keep white spaces and new lines.
          `
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.4,
      max_tokens: 256,
      frequency_penalty: -2.0,
      presence_penalty: -2.0
    })

    return response.data.choices[0].message.content
  }
}
