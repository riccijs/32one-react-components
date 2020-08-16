import { useEffect, useCallback, useRef } from 'react'
import Axios from 'axios'
import { useLocation } from 'react-router-dom'

export default function useSession(sessionVerificationEndpoint: string, onAuthSuccess?: Function, onAuthFailure?: Function) {
  const refPathname = useRef('')
  const { pathname } = useLocation()

  const verifySession = useCallback(async () => {
    try {
      await Axios.get(sessionVerificationEndpoint)
      if (!!onAuthSuccess) onAuthSuccess()
    }
    catch (err) {
      if (!!onAuthFailure) onAuthFailure()
    }
  }, [sessionVerificationEndpoint, onAuthSuccess, onAuthFailure])

  useEffect(() => {
    if (pathname !== refPathname.current) {
      refPathname.current = pathname
      verifySession()
    }
  }, [verifySession, pathname])

}