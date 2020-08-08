import React, { ReactElement } from 'react'
import { makeStyles, Toolbar } from '@material-ui/core'

interface FooterProps {
  children?: ReactElement
  isForSidebar?: true
}

const useStyles = makeStyles(theme => ({
  toolbar: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    background: theme.palette.background.default,
    borderTop: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('md')]: {
      height: theme.spacing(8),
    },
    [theme.breakpoints.down('xs')]: {
      height: theme.spacing(9),
    },
    ...theme.mixins.toolbar,
  },
}))

export default function Footer({ children }: FooterProps) {

  const classes = useStyles()
  return (
    <Toolbar className={classes.toolbar}>
      { children }
    </Toolbar>
  )
}