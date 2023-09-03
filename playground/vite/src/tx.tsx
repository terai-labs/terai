import { useState } from 'react'

export function tx(strings: TemplateStringsArray, ...values: any[]) {
  const [state, setState] = useState(0)

  return (
    <div onClick={() => setState(prev => prev + 1)}>
      <Example count={state} />
    </div>
  )
}

function Example({ count }) {
  return <>{count}</>
}
