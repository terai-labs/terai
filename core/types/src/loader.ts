export type Loader = (
  locale: string,
  chunkId: string,
  id: string
) => Promise<string>
