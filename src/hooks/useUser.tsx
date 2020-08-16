import { useCallback } from 'react'
import Axios from 'axios'
import { SignUpUser } from '../pages/SignUp'

export interface SendEmailOptions {
  title: string
  template: string
}

export default function useUser() {
  const checkIfUsernameOrEmailAddressExists = async (usernameOrEmail: string, isGlobalCheck?: boolean) => {
    const isEmailAddress = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,12})+$/.test(usernameOrEmail)
    const data = isEmailAddress ? { emailAddress: usernameOrEmail } : { username: usernameOrEmail }
    return await Axios.post('/api/user/exists', { ...data, isGlobalCheck })
  }

  const signIn = useCallback(async (password: string) => {
    return await Axios.post('/api/user/sign-in', { password })
  }, [])

  const sendEmail = useCallback(async (options: SendEmailOptions) => {
    return await Axios.post('/api/client/email-delivery/send', options)
  }, [])

  const verifyContactInformation = useCallback(async (searchStr: string) => {
    return await Axios.post(`/api/user/contact-information/verify${searchStr}`)
  }, [])

  const resetPassword = useCallback(async (searchStr: string, password: string) => {
    return await Axios.post(`/api/user/reset-password${searchStr}`, { password })
  }, [])

  const checkPreviousRegistration = useCallback(async (emailAddress: string) => {
    return await Axios.get(`/api/user/check-registration/${emailAddress}`)
  }, [])

  const checkUsernameAvailability = useCallback(async (username) => {
    return await checkIfUsernameOrEmailAddressExists(username, true)
  }, [])

  const register = useCallback(async (user: SignUpUser) => {
    return await Axios.post('/api/user/add', user)
  }, [])

  const registerClient = useCallback(async () => {
    return await Axios.post('/api/user/add-client')
  }, [])

  return {
    checkIfUsernameOrEmailAddressExists,
    signIn,
    sendEmail,
    verifyContactInformation,
    resetPassword,
    checkPreviousRegistration,
    checkUsernameAvailability,
    register,
    registerClient,
  }
}