// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState } from 'react'
import { RosettaProvider } from '@rosetta.js/react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <RosettaProvider
      locale='es'
      locales={{
        es: () => import('./locale/es.ts')
      }}
    >
      <div>
        <a
          defaultMessage={'This is my name'}
          href='https://vitejs.dev'
          target='_blank'
        >
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a
          defaultMessage={'Another message yohoo!'}
          href='https://react.dev'
          target='_blank'
        >
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1 defaultMessage={'This is my name'}>Vite + React</h1>
      <div className='card'>
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </RosettaProvider>
  )
}

export default App
