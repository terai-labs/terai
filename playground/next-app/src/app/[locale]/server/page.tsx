// import { Link } from '@koi18n/next/client'
const { Link } = require('@koi18n/next/client')
import { getTs } from '@/locale/server'

export default async function Home() {
  const ts = await getTs({ chunkId: 'server' })
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
