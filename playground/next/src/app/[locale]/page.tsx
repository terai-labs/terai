import { getTx } from './rosetta/server'

export default async function Home() {
  const name = 'Hugo'
  const tx = await getTx()

  return (
    <div>
      <p>{tx`Hello, !${name}!`}</p>
      <p>{tx`You haven't checked you email since @${new Date()}`}</p>
      <p>{tx`You got #${10000} messages in your mail inbox`}</p>
    </div>
  )
}
