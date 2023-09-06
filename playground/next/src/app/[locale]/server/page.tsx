import { tx } from '../reword'

export default async function Home() {
  const name = 'Hugo'

  return (
    <div>
      <p>{tx`Hello, ${name}!`}</p>
      <p>{tx`You haven't checked you email since ${new Date()}`}</p>
      <p>{tx`You got ${10000} messages in your mail inbox`}</p>
    </div>
  )
}
