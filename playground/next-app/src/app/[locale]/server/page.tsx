// import { Link } from '@terai/next/client'
// const { Link } = require('@terai/next/client')
import { getTs } from '@terai/next'
import Link from 'next/link'

export default async function Home() {
  const { ts } = await getTs({ chunkId: 'server' })
  const name = 'Hugo'
  const a = ts`Hello, ${name}!`

  return (
    <div>
      <p>{a}</p>
      <p>{ts`This is a server message!`}</p>
      <p>{ts`You haven't checked you email since ${new Date()}`}</p>
      <p>{ts`You got ${10000} messages in your mail inbox`}</p>

      <Link href={'/'}>To Home</Link>
    </div>
  )
}
