import React, { ReactElement } from 'react'
import { makeStyles, Toolbar, AppBar } from '@material-ui/core'

interface HeaderProps {
  children?: ReactElement
  backgroundColor?: string
  color?: string
}

const useStyles = makeStyles(theme => ({
  toolbar: {
    maxHeight: theme.spacing(4),
    background: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingRight: theme.spacing(1),
    color: theme.palette.text.secondary,
    ...theme.mixins.toolbar,
  },
}))

export default function Header({ children, backgroundColor, color }: HeaderProps) {
  const classes = useStyles()
  const style = { backgroundColor, color }
  return (
    <AppBar position="relative">
      <Toolbar className={classes.toolbar} style={style}>
        { children }
      </Toolbar>
    </AppBar>
  )
}