import { useCallback } from 'react'
import Axios from 'axios'

export default function useDefaultApplicationClient() {
  const getClientName = useCallback(async () => {
    return await Axios.get('https://32one.live/api/v1/client/name')
  }, [])

  const setClientId = useCallback(async (clientName: string) => {
    return await Axios({
      url: `https://32one.live/api/v1/client/id/${clientName}`,
      method: 'GET',
      withCredentials: true,
    })
  }, [])

  return {
    getClientName,
    setClientId,
  }
}