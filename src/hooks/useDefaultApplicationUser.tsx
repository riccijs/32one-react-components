import { useCallback } from 'react'
import Axios from 'axios'
import { SignUpUser } from '../pages/SignUp'

export interface SendEmailOptions {
  title: string
  template: string
}

export default function useDefaultApplicationUser() {
  const checkIfUsernameOrEmailAddressExists = async (usernameOrEmail: string, isGlobalCheck?: boolean) => {
    const isEmailAddress = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,12})+$/.test(usernameOrEmail)
    const data = isEmailAddress ? { emailAddress: usernameOrEmail } : { username: usernameOrEmail }
    return await Axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOSTNAME}/api/v1/user/exists`, 
      data: { ...data, isGlobalCheck },
      withCredentials: true,
    })
  }

  const signIn = useCallback(async (password: string) => {
    return await Axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOSTNAME}/api/v1/user/sign-in`, 
      data: { password },
      withCredentials: true,
    })
  }, [])

  const sendEmail = useCallback(async (options: SendEmailOptions) => {
    return await Axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOSTNAME}/api/v1/client/email-delivery/send`, 
      data: options,
      withCredentials: true,
    })
  }, [])

  const verifyContactInformation = useCallback(async (searchStr: string) => {
    return await Axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOSTNAME}/api/v1/user/contact-information/verify${searchStr}`, 
      withCredentials: true,
    })
  }, [])

  const resetPassword = useCallback(async (searchStr: string, password: string) => {
    return await Axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOSTNAME}/api/v1/user/reset-password${searchStr}`, 
      data: { password },
      withCredentials: true,
    })
  }, [])

  const checkPreviousRegistration = useCallback(async (emailAddress: string) => {
    return await Axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOSTNAME}/api/v1/user/check-registration/${emailAddress}`, 
      withCredentials: true,
    })
  }, [])

  const checkUsernameAvailability = useCallback(async (username) => {
    return await checkIfUsernameOrEmailAddressExists(username, true)
  }, [])

  const register = useCallback(async (user: SignUpUser) => {
    return await Axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOSTNAME}/api/v1/user/add`, 
      data: user,
      withCredentials: true,
    })
  }, [])

  const registerClient = useCallback(async () => {
    return await Axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOSTNAME}/api/v1/user/add-client`, 
      withCredentials: true,
    })
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