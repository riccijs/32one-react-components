import { useCallback } from 'react'
import Axios from 'axios'

export default function useDefaultApplicationClient() {
  const getClientName = useCallback(async () => {
    return await Axios({
      url: `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOSTNAME}/api/v1/client/name`,
      method: 'GET',
      withCredentials: true,
    })
  }, [])

  const setClientId = useCallback(async (clientName: string) => {
    return await Axios({
      url: `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOSTNAME}/api/v1/client/id/${clientName}`,
      method: 'GET',
      withCredentials: true,
    })
  }, [])

  return {
    getClientName,
    setClientId,
  }
}