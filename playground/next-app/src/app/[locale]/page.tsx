import Link from 'next/link'

export default async function Home() {
  return (
    <div>
      <h1>Next.js demo</h1>
      <div>
        <Link href={'/server'}>{'Server Page'}</Link>
        <Link href={'/client'}>{'Client Page'}</Link>
      </div>

      <div>
        <Link locale={'es'} href={'es'}>
          {'Spanish'}
        </Link>
        <Link locale={'en'} href={'en'}>
          {'English'}
        </Link>
      </div>
    </div>
  )
}
