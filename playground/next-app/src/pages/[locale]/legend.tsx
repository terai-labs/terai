import { observable } from '@legendapp/state'
import { useSelector } from '@legendapp/state/react'

const state = observable({ selected: 1, theme: {} })

export default function Legend() {
  return <Component />
}

function Component() {
  // Only re-renders if the return value changes
  const isSelected = useSelector(() => state.selected.get())

  // Get the raw value of an observable and listen to it
  const theme = useSelector(state.theme)

  return <p>{isSelected}</p>
}
