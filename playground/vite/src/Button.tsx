import { tx } from '../locale/client'

export function Button() {
  return (
    <div>
      <p>{tx`Hello, again!`}</p>
      <p>{tx`Wait this is another file!`}</p>
    </div>
  )
}
