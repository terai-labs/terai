import { useTs, setLocale } from '@terai/react'

export default function App() {
  const { ts } = useTs()

  return (
    <div>
      <button onClick={() => setLocale('es')}>es</button>
      <button onClick={() => setLocale('en')}>en</button>
      <button onClick={() => setLocale('it')}>it</button>
      <p>{ts`From the endless list of translation libraries, why should you choose Terai?`}</p>
    </div>
  )
}
