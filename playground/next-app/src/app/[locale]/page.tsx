import Link from 'next/link'

export default async function Home() {
  return (
    <div>
      <h1>Next.js demo</h1>
      <div>
        <Link href={'/es/server'}>{'Server'}</Link>
        <Link href={'/en/client'}>{'Client Page'}</Link>
        <Link href={'/es/legend'}>{'Legend Page'}</Link>
      </div>
    </div>
  )
}
