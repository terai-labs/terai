export function mapToJson(map: Map<any, any>): string {
  const jsonObject: { [key: string]: any } = {}

  map.forEach((value, key) => {
    jsonObject[key.toString()] = value
  })

  return JSON.stringify(jsonObject)
}
