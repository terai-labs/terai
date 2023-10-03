import type { Dictionary } from '@rewordlabs/types'
import type { QueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

export const createUseDictionary =
  (queryClient: QueryClient) =>
  ({
    queryFn,
    queryKey
  }: {
    queryFn: () => Promise<Dictionary>
    queryKey: string[]
  }) => {
    const [state, setState] = useState<Dictionary | undefined>(() => {
      return queryClient.getQueryData(queryKey)
    })

    useEffect(() => {
      async function fetchData() {
        const data = await queryClient.fetchQuery({ queryKey, queryFn })
        setState(data)
      }

      fetchData()
    }, [])

    return state
  }
