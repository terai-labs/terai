import { tx } from './reword'

export default function Home() {
  const name = 'Hugo'

  return (
    <div>
      <p>{tx`Hello, ${name}!`}</p>
    </div>
  )
}
