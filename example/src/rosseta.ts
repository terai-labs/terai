import { Rosseta } from '@hcorta/rosseta'

export const rosseta = new Rosseta({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
  language: 'english'
})
