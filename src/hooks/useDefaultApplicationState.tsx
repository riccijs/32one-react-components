import { useState, useEffect, useCallback } from 'react'
import { cookies } from '../utils'
import useClient from './useClient'
import {
  AlertType,
  AlertDefaultObject,
  AlertVariants,
} from '../components'

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000

export type UserRoles = Array<'guest' | 'user' | 'admin' | 'superadmin'>

export const defaultAppContext = {
  hasClientId: false,
  userProfile: void 0,
  userRoles: ['guest'],
  setUserProfile: () => {},
  alert: new AlertDefaultObject(),
  setAlert: () => {},
  handleAuthFailure: () => {},
  handleAuthSuccess: () => {},
}

export default function useDefaultApplicationState(clientName: string, muiTheme: any, initialThemeType?: 'light' | 'dark') {
  const defaultThemeType: any = cookies.get('themeType') || initialThemeType || 'light'
  const defaultUserProfile: any = cookies.get('userProfile')
  const [themeType, setThemeType] = useState<'light' | 'dark'>(defaultThemeType)
  const [hasClientId, setHasClientId] = useState<boolean>(false)
  const [userProfile, setUserProfile] = useState<any>(defaultUserProfile ? JSON.parse(defaultUserProfile) : void 0)
  const [alert, setAlert] = useState<AlertType>(new AlertDefaultObject())
  const { setClientId } = useClient()
  const themeOptions = muiTheme(themeType)
  const userRoles: UserRoles = userProfile ? [...userProfile.roles] : ['guest']

  const onToggleTheme = (event: React.MouseEvent<HTMLElement>, themeType: 'light' | 'dark') => {
    cookies.set('themeType', themeType, ONE_YEAR)
    setThemeType(themeType)
  }

  const handleAuthSuccess = () => {
    const userProfileFromCookie = cookies.get('userProfile')
    if (userProfileFromCookie !== userProfile) {
      setUserProfile(JSON.parse(userProfileFromCookie))
    }
  }  

  const handleAuthFailure = () => {
    setUserProfile(void 0)
  }

  const handleAlert = useCallback((variant: AlertVariants) => (alert: string): any => {
    setAlert(previousAlert => {
      previousAlert[variant].push(alert)
      return {...previousAlert}
    })
  }, [])

  const alertFunctions: any = {
    error: handleAlert('error'),
    success: handleAlert('success'),
    warning: handleAlert('warning'),
    info: handleAlert('info'),
  }

  const provider: any = {
    hasClientId,
    userProfile,
    userRoles,
    setUserProfile,
    handleAuthFailure,
    handleAuthSuccess,
    alert: alertFunctions
  }

  useEffect(() => {
    if (!hasClientId) {
      setClientId(clientName).then(() => setHasClientId(true))
    }
  }, [hasClientId, setClientId, clientName])

  return {
    provider,
    alert,
    setAlert,
    themeOptions,
    hasClientId,
    userRoles,
    themeType,
    onToggleTheme,
  }
}