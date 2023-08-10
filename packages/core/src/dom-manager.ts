export type NodesCollection = Map<
  string,
  {
    node: Node
    value: string
  }
>

export class DomManager {
  private nodesCollection: NodesCollection
  private rootNode: HTMLBodyElement
  private observer: MutationObserver

  constructor() {
    this.nodesCollection = new Map()
    this.rootNode = null
    this.observer = null
  }

  public start() {
    this.setRootNode()
    this.startObserver()
    this.setNodes()
  }

  public getNodes() {
    return this.nodesCollection
  }

  private startObserver() {
    this.observer = new MutationObserver(this.onDomChange)

    this.observer.observe(this.rootNode, {
      childList: true, // Observe direct children being added/removed
      subtree: true, // Observe all descendants, not just direct children
      attributes: true, // Observe attribute changes
      characterData: true // Observe text content changes within elements
    })
  }

  private setRootNode() {
    const body = document.querySelector('body')

    this.rootNode = body
  }

  private onDomChange = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        console.log('A child node has been added or removed.')
      } else if (mutation.type === 'attributes') {
        console.log('An attribute was modified.')
      } else if (mutation.type === 'characterData') {
        console.log('Text content within an element has changed.')
      }
    }
  }

  private async setNodes(node: Node = this.rootNode): Promise<void> {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent
      const id = await this.getId(text)

      if (Boolean(id)) {
        if (this.nodesCollection.has(id)) return

        this.nodesCollection.set(id, { node, value: text })
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (const childNode of Array.from(node.childNodes)) {
        this.setNodes(childNode)
      }
    }
  }

  private async getId(input: string) {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)

    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')

    return hashHex
  }
}
