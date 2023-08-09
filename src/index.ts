import { Configuration, OpenAIApi } from 'openai'

export class Rosseta {
  private readonly library: Map<string, Node>
  private readonly apiKey: string
  private readonly openai: OpenAIApi

  constructor({ apiKey }: { apiKey: string }) {
    this.library = new Map()
    this.openai = new OpenAIApi(
      new Configuration({
        apiKey
      })
    )
  }

  public init() {
    this.setListeners()
    this.getLibraryNodes()
    this.translateNodes()
  }

  private setListeners() {
    window.addEventListener('popstate', () => {
      this.getLibraryNodes()
      this.translateNodes()
    })
  }

  private getLibraryNodes() {
    const domElements = document.querySelectorAll(
      '*:not(script):not(style):not(head):not(body):not(title)'
    )

    domElements.forEach(element => {
      if (element?.childNodes?.[0]?.nodeType === Node.TEXT_NODE) {
        const text = element.textContent.trim()

        this.library.set(text, element)
      }
    })
  }

  private translateNodes() {
    this.library.forEach(async (node, key) => {
      node.textContent = await this.translate(key)
    })
  }

  private async translate(text: string) {
    const response = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You will be provided with a sentence in English, and your task is to translate it into Spanish. Use a funny approach'
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    })

    return response.data.choices[0].message.content
  }
}
