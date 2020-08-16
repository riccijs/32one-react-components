import React, { FC, ReactElement } from 'react'
import { CardHeader, makeStyles, CardHeaderProps } from '@material-ui/core'

const useStyles = makeStyles({
  cardHeader: {
    width: '100%',
    textAlign: 'center',
  }
})

const StaticMessage: FC<CardHeaderProps> = (props): ReactElement => {
  const classes = useStyles()
  return (
    <CardHeader className={classes.cardHeader} {...props} />
  )
}

export default StaticMessage