import React, { FC, ReactElement, FormEvent, useState, ChangeEvent } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { Card, CardHeader, CardContent, TextField, CardActions, Button } from '@material-ui/core'
import owasp from 'owasp-password-strength-test'
import CircularLoader from '../components/CircularLoader'
import useUser from '../hooks/useUser'

export interface ResetPasswordProps {
  onSuccess?: any
  onError?: any
}

const ResetPassword: FC<ResetPasswordProps> = ({ onSuccess, onError }): ReactElement => {
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<any>([])
  const { search } = useLocation()
  const history = useHistory()
  const { resetPassword } = useUser()

  function handlePassword(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { value } = event.target
    const { errors } = owasp.test(value)
    setErrors(errors)
    setPassword(value)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await resetPassword(search, password)
      if (onSuccess) onSuccess(data)
      history.push('/sign-in')
    }
    catch ({ response: { data }}) {
      if (onError) onError(data)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader 
          title="Reset your password" 
          subheader={`Enter a new password and click "Update password"`}
        />
        <CardContent>
          <TextField
            label="New password"
            type="password"
            value={password}
            onChange={handlePassword}
            error={!!errors.length}
            helperText={errors.toString()}
            required
            fullWidth
            autoFocus
          />
        </CardContent>
        <CardActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Update password
          </Button>
        </CardActions>
      </Card>
      <CircularLoader isLoading={isLoading} fullScreen />
    </form>
  )
}

export default ResetPassword