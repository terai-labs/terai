import { Configuration, OpenAIApi } from 'openai'
import { NodesCollection } from 'src/dom-manager'

export class Dictionary {
  private readonly library: Map<string, Record<string, string>>
  private readonly openai: OpenAIApi

  constructor({ apiKey }: { apiKey: string }) {
    this.library = this.getFromStorage()
    this.openai = new OpenAIApi(
      new Configuration({
        apiKey
      })
    )
  }

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

  public translateNodes({
    nodes,
    locale
  }: {
    nodes: NodesCollection
    locale: string
  }) {
    nodes.forEach(async (nodeEl, id) => {
      const value = this.library.get(id)?.[locale]

      if (value) {
        nodeEl.node.textContent = value
      } else {
        const value = await this.getNodeTranslation(id, nodeEl.value, locale)

        nodeEl.node.textContent = value
      }
    })
  }

  private async getNodeTranslation(id: string, text: string, locale: string) {
    const translation = await this.getAiTranslation(
      JSON.stringify({ [id]: text }),
      locale
    )

    const parsedTranslation = JSON.parse(translation)
    const value = parsedTranslation[id]

    const lang = this.library.get(id)
    if (!lang) {
      this.library.set(id, { [locale]: value })
    } else {
      lang[locale] = value
      this.library.set(id, lang)
    }

    this.saveToStorage()
    return value
  }

  private async getAiTranslation(json: string, locale: string) {
    const response = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      // model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `
          You will translate JSONs that I will pass to you into ${locale}.
          Do not translate the keys of the json.
          Keep white spaces and new lines.
          `
        },
        {
          role: 'user',
          content: json
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
