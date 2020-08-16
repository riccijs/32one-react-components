import React, { ReactElement } from 'react'
import { makeStyles } from '@material-ui/core'

interface BodyProps {
  children?: ReactElement
}

const useStyles = makeStyles(theme => ({
  container: {
    height: 'inherit',
    background: theme.palette.background.default,
    color: theme.palette.text.primary,
    overflowY: 'scroll',
    overflowX: 'hidden',
  }
}))

const Body = ({ children }: BodyProps) => {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      { children }
    </div>
  )
}

export default Body