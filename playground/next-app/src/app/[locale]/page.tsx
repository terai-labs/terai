import Link from 'next/link'

export default async function Home() {
  return (
    <div>
      <h1>Next.js demo</h1>
      <div>
        <Link href={'/server'}>{'Server'}</Link>
        <Link href={'/client'}>{'Client Page'}</Link>
      </div>

      <div>
        <Link prefetch={false} href={'/es'}>
          {'es'}
        </Link>
        <Link prefetch={false} href={'/en'}>
          {'en'}
        </Link>
      </div>
    </div>
  )
}
