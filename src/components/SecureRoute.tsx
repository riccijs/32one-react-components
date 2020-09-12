import React, { FC } from 'react'
import { Route, RouteProps, Redirect } from 'react-router-dom'

export interface SecureRouteProps extends RouteProps {
  appGroups: Array<string> 
  userGroups: Array<string>
  redirectTo?: string
}

const SecureRoute: FC<SecureRouteProps> = (props) => {
  const { appGroups, userGroups, redirectTo } = props
  const isAllowed = handleIsAllowed(appGroups, userGroups)

  function handleIsAllowed(appGroups: Array<string>, userGroups: Array<string>) {
    let isAllowed = false
    appGroups.forEach(role => {
      if (!isAllowed && userGroups.includes(role)) isAllowed = true
    })
    return isAllowed
  }

  if (isAllowed) {
    return <Route {...props} />
  }

  return redirectTo ? <Redirect to={redirectTo} /> : null
}

export default SecureRoute