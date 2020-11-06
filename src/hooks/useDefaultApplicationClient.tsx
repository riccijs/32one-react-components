import { useCallback } from 'react'
import Axios from 'axios'

export default function useDefaultApplicationClient(protocol: 'http' | 'https', hostname: string) {
  const getClientName = useCallback(async () => {
    return await Axios.get(`${protocol}://${hostname}/api/v1/client/name`)
  }, [])

  const setClientId = useCallback(async (clientName: string) => {
    return await Axios({
      url: `${protocol}://${hostname}/api/v1/client/id/${clientName}`,
      method: 'GET',
      withCredentials: true,
    })
  }, [])

  return {
    getClientName,
    setClientId,
  }
}