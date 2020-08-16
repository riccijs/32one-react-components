import { useCallback } from 'react'
import Axios from 'axios'

export default function useClient() {
  const getClientName = useCallback(async () => {
    return await Axios.get('/api/client/name')
  }, [])

  const setClientId = useCallback(async (clientName: string) => {
    return await Axios.get(`/api/client/id/${clientName}`)
  }, [])

  return {
    getClientName,
    setClientId,
  }
}