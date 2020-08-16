import React, { FC, ReactElement, useState, useCallback, useEffect, Fragment } from 'react'
import { Card, CardHeader, CardContent, CardActions, Button, Slide } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import CircularLoader from '../components/CircularLoader'
import useUser from '../hooks/useUser'

export interface SendEmailProps {
  onInfo?: any
  onError?: any
}

const EMAIL_SPECS = {
  email: {
    title: 'Verify your email address',
    verbage: 'confirm your account',
    data: { title: 'Support', template: 'verify-email-address' },
  },
  password: {
    title: 'Reset your password',
    verbage: 'reset your password',
    data: { title: 'Support', template: 'reset-password' }
  }
}

const SendEmail: FC<SendEmailProps> = ({onInfo, onError}): ReactElement => {
  const [responseData, setResponseData] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const handleError = useCallback(onError, [])
  const handleInfo = useCallback(onInfo, [])
  const { type }: {type: 'email' | 'password'} = useParams()
  const { sendEmail } = useUser()

  const sendVerificationEmail = useCallback(async () => {
    setError('')
    setIsLoading(true)
    try {
      const { data: responseData } = await sendEmail(EMAIL_SPECS[type].data)
      setResponseData(responseData)
      setIsLoading(false)
      if (handleInfo) handleInfo(`An email was sent to: ${responseData}`)
    }
    catch({response: { data }}) {
      setError(data)
      setIsLoading(false)
      if (handleError) handleError(data)
    }
  }, [handleError, handleInfo, type, sendEmail])

  useEffect(() => { sendVerificationEmail() }, [sendVerificationEmail])
  
  return (  
    <Fragment>  
      <Slide direction="left" in={!isLoading} mountOnEnter unmountOnExit>
        <Card>
          <CardHeader title={EMAIL_SPECS[type].title} subheader={error || void 0} />
          {
            !error ? (
              <Fragment>
                <CardContent>
                  We sent an email to <strong>{responseData}</strong>.
                  Please follow the instructions in the email to {EMAIL_SPECS[type].verbage}.
                  If you haven't received the email please click below to resend.
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={sendVerificationEmail}
                  >
                    Resend email
                  </Button>
                </CardActions>
              </Fragment>
            ): null
          }
        </Card>
      </Slide>
      <CircularLoader isLoading={isLoading} fullScreen />
    </Fragment>  
  )
}

export default SendEmail