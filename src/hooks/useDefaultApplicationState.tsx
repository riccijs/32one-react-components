import { useState, useEffect, useCallback } from 'react'
import { cookies } from '../utils'
import useDefaultApplicationClient from './useDefaultApplicationClient'
import {
  AlertType,
  AlertDefaultObject,
  AlertVariants,
} from '../components'

export interface AppProvider {
  hasClientId: boolean
  userProfile: any
  userGroups: string[]
  setUserProfile: (userProfile: any) => void
  handleAuthFailure: () => void
  handleAuthSuccess: () => void
  alert: {
    error: (error: string) => void
    warning: (warning: string) => void
    success: (success: string) => void
    info: (info: string) => void
  }
}

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000

export const defaultAppContext = {
  hasClientId: false,
  userProfile: void 0,
  userGroups: ['guest'],
  setUserProfile: () => {},
  alert: new AlertDefaultObject(),
  setAlert: () => {},
  handleAuthFailure: () => {},
  handleAuthSuccess: () => {},
}

export default function useDefaultApplicationState(clientName: string, muiTheme: any, initialThemeType?: 'light' | 'dark', customDarkTheme?: any, customDarkThemeBackgroundColor?: string) {
  const defaultThemeType: any = cookies.get('themeType') || initialThemeType || 'light'
  const defaultUserProfile: any = cookies.get('userProfile')
  const [themeType, setThemeType] = useState<'light' | 'dark'>(defaultThemeType)
  const [hasClientId, setHasClientId] = useState<boolean>(false)
  const [userProfile, setUserProfile] = useState<any>(defaultUserProfile ? JSON.parse(defaultUserProfile) : void 0)
  const [alert, setAlert] = useState<AlertType>(new AlertDefaultObject())
  const { setClientId } = useDefaultApplicationClient()
  const themeOptions = themeType === 'dark' && !!customDarkTheme ? customDarkTheme(customDarkThemeBackgroundColor) : muiTheme(themeType)
  const userGroups = userProfile ? [...userProfile.groups] : ['guest']

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

  const error = useCallback(handleAlert('error'), [handleAlert])
  const success = useCallback(handleAlert('success'), [handleAlert])
  const warning = useCallback(handleAlert('warning'), [handleAlert])
  const info = useCallback(handleAlert('info'), [handleAlert])

  const alertFunctions = {
    error,
    success,
    warning,
    info,
  }

  const provider: AppProvider = {
    hasClientId,
    userProfile,
    userGroups,
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
    userGroups,
    themeType,
    onToggleTheme,
  }
}