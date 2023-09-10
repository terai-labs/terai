import Link from 'next/link'

export default async function Home() {
  return (
    <div>
      <h1>Next.js demo</h1>
      <div>
        <Link href={'/server'}>{'Server Page'}</Link>
        <Link href={'/client'}>{'Client Page'}</Link>
      </div>
    </div>
  )
}
