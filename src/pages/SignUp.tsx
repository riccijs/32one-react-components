import React, { FC, ReactElement, useState, ChangeEvent, useEffect, FormEvent, Fragment, useCallback } from 'react'
import { Card, CardHeader, CardContent, TextField, Slide, Button, CardActions, Link } from '@material-ui/core'
import { format } from '../utils'
import useUser from '../hooks/useUser'
import CircularLoader from '../components/CircularLoader'
import useClient from '../hooks/useClient'
import { useHistory } from 'react-router-dom'
import useValidation from '../hooks/useValidation'

export interface SignUpProps {
  onError: any
  onSuccess: any
  onSuccessSignIn: any
  onInfo: any
  postSignInUrl: string
}

export interface SignUpUser {
  firstName: string
  lastName: string
  username: string
  emailAddress: string
  password: string
}

type Steps = 'check-email' | 'user-exists' | 'gather-info' | 'already-registered' | 'need-verification'

class User {
  firstName = ''
  lastName = ''
  username = ''
  emailAddress = ''
  password = ''
}

const ALPHA_NUMERIC_FIELDS = [
  'firstName',
  'lastName',
  'username',
]

const SignUp: FC<SignUpProps> = ({
  onError,
  onSuccess,
  onSuccessSignIn,
  onInfo,
  postSignInUrl,
}): ReactElement => {
  const [user, setUser] = useState<SignUpUser>(new User())
  const [step, setStep] = useState<Steps>('check-email')
  const [previousClient, setPreviousClient] = useState<string>('')
  const [currentClient, setCurrentClient] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { firstName, lastName, username, emailAddress, password } = user
  const { getClientName } = useClient()
  const { checkIfUsernameOrEmailAddressExists, checkPreviousRegistration, signIn, register, registerClient } = useUser()
  const handleError = useCallback(onError, [])
  const history = useHistory()
  const error = useValidation(user)

  const handleTextField = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    const isAlphaNumericField = ALPHA_NUMERIC_FIELDS.includes('name')
    const update = isAlphaNumericField 
      ? format.alphaNumeric(format.maxChars(value, 25)) 
      : value
    setUser(previousUser => {
      const updatedUser: SignUpUser = {
        ...previousUser,
        [name]: update.trim()
      }
      return updatedUser
    })
  }

  const handleCurrentClientName = useCallback(async () => {
    try {
      const { data: clientName } = await getClientName()
      setCurrentClient(clientName)
    }
    catch ({ response: { data }}) {
      handleError(data)
    }
    finally {
      setIsLoading(false)
    }
  }, [getClientName, handleError])

  const handleCheckForExistingUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const { data: existingUserFirstName } = await checkIfUsernameOrEmailAddressExists(emailAddress, true)
      setUser(previousUser => {
        return {
          ...previousUser,
          firstName: existingUserFirstName,
        }
      })
      onInfo(`Hi ${existingUserFirstName}! We found an account associated with: ${emailAddress}.`)
      const { data: registration } = await checkPreviousRegistration(emailAddress)
      const isRegistered = registration === 'registered'
      const needVerification = registration === 'need verification'
      
      if (isRegistered) {
        setStep('already-registered')
      }
      else if (needVerification) {
        setStep('need-verification')
      }
      else {
        setPreviousClient(registration)
        setStep('user-exists')
      }
    } 
    catch ({response: { data }}) {
      onInfo(`Awesome! Let's get a little more information.`)
      setStep('gather-info')
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleRegisterNewUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await register(user)
      onSuccess(data)
      history.push('/send-email/email')
    }
    catch ({ response: { data }}) {
      onError(data)
      setIsLoading(false)
    }
  }
  
  const handleRegisterExistingUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await registerClient()
      onSuccess(data)
      history.push('/sign-in')
    }
    catch ({ response: { data }}) {
      onError(data)
      setIsLoading(false)
    }
  }
  
  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await signIn(password)
      onSuccessSignIn(data)
      history.push(postSignInUrl)
    }
    catch ({ response: { data }}) {
      onError(data)
    }
  }
  
  const handleResendEmailVerification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    history.push('/send-email/email')
  }

  const handleForgotPassword = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    history.push('/send-email/password')
  }

  const handleBackButton = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    setStep('check-email')
  }

  const options = {
    'check-email': {
      title: 'Sign up',
      subheader: `Welcome to ${currentClient}! Please enter your email address and click "Continue".`,
      onSubmit: handleCheckForExistingUser,
      additionalFields: null,
      button: 'Continue',
    },
    'user-exists': {
      title: `Hi ${firstName}`,
      subheader: `We found an account associated with: ${emailAddress} at ${previousClient}. Please click "Add registration" to register your user profile with ${currentClient}.`,
      onSubmit: handleRegisterExistingUser,
      additionalFields: null,
      button: 'Add registration',
    },
    'gather-info': {
      title: 'Sign up',
      subheader: `Please enter the following information and click "Sign up"`,
      onSubmit: handleRegisterNewUser,
      additionalFields: (
        <Fragment>
          <TextField
            name="firstName"
            id="first-name"
            label="First name"
            onChange={handleTextField}
            value={firstName}
            fullWidth
            autoFocus
            required
          />
          <TextField
            name="lastName"
            id="last-name"
            label="Last name"
            onChange={handleTextField}
            value={lastName}
            fullWidth
            required
          />
          <TextField
            name="username"
            id="username"
            label="Username"
            onChange={handleTextField}
            value={username}
            error={!!error.username}
            helperText={error.username}
            fullWidth
            required
          />
          <TextField
            name="password"
            id="password"
            type="password"
            label="Password"
            onChange={handleTextField}
            value={password}
            error={!!error.password}
            helperText={error.password}
            fullWidth
            required
          />
        </Fragment>
      ),
      button: 'Sign up',
    },
    'already-registered': {
      title: `Hi ${firstName}`,
      subheader: `You already have an account with ${currentClient}. Please enter your password and click "Sign in" to continue.`,
      onSubmit: handleSignIn,
      additionalFields: (
        <Fragment>
          <TextField
            name="password"
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={handleTextField}
            error={!!error.password}
            helperText={error.password}
            autoFocus
            fullWidth
            required
          />
          <Link href="#" onClick={handleForgotPassword}>Forgot password</Link>
        </Fragment>
      ),
      button: 'Sign in',
    },
    'need-verification': {
      title: `Hi ${firstName}`,
      subheader: `You already have an account with ${currentClient}, but we need to verify your email address. If you need us to send a new confirimation email, please click Re-send email`,
      onSubmit: handleResendEmailVerification,
      additionalFields: null,
      button: 'Resend email',
    }
  }

  useEffect(() => {
    handleCurrentClientName()
  }, [handleCurrentClientName])

  return (
    <Fragment>
      <Slide direction="left" in={!isLoading} mountOnEnter unmountOnExit>
        <form onSubmit={options[step].onSubmit}>
          <Card>
            <CardHeader 
              title={options[step].title}
              subheader={options[step].subheader}
            />
            <CardContent>
              <TextField
                id="email-address"
                name="emailAddress"
                label="Email address"
                value={emailAddress}
                onChange={handleTextField}
                error={!!error.emailAddress}
                helperText={error.emailAddress}
                disabled={step !== 'check-email'}
                fullWidth
                autoFocus
                required
              />
              { options[step].additionalFields }
            </CardContent>
            <CardActions>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={!!error.emailAddress || !emailAddress}
              >
                {options[step].button}
              </Button>
              {
                step !== 'check-email' ? (
                  <Button
                    variant="contained"
                    onClick={handleBackButton}
                  >
                    Back
                  </Button>
                ) : null
              }
            </CardActions>
          </Card>
        </form>
      </Slide>
      <CircularLoader isLoading={isLoading} fullScreen />
    </Fragment>
  )
}

export default SignUp