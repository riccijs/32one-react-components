import React, { FC, ReactElement, useEffect, useCallback, useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { Card, CardHeader } from '@material-ui/core'
import CircularLoader from '../components/CircularLoader'
import userUser from '../hooks/useUser'

export interface VerifyEmailAddressProps {
  onSuccess?: any
  onError?: any
}

const VerifyEmailAddress: FC<VerifyEmailAddressProps> = ({onSuccess, onError}): ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { search } = useLocation()
  const history = useHistory()
  const handleSuccess = useCallback(onSuccess, [])
  const handleError = useCallback(onError, [])
  const { verifyContactInformation } = userUser()

  const handleVerifyEmailAddress = useCallback(async () => {
    try {
      const { data } = await verifyContactInformation(search)
      if (handleSuccess) handleSuccess(data)
      history.push('/sign-in')
    }
    catch ({ response: { data }}) {
      if (handleError) handleError(data)
      setIsLoading(false)
    }
  }, [handleSuccess, handleError, history, search, verifyContactInformation])

  useEffect(() => {
    handleVerifyEmailAddress()
  }, [handleVerifyEmailAddress])

  return (
    <Card>
      <CardHeader
        title="Unable to verify"
        subheader="We're sorry, but we were unable to verify your email address at this time"
      />
      <CircularLoader isLoading={isLoading} fullScreen />
    </Card>
  )
}

export default VerifyEmailAddress