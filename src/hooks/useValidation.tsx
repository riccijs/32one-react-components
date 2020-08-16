import { validation } from '../utils'
import { useState, useEffect } from 'react'
import useUser from './useUser'

export interface Validate {
  emailAddress?: string
  username?: string
  password?: string
}

export default function useValidation(validate: Validate) {
  const [usernameAvailable, setUsernameAvailable] = useState<string>('')
  const { checkUsernameAvailability } = useUser()
  
  const emailAddress = !!validate.emailAddress && !validation.emailAddress(validate.emailAddress) 
    ? 'Enter a valid email address'
    : ''
  const username = !!validate.username && !validation.minLength(validate.username, 3)
    ? 'Username must contain a minimum of 3 characters'
    : ''
  const password = !!validate.password ? validation.password(validate.password) : ''

  useEffect(() => {
    if (validate.username?.length || 0 >= 3) {
      checkUsernameAvailability(validate.username)
        .then(() => setUsernameAvailable('Username is already taken'))
        .catch(() => setUsernameAvailable(''))
    }
  }, [username, validate.username, checkUsernameAvailability])

  return {
    emailAddress,
    username: username || usernameAvailable,
    password,
  }
}