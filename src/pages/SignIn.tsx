import React, { ReactElement, useState, ChangeEvent, FormEvent, useEffect, FunctionComponent, MouseEvent } from 'react'
import { Card, CardContent, CardHeader, TextField, CardActions, Button, Slide, Link } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import useDefaultApplicationUser from '../hooks/useDefaultApplicationUser'

interface SignInFormData {
  usernameOrEmail: string
  password: string
}

interface SignInProps {
  postSignInUrl: string
  onError?: any
  onSuccess?: any
}

class DefaultFormData {
  public usernameOrEmail: string = ''
  public password: string = ''
}

const SignIn: FunctionComponent<SignInProps> = ({ postSignInUrl, onError, onSuccess }: SignInProps): ReactElement => {
  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState<SignInFormData>(new DefaultFormData())
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const history = useHistory()
  const { checkIfUsernameOrEmailAddressExists, signIn } = useDefaultApplicationUser()

  function handleInput(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const { name, value } = event.target
    setFormData((previousFormData: SignInFormData) => {
      const updatedFormData = {
        ...previousFormData,
        [name]: value
      }
      return updatedFormData
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      if (step === 1) {
        await handleCheckIfUserExists()
        setStep(2)
        setIsLoading(false)
      }
      else {
        const { data } = await handleCheckPassword()
        if (onSuccess) onSuccess(data)
        history.push(postSignInUrl)
      }
    }
    catch (err) {
      const { data: error } = err.response
      setError(error)
      setIsLoading(false)
      if (!!onError) onError(error)
    }
  }

  async function handleCheckIfUserExists() {
    const { usernameOrEmail } = formData
    return await checkIfUsernameOrEmailAddressExists(usernameOrEmail)
  }

  async function handleCheckPassword() {
    const { password } = formData
    return await signIn(password)
  }

  function handleForgotPassword(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    history.push('/send-email/password')
  }

  useEffect(() => {
    if (step === 2 && !isLoading) {
      document.getElementById('password')?.focus()
    }
  }, [step, isLoading])

  useEffect(() => {
    if (!error.includes('password')) {
      setFormData(previousFormData => {
        const formData = {
          ...previousFormData,
          password: ''
        }
        return formData
      })
    }
    if (error.includes('verify')) {
      history.push('/send-email/email')
    }
  }, [error, history])

  return (
    <Slide direction="left" in={!isLoading} mountOnEnter unmountOnExit>
      <Card>
        <CardHeader 
          title="Sign in"
          subheader={`Please enter your ${step === 1 ? 'username or email address' : 'password'}.`}
        />
        <form onSubmit={handleSubmit}>
          <CardContent>
            <TextField
              type={step === 1 ? void 0 : 'password'}
              name={step === 1 ? 'usernameOrEmail' : 'password'}
              id={step === 1 ? 'usernameOrEmail' : 'password'}
              label={step === 1 ? 'Username or email' : 'Password'}
              value={formData[step === 1 ? 'usernameOrEmail' : 'password']}
              onChange={handleInput}
              error={!!error}
              helperText={error}
              disabled={isLoading}
              autoComplete="on"
              fullWidth
              autoFocus
              required
            />
            {
              step === 2 ? (
                <Link href="#" onClick={handleForgotPassword}>Forgot password</Link>
              ) : null
            }
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {step === 1 ? 'Continue' : 'Sign In'}
            </Button>
          </CardActions>
        </form>
      </Card>
    </Slide>
  )
}

export default SignIn