import React, { FC } from 'react'
import { Route, RouteProps, Redirect } from 'react-router-dom'

export interface SecureRouteProps extends RouteProps {
  allowedRoles: Array<string> 
  userRoles: Array<string>
  redirectTo?: string
}

const SecureRoute: FC<SecureRouteProps> = (props) => {
  const { allowedRoles, userRoles, redirectTo } = props
  const isAllowed = handleIsAllowed(allowedRoles, userRoles)

  function handleIsAllowed(allowedRoles: Array<string>, userRoles: Array<string>) {
    let isAllowed = false
    allowedRoles.forEach(role => {
      if (!isAllowed && userRoles.includes(role)) isAllowed = true
    })
    return isAllowed
  }

  if (isAllowed) {
    return <Route {...props} />
  }

  return redirectTo ? <Redirect to={redirectTo} /> : null
}

export default SecureRoute