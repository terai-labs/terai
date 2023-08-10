import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { rosseta } from './rosseta'

function App() {
  const [count, setCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    rosseta.init()
  }, [])

  return (
    <>
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => setIsOpen(!isOpen)}>Open new component</button>
        {isOpen && (
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae
            ad, eos odit tempora placeat consequatur hic, doloremque modi
            assumenda esse sapiente sit maxime quo natus quaerat rem a illum
            ipsam?
          </p>
        )}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>

      <button onClick={() => rosseta.changeLanguage('french')}>
        Switch to fr
      </button>
      <button onClick={() => rosseta.changeLanguage('english')}>
        Switch to en
      </button>
      <button onClick={() => rosseta.changeLanguage('portuguese')}>
        Switch to pt
      </button>
    </>
  )
}

export default App
