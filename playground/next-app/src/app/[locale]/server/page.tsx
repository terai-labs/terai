import Link from 'next/link'
import { tx } from '@locale/server'

export default async function Home() {
  const name = 'Hugo'

  return (
    <div>
      <p>{tx`Hello, ${name}!`}</p>
      <p>{tx`You haven't checked you email since ${new Date()}`}</p>
      <p>{tx`You got ${10000} messages in your mail inbox`}</p>

      <Link href={'/'}>To Home</Link>
    </div>
  )
}
