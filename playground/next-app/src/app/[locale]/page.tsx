import Link from 'next/link'

export default async function Home() {
  return (
    <div>
      <h1>Next.js demo</h1>
      <div>
        <Link href={'/en/server'}>{'Server in English'}</Link>
        <Link href={'/en/client'}>{'Client in English'}</Link>
      </div>
      <div>
        <Link href={'/es/server'}>{'Server in Spanish'}</Link>
        <Link href={'/es/client'}>{'Client in Spanish'}</Link>
      </div>

      <div>
        <Link prefetch={false} href={'/es/'}>
          {'es'}
        </Link>
        <Link prefetch={false} href={'/en/'}>
          {'en'}
        </Link>
      </div>
    </div>
  )
}
