export interface ExtractedMessage {
  id: string
  description?: string | object
  defaultMessage?: string
  file?: string
  start?: number
  end?: number
  line?: number
  col?: number
}
